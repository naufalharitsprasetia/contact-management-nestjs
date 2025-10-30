import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
import { Address, User } from '@prisma/client';
import { AddressValidation } from './addresss.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {}

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    const createRequest: CreateAddressRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );
    await this.contactService.checkContactMustExists(
      user.username,
      createRequest.contact_id,
    );

    const address = await this.prismaService.address.create({
      data: createRequest,
    });

    return this.toAddressResponse(address);
  }

  toAddressResponse(address: Address) {
    return {
      id: address.id,
      city: address.city,
      province: address.province,
      street: address.street,
      country: address.country,
      postal_code: address.postal_code,
    };
  }
  async checkAddressmustExist(
    contactId: number,
    addressId: number,
  ): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });
    if (!address) {
      throw new HttpException('Address not Founnd', 404);
    }
    return address;
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    const getRequest: GetAddressRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );
    await this.contactService.checkContactMustExists(
      user.username,
      getRequest.contact_id,
    );
    const address = await this.checkAddressmustExist(
      getRequest.contact_id,
      getRequest.address_id,
    );
    return this.toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    const updateRequest: UpdateAddressRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );
    await this.contactService.checkContactMustExists(
      user.username,
      updateRequest.contact_id,
    );

    let address = await this.checkAddressmustExist(
      updateRequest.contact_id,
      updateRequest.id,
    );
    address = await this.prismaService.address.update({
      where: {
        id: address.id,
        contact_id: address.contact_id,
      },
      data: updateRequest,
    });

    return this.toAddressResponse(address);
  }
  async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    const removeRequest: RemoveAddressRequest = this.validationService.validate(
      AddressValidation.REMOVE,
      request,
    );
    await this.contactService.checkContactMustExists(
      user.username,
      removeRequest.contact_id,
    );
    await this.checkAddressmustExist(
      removeRequest.contact_id,
      removeRequest.address_id,
    );
    const address = await this.prismaService.address.delete({
      where: {
        id: removeRequest.address_id,
        contact_id: removeRequest.contact_id,
      },
    });

    return this.toAddressResponse(address);
  }
  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    await this.contactService.checkContactMustExists(user.username, contactId);
    const addresses = await this.prismaService.address.findMany({
      where: {
        contact_id: contactId,
      },
    });
    return addresses.map((address) => this.toAddressResponse(address));
  }
}
