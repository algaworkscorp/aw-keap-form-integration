import { redirect } from 'next/navigation';

export const runtime = 'edge';
import {
  achieveGoal,
  createContact,
  resolveCustomFields,
  searchContactByEmail,
  updateContact,
} from '@/lib/keap/client';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function technicalError(hint: string): never {
  redirect(`/error/technical?hint=${encodeURIComponent(hint)}`);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const firstName = (formData.get('name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const rawPhone = (formData.get('phone') as string | null) ?? '';
  const urlSucesso = (formData.get('success_url') as string | null)?.trim() ?? '';
  const callname = (formData.get('callname') as string | null)?.trim() ?? '';
  const integration = (formData.get('integration') as string | null)?.trim() ?? '';
  const company = (formData.get('company') as string | null)?.trim() ?? '';
  const jobTitle = (formData.get('job_title') as string | null)?.trim() ?? '';

  const phone = rawPhone.replace(/\D/g, '');

  const isValid =
    firstName !== '' &&
    email !== '' &&
    EMAIL_REGEX.test(email) &&
    phone !== '' &&
    urlSucesso !== '' &&
    isValidUrl(urlSucesso) &&
    callname !== '' &&
    integration !== '';

  if (!isValid) {
    redirect('/error/validation');
  }

  const rawCustomFields: { name: string; value: string }[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('customField_') && typeof value === 'string' && value.trim() !== '') {
      rawCustomFields.push({ name: key.slice('customField_'.length), value: value.trim() });
    }
  }

  let contactId: string;

  try {
    const customFields = await resolveCustomFields(rawCustomFields);

    const spaceIndex = firstName.indexOf(' ');
    const givenName = spaceIndex === -1 ? firstName : firstName.slice(0, spaceIndex);
    const familyName = spaceIndex === -1 ? undefined : firstName.slice(spaceIndex + 1);

    const contactPayload = {
      given_name: givenName,
      ...(familyName && { family_name: familyName }),
      ...(company && { company: { company_name: company } }),
      ...(jobTitle && { job_title: jobTitle }),
      email_addresses: [{ email: email, field: 'EMAIL1' as const }],
      phone_numbers: [{ number: phone, field: 'PHONE1' as const }],
      custom_fields: customFields,
    };

    const existingId = await searchContactByEmail(email);

    if (existingId) {
      await updateContact(existingId, contactPayload);
      contactId = existingId;
    } else {
      contactId = await createContact(contactPayload);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[keap] ${new Date().toISOString()} erro ao criar/atualizar contato`, {
      firstName,
      operation: 'createOrUpdateContact',
      error: message,
    });
    technicalError(message);
  }

  try {
    await achieveGoal({ call_name: callname, contact_id: contactId, integration });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[keap] ${new Date().toISOString()} erro ao disparar goal`, {
      firstName,
      contactId,
      callname,
      integration,
      error: message,
    });
    technicalError(message);
  }

  redirect(urlSucesso);
}
