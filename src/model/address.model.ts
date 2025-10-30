export class AddressResponse {
  id: number | null;
  country: string;
  postal_code: string;
  street?: string | null;
  province?: string | null;
  city?: string | null;
}
export class CreateAddressRequest {
  country: string;
  postal_code: string;
  street?: string | null;
  province?: string | null;
  city?: string | null;
}
