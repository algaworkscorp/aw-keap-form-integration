# Requisitos — Integração de Formulários com Infusionsoft

## Visão Geral

Endpoint que recebe submissões de formulários em landing pages, valida os dados, integra com o Infusionsoft (Keap) e redireciona o usuário para uma URL de sucesso.

---

## Endpoint

```
POST /keap/form-integration
Content-Type: application/x-www-form-urlencoded
```

---

## Campos do Formulário

### Obrigatórios

| Campo               | Descrição                                        |
|---------------------|--------------------------------------------------|
| `name` | Primeiro nome do lead                                      |
| `email`     | E-mail do lead                                             |
| `phone`    | Telefone do lead                                           |
| `success_url`         | URL para redirecionar após processamento bem-sucedido      |
| `callname`            | Call name do goal de automação a ser disparado             |
| `integration`         | Nome da integração, passado no payload do achieve goal     |

### Opcionais — Campos Customizados

Qualquer campo prefixado com `customField_` é tratado como campo customizado do contato no Infusionsoft. O prefixo `customField_` é removido antes de enviar à API — somente a parte restante é usada como nome do campo.

**Exemplos:**

| Campo recebido no POST         | Nome do campo no Infusionsoft |
|-------------------------------|-------------------------------|
| `customField_MTEMS6UTMSource`  | `MTEMS6UTMSource`             |
| `customField_MTEMS6UTMMedium`  | `MTEMS6UTMMedium`             |
| `customField_MTEMS6UTMCampaign`| `MTEMS6UTMCampaign`           |
| `customField_MTEMS6UTMTerm`    | `MTEMS6UTMTerm`               |
| `customField_MTEMS6UTMContent` | `MTEMS6UTMContent`            |

---

## Fluxo de Processamento

```
POST /keap/form-integration
        │
        ▼
┌─────────────────────────┐
│  1. Validar campos       │ ──erro──► Página de erro de validação (+ link voltar)
└────────────┬────────────┘
             │ ok
             ▼
┌─────────────────────────┐
│  2. Buscar contato por   │
│     e-mail no Keap       │
└────────────┬────────────┘
             │
        ┌────┴────┐
      existe    não existe
        │            │
        ▼            ▼
   PATCH contact  POST contact
   (atualizar)    (criar)
        │            │
        └────┬────┘
             │ erro ──────────► Página de erro técnico (+ link voltar)
             │ ok
             ▼
┌─────────────────────────┐
│  3. Achieve automation   │
│     goal (callname)      │
└────────────┬────────────┘
             │ erro ──────────► Página de erro técnico (+ link voltar)
             │ ok
             ▼
     Redirect → success_url
```

---

## Passo 1 — Validação e Normalização

Validar antes de qualquer chamada de API:

- `name`: não vazio
- `email`: não vazio e formato de e-mail válido
- `phone`: não vazio; antes de usar, remover todos os caracteres que não sejam dígitos `0–9` (ex: `(11) 98765-4321` → `11987654321`)
- `success_url`: não vazio e URL válida (deve aceitar `http://` e `https://`)
- `callname`: não vazio
- `integration`: não vazio

**Em caso de falha:** renderizar página de erro de validação (ver seção "Páginas de Erro").

### Separação de nome e sobrenome

Após validação, separar `name` em `given_name` e `family_name`:

- Se o valor contiver **apenas uma palavra**: usar como `given_name`; `family_name` não é enviado.
- Se contiver **duas ou mais palavras**: a primeira palavra é o `given_name`; o restante (tudo após o primeiro espaço) é o `family_name`.

**Exemplos:**

| `name` recebido | `given_name` | `family_name`   |
|-------------------------------|--------------|-----------------|
| `João`                        | `João`       | —               |
| `João Silva`                  | `João`       | `Silva`         |
| `João da Silva Sauro`         | `João`       | `da Silva Sauro`|

---

## Passo 2 — Criar ou Atualizar Contato no Keap

### 2a. Buscar contato pelo e-mail

```
GET /rest/v2/contacts?filter=EMAIL%3D%3D{email}&page_size=1
```

