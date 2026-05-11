# Integração Infusionsoft / Keap

Serviço de integração de formulários de landing pages com o CRM Keap (Infusionsoft). Recebe submissões via POST, cria ou atualiza o contato no Keap e dispara uma automação, redirecionando o usuário para uma URL de sucesso.

## Stack

- **Next.js 15** (App Router, Edge Runtime)
- **TypeScript 5**
- **Vercel** (hospedagem)

## Estrutura do projeto

```
app/
  keap/
    form-integration/
      route.ts          ← handler POST principal
  error/
    validation/
      page.tsx          ← página de erro de validação
    technical/
      page.tsx          ← página de erro técnico
lib/
  keap/
    client.ts           ← chamadas à API do Keap
    auth.ts             ← leitura do access token
    types.ts            ← tipos TypeScript dos payloads
test/
  index.html            ← formulário de teste local
  form.js               ← script auxiliar do formulário de teste
docs/
  requisitos.md         ← especificação completa do comportamento
  infusionsoft-api.md   ← referência da REST API v2 do Keap
```

## Endpoint

```
POST /keap/form-integration
Content-Type: application/x-www-form-urlencoded
```

### Campos obrigatórios

| Campo                 | Descrição                                                        |
|-----------------------|------------------------------------------------------------------|
| `inf_field_FirstName` | Nome completo do lead                                            |
| `inf_field_Email`     | E-mail do lead                                                   |
| `inf_field_Phone1`    | Telefone (caracteres não numéricos são removidos automaticamente)|
| `url_sucesso`         | URL de redirecionamento após sucesso (`http://` ou `https://`)   |
| `callname`            | Call name do goal de automação a ser disparado                   |
| `integration`         | Nome da integração, enviado no payload do achieve goal           |

### Campos customizados (opcionais)

Qualquer campo prefixado com `inf_custom_` é mapeado como campo customizado do contato. O prefixo é removido antes do envio à API.

**Exemplo:** `inf_custom_MTEMS6UTMSource` → campo `MTEMS6UTMSource` no Keap.

## Fluxo de processamento

```
POST /keap/form-integration
        │
        ▼
┌──────────────────────┐
│  1. Validar campos    │ ──erro──► /error/validation
└──────────┬───────────┘
           │ ok
           ▼
┌──────────────────────┐
│  2. Buscar contato    │
│     por e-mail        │
└──────────┬───────────┘
           │
      ┌────┴────┐
    existe   não existe
      │           │
      ▼           ▼
 PATCH contact  POST contact
      │           │
      └────┬──────┘
           │ erro ──────────► /error/technical
           │ ok
           ▼
┌──────────────────────┐
│  3. Achieve goal      │
│     (callname)        │
└──────────┬───────────┘
           │ erro ──────────► /error/technical
           │ ok
           ▼
    Redirect → url_sucesso
```

## Configuração

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
KEAP_ACCESS_TOKEN=KeapAK-...
```

O token de serviço de longa duração é gerado no portal do Keap em **Settings → Integrations → Service Tokens**.

> **Nunca commite o `.env.local`** — ele já está no `.gitignore`.

### Instalação e execução local

```bash
npm install
npm run dev
```

O servidor sobe em `http://localhost:3000`.

## Teste local

Abra o arquivo `test/index.html` diretamente no navegador. Ele exibe um formulário pré-preenchido que envia para `http://localhost:3000/keap/form-integration`, com suporte a adicionar campos customizados dinamicamente.

## Deploy

O deploy é feito via **Vercel**. Configure a variável de ambiente `KEAP_ACCESS_TOKEN` no painel da Vercel em **Project Settings → Environment Variables**.

```bash
# Build de produção local (opcional)
npm run build
npm start
```

## Páginas de erro

| Rota                | Quando é exibida                                         |
|---------------------|----------------------------------------------------------|
| `/error/validation` | Campos obrigatórios ausentes ou em formato inválido      |
| `/error/technical`  | Falha na API do Keap (4xx, 5xx, timeout, goal não acionado) |

Ambas exibem um link "← Voltar" via `history.back()` e não expõem detalhes técnicos ao usuário. Os erros são logados server-side com timestamp e contexto suficiente para diagnóstico.

## Referências

- [Requisitos detalhados](docs/requisitos.md)
- [Referência da API Keap REST v2](docs/infusionsoft-api.md)
