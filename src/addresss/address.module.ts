import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AdderssController } from './address.controller';
import { ContactService } from '../contact/contact.service';

@Module({
  imports: [ContactService],
  providers: [AddressService],
  controllers: [AdderssController],
})
export class AddressModule {}
