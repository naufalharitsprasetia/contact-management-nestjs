export class AddressResponse {
  id: number | null;
  country: string;
  postal_code: string;
  street?: string | null;
  province?: string | null;
  city?: string | null;
}
export class CreateAddressRequest {
  contact_id: number;
  country: string;
  postal_code: string;
  street?: string | null;
  province?: string | null;
  city?: string | null;
}
export class UpdateAddressRequest {
  id: number;
  contact_id: number;
  country: string;
  postal_code: string;
  street?: string | null;
  province?: string | null;
  city?: string | null;
}
export class GetAddressRequest {
  contact_id: number;
  address_id: number;
}
export class RemoveAddressRequest {
  contact_id: number;
  address_id: number;
}
