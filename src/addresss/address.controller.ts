import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import type { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
import { WebResponse } from '../model/web.model';

@Controller('/api/contacts/:contactId/addresses')
export class AdderssController {
  constructor(private addrressService: AddressService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    const result = await this.addrressService.create(user, request);
    return {
      data: result,
    };
  }

  @Get('/:addressId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<WebResponse<AddressResponse>> {
    const request: GetAddressRequest = {
      contact_id: contactId,
      address_id: addressId,
    };

    const result = await this.addrressService.get(user, request);
    return {
      data: result,
    };
  }

  @Put('/:addressId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() request: UpdateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contact_id = contactId;
    request.id = addressId;
    const result = await this.addrressService.update(user, request);
    return {
      data: result,
    };
  }

  @Delete('/:addressId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ): Promise<WebResponse<boolean>> {
    const request: RemoveAddressRequest = {
      contact_id: contactId,
      address_id: addressId,
    };

    await this.addrressService.remove(user, request);
    return {
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<AddressResponse[]>> {
    const result = await this.addrressService.list(user, contactId);
    return {
      data: result,
    };
  }
}
