import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AdderssController } from './address.controller';
import { ContactService } from '../contact/contact.service';

@Module({
  providers: [AddressService, ContactService],
  controllers: [AdderssController],
})
export class AddressModule {}
