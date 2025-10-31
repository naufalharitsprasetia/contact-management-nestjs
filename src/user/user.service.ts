/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
import { Logger } from 'winston';
import { ValidationService } from './../common/validation.service';
import {
  Body,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register New User ${JSON.stringify(request)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });
    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already registered', 400);
    }
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });
    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    const loginUserRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginUserRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Username or Password is Wrong', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Username or Password is invalid', 401);
    }
    // Generate JWT token
    const payload = { username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return {
      username: user.username,
      name: user.name,
      token: token,
    };
  }
  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }
  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );
    if (updateRequest.name) {
      user.name = updateRequest.name;
    }
    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }
    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });
    return {
      name: result.name,
      username: result.username,
    };
  }
  async logout(user: User): Promise<UserResponse> {
    const result = await this.prismaService.user.findFirst({
      where: {
        username: user.username,
      },
    });
    document.cookie = 'token=; Max-Age=0; path=/;';
    window.location.href = '/login';
    return {
      name: result!.name,
      username: result!.username,
    };
  }
}