- Se retornar 1 ou mais resultados: usar o primeiro (`contacts[0].id`) → atualizar (PATCH)
- Se retornar lista vazia: criar (POST)

### 2b-i. Criar contato (não encontrado)

```
POST /rest/v2/contacts
```

Payload:
```json
{
  "given_name": "<primeira palavra de name>",
  "family_name": "<restante de name, se houver>",
  "email_addresses": [
    { "email": "<email>", "field": "EMAIL1" }
  ],
  "phone_numbers": [
    { "number": "<phone>", "field": "PHONE1" }
  ],
  "custom_fields": [
    { "id": <id_numérico_do_campo>, "content": "<valor>" }
  ]
}
```

> Os campos customizados são incluídos diretamente no corpo de criação; nenhuma chamada separada é necessária.
> O `id` de cada custom field é um inteiro obtido via `GET /rest/v2/contacts/model` — não o nome do campo.

### 2b-ii. Atualizar contato (encontrado)

```
PATCH /rest/v2/contacts/{contact_id}
```

Mesmo payload acima (sem o e-mail, que já é a chave de busca — ou incluir para garantir sincronização, dependendo do comportamento da API).

---

## Passo 3 — Achieve Automation Goal

```
POST /rest/v2/automations/goals/achieve
```

Payload:
```json
{
  "call_name": "<callname>",
  "contact_id": "<id_do_contato>",
  "integration": "<integration>"
}
```

> O endpoint retorna **sempre HTTP 200**, mesmo quando nenhuma automação foi disparada. O campo `results[0].success` indica se o goal foi efetivamente acionado — `false` deve ser tratado como erro técnico.

---

## Páginas de Erro

Ambas as páginas de erro devem ser renderizadas como HTML limpo, visualmente adequado (sem detalhes técnicos expostos ao usuário).

### Erro de validação

- Título: "Campos inválidos ou ausentes"
- Mensagem: informar que um ou mais campos obrigatórios não foram preenchidos corretamente
- Link: "← Voltar" via `history.back()` (JavaScript)

### Erro técnico (falha na API)

- Título: "Erro técnico"
- Mensagem: "Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente."
- **Não** expor mensagens de erro da API nem stack traces
- Link: "← Voltar" via `history.back()` (JavaScript)

---

## Autenticação com Infusionsoft

Usar token de serviço de longa duração gerado no portal do Keap, configurado via variável de ambiente.

Variáveis de ambiente necessárias:

| Variável            | Descrição                     |
|---------------------|-------------------------------|
| `KEAP_ACCESS_TOKEN` | Access token gerado no portal |

---

## Tratamento de Erros da API

| Situação                        | Comportamento                        |
|---------------------------------|--------------------------------------|
| Erro de rede / timeout          | Renderizar página de erro técnico    |
| HTTP 4xx da API do Keap         | Renderizar página de erro técnico    |
| HTTP 5xx da API do Keap         | Renderizar página de erro técnico    |
| `contact_id` não retornado      | Renderizar página de erro técnico    |

Todos os erros devem ser logados server-side com detalhes suficientes para diagnóstico (payload de entrada — sem dados sensíveis —, resposta da API, timestamp).

---

## Estrutura de Arquivos Sugerida (Next.js)

```
app/
  keap/
    form-integration/
      route.ts          ← handler POST
lib/
  keap/
    client.ts           ← funções de chamada à API (getOrCreateContact, achieveGoal)
    auth.ts             ← obtenção e cache do access token
    types.ts            ← tipos TypeScript dos payloads
app/
  error/
    validation/
      page.tsx          ← página de erro de validação
    technical/
      page.tsx          ← página de erro técnico
```

---

## Notas de Implementação

- O endpoint deve funcionar como **Route Handler** do Next.js (`app/keap/form-integration/route.ts`), exportando uma função `POST`.
- O body do POST vem como `application/x-www-form-urlencoded`; usar `request.formData()` para ler os campos.
- As páginas de erro podem ser renderizadas via `redirect` para rotas internas com parâmetros de query, ou via resposta HTML direta.
- Não logar o valor de campos sensíveis (`email`, `phone`) em produção.
