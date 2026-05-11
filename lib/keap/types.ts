export interface ContactPayload {
  given_name: string;
  family_name?: string;
  email_addresses: { email: string; field: 'EMAIL1' }[];
  phone_numbers: { number: string; field: 'PHONE1' }[];
  custom_fields: { id: number; content: string }[];
}

export interface AchieveGoalPayload {
  call_name: string;
  contact_id: string;
  integration: string;
}

export interface KeapContactsResponse {
  contacts: { id: string }[];
}

export interface KeapCreateContactResponse {
  id: string;
}

export interface KeapContactModel {
  custom_fields: { id: number; label: string; field_name: string }[];
}
