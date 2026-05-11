import { getAccessToken } from './auth';
import type {
  AchieveGoalPayload,
  ContactPayload,
  KeapContactModel,
  KeapContactsResponse,
  KeapCreateContactResponse,
} from './types';

const BASE_URL = 'https://api.infusionsoft.com/crm';

async function keapFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Keap API ${res.status}: ${body}`);
  }

  return res;
}

// Cache em memória: field_name → id numérico
let customFieldCache: Map<string, number> | null = null;

async function getCustomFieldMap(): Promise<Map<string, number>> {
  if (customFieldCache) return customFieldCache;

  const res = await keapFetch('/rest/v2/contacts/model');
  const data: KeapContactModel = await res.json();

  customFieldCache = new Map(
    data.custom_fields.map((f) => [f.field_name, f.id])
  );

  return customFieldCache;
}

export async function resolveCustomFields(
  fields: { name: string; value: string }[]
): Promise<{ id: number; content: string }[]> {
  if (fields.length === 0) return [];

  const map = await getCustomFieldMap();
  const resolved: { id: number; content: string }[] = [];

  for (const { name, value } of fields) {
    const id = map.get(name);
    if (id !== undefined) {
      resolved.push({ id, content: value });
    } else {
      throw new Error(`Campo customizado desconhecido no modelo do Keap: "${name}"`);
    }
  }

  return resolved;
}

export async function searchContactByEmail(email: string): Promise<string | null> {
  const encoded = encodeURIComponent(`EMAIL==${email}`);
  const res = await keapFetch(`/rest/v2/contacts?filter=${encoded}&page_size=1`);
  const data: KeapContactsResponse = await res.json();
  return data.contacts?.[0]?.id ?? null;
}

export async function createContact(payload: ContactPayload): Promise<string> {
  const res = await keapFetch('/rest/v2/contacts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data: KeapCreateContactResponse = await res.json();
  if (!data.id) throw new Error('Keap não retornou contact_id após criação');
  return data.id;
}

export async function updateContact(contactId: string, payload: ContactPayload): Promise<void> {
  await keapFetch(`/rest/v2/contacts/${contactId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function achieveGoal(payload: AchieveGoalPayload): Promise<void> {
  const res = await keapFetch('/rest/v2/automations/goals/achieve', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json() as { results: { success: boolean; message: string }[] };
  const result = data.results?.[0];
  if (!result?.success) {
    throw new Error(
      `Nenhuma automação disparada (callname="${payload.call_name}", integration="${payload.integration}"): ${result?.message ?? 'sem detalhes'}`
    );
  }
}
