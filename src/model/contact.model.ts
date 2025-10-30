export class ContactResponse {
  id?: number | null;
  first_name: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
}
export class CreateContactRequest {
  first_name: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
}
export class UpdateContactRequest {
  id: number;
  first_name: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
}
