# Keap API (Infusionsoft) — REST API v2

## Descobertas de Implementação

Comportamentos confirmados em produção que diferem ou complementam a documentação oficial:

- **Filtro de contatos por e-mail**: o campo correto é `EMAIL`, não `email_address`.
  ```
  GET /rest/v2/contacts?filter=EMAIL%3D%3D{email}&page_size=1
  ```

- **Campo de e-mail em `email_addresses`**: a propriedade correta é `email`, não `address`.
  ```json
  { "field": "EMAIL1", "email": "fulano@exemplo.com" }
  ```

- **IDs de custom fields são numéricos**: o campo `id` em `custom_fields` deve ser o inteiro retornado por `GET /rest/v2/contacts/model`, não o nome do campo.
  ```json
  { "id": 7, "content": "valor" }
  ```

- **Autenticação**: `client_id` e `client_secret` não são necessários para chamadas à API quando se usa um access token de serviço (`KEAP_ACCESS_TOKEN`). Apenas o Bearer token é suficiente.

- **`POST /rest/v2/automations/goals/achieve` retorna sempre HTTP 200**, mesmo quando nenhuma automação foi disparada. Verificar `results[0].success` para saber se o goal foi efetivamente acionado — `false` significa que o `call_name`/`integration` não correspondem a nenhuma automação ativa.

---

## Informações Gerais
- **Produto**: Keap API (antigo Infusionsoft)
- **Versão da API**: v2
- **Base URL**: `https://api.infusionsoft.com/crm`
- **Spec OpenAPI**: https://crm.infusionsoft.com/app/v3/api-docs/V2
- **Autenticação**: OAuth2

## Paginação
Padrão em todas as listagens:
- `page_token` — Token para próxima página
- `page_size` — Itens por página (máximo: 1000)
- `order_by` — Campo e direção (ex: `id asc`)
- `filter` — Filtros com operador `==` (URL-encoded: `%3D%3D`)

## Códigos de Resposta HTTP
| Código | Significado         |
|--------|---------------------|
| 200    | OK                  |
| 201    | Criado              |
| 204    | Sem conteúdo        |
| 400    | Requisição inválida |
| 401    | Não autorizado      |
| 403    | Proibido            |
| 404    | Não encontrado      |
| 409    | Conflito            |
| 500    | Erro no servidor    |
| 501    | Não implementado    |

---

## Endpoints

### Afiliados (Affiliates)
- `GET    /rest/v2/affiliates` — List Affiliates
- `POST   /rest/v2/affiliates` — Create an Affiliate
- `GET    /rest/v2/affiliates/{id}` — Retrieve an Affiliate
- `DELETE /rest/v2/affiliates/{id}` — Delete Affiliate
- `PATCH  /rest/v2/affiliates/{id}` — Update an Affiliate
- `POST   /rest/v2/affiliates/{id}:assignToProgram` — Assign Affiliate to Commission program
- `POST   /rest/v2/affiliates/{id}:removeFromProgram` — Remove an Affiliate from a Commission Program
- `GET    /rest/v2/affiliates/model` — Retrieve Affiliate Model
- `POST   /rest/v2/affiliates/model/customFields` — Create an Affiliate Custom Field
- `DELETE /rest/v2/affiliates/model/customFields/{custom_field_id}` — Delete a Custom Field
- `PATCH  /rest/v2/affiliates/model/customFields/{custom_field_id}` — Update a Custom Field
- `GET    /rest/v2/affiliates/redirects` — List Affiliate Links
- `POST   /rest/v2/affiliates/redirects` — Create an Affiliate Link
- `GET    /rest/v2/affiliates/redirects/{redirect_id}` — Retrieve an Affiliate Link
- `DELETE /rest/v2/affiliates/redirects/{redirect_id}` — Delete an Affiliate Link
- `PATCH  /rest/v2/affiliates/redirects/{redirect_id}` — Update an Affiliate Link
- `GET    /rest/v2/affiliates/summaries` — List Affiliate Summaries
- `GET    /rest/v2/affiliates/commissionPrograms` — List Affiliate Commission Programs
- `POST   /rest/v2/affiliates/commissionPrograms` — Create an Affiliate Commission Program
- `GET    /rest/v2/affiliates/commissionPrograms/{commission_program_id}` — Retrieve a Commission Program
- `DELETE /rest/v2/affiliates/commissionPrograms/{commission_program_id}` — Delete a Commission Program
- `PATCH  /rest/v2/affiliates/commissionPrograms/{commission_program_id}` — Update an Affiliate Commission Program
- `GET    /rest/v2/affiliates/commissionPrograms/{commission_program_id}/resources` — Retrieve Commission Program Resources
- `GET    /rest/v2/affiliates/{affiliate_id}/commissionTotal` — Retrieve Affiliate Commission Earned
- `GET    /rest/v2/affiliates/{affiliate_id}/payments` — List Affiliate Payments
- `GET    /rest/v2/affiliates/{affiliate_id}/referrals` — Retrieve Affiliate Referrals
- `GET    /rest/v2/affiliates/{affiliate_id}:commissions` — Retrieve Affiliate Commissions

### Automações (Automations)
- `GET    /rest/v2/automations` — List Automations
- `DELETE /rest/v2/automations` — Delete an Automation
- `GET    /rest/v2/automations/ids` — List Automations Ids
- `POST   /rest/v2/automations/batch-unpublish` — Bulk unpublish Automations
- `POST   /rest/v2/automations/goals/achieve` — **Achieve an Automation Goal** ⭐
- `POST   /rest/v2/automations/categories/batchAssign` — Bulk update for Automations Categories
- `GET    /rest/v2/automations/{automation_id}` — Retrieve an Automation
- `PUT    /rest/v2/automations/{automation_id}/unpublish` — Unpublish an Automation
- `POST   /rest/v2/automations/{automation_id}/sequences/{sequence_id}:addContacts` — Add Contacts to an Automation Sequence
- `GET    /rest/v2/automationCategory` — List automation categories
- `POST   /rest/v2/automationCategory` — Create automation category
- `DELETE /rest/v2/automationCategory` — Delete automation category
- `PATCH  /rest/v2/automationCategory/{id}` — Update automation category

### Campanhas (Campaigns) — Legacy
- `GET    /rest/v2/campaigns` — List Campaigns
- `GET    /rest/v2/campaigns/{campaign_id}` — Retrieve a Campaign
- `GET    /rest/v2/campaigns/{campaign_id}/goals` — Retrieve a list of Goals for a Campaign
- `GET    /rest/v2/campaigns/{campaign_id}/sequences` — Retrieve a list of Sequences for a Campaign
- `POST   /rest/v2/campaigns/{campaign_id}/sequences/{sequence_id}:addContacts` — Add Contacts to Campaign Sequence
- `POST   /rest/v2/campaigns/{campaign_id}/sequences/{sequence_id}:removeContacts` — Remove Contacts from Campaign Sequence

### Contatos (Contacts) ⭐
- `GET    /rest/v2/contacts` — List Contacts
- `POST   /rest/v2/contacts` — **Create a Contact**
- `GET    /rest/v2/contacts/model` — Retrieve Contact Model
- `POST   /rest/v2/contacts/model/customFields` — Create a Contact Custom Field
- `GET    /rest/v2/contacts/{contact_id}` — Retrieve a Contact
- `DELETE /rest/v2/contacts/{contact_id}` — Delete a Contact
- `PATCH  /rest/v2/contacts/{contact_id}` — **Update a Contact** (inclui custom_fields)
- `GET    /rest/v2/contacts/{contact_id}/leadScore` — Retrieve Lead Score of a Contact
- `GET    /rest/v2/contacts/{contact_id}/tags` — List Applied Tags
- `GET    /rest/v2/contacts/{contact_id}/notes` — List Notes
- `POST   /rest/v2/contacts/{contact_id}/notes` — Create a Note
- `GET    /rest/v2/contacts/{contact_id}/notes/{note_id}` — Retrieve a Note
- `DELETE /rest/v2/contacts/{contact_id}/notes/{note_id}` — Delete a Note
- `PATCH  /rest/v2/contacts/{contact_id}/notes/{note_id}` — Update a Note
- `GET    /rest/v2/contacts/{contact_id}/links` — List Linked Contacts
- `POST   /rest/v2/contacts:link` — Link Contacts
- `POST   /rest/v2/contacts:unlink` — Delete Link between two Contacts
- `GET    /rest/v2/contacts/links/types` — List Contact Link types
- `POST   /rest/v2/contacts/links/types` — Create a Contact Link type
- `GET    /rest/v2/contacts/{contact_id}/paymentMethods` — List of Contact Payment Methods
- `DELETE /rest/v2/contacts/{contact_id}/paymentMethods/{payment_method_id}` — Delete a Contact Payment Method
- `POST   /rest/v2/contacts/{contact_id}/paymentMethods/{payment_method_id}:deactivate` — Deactivate a Contact Payment Method

### Empresas (Companies)
- `GET    /rest/v2/companies` — List Companies
- `POST   /rest/v2/companies` — Create a Company
- `GET    /rest/v2/companies/{company_id}` — Retrieve a Company
- `DELETE /rest/v2/companies/{company_id}` — Delete a Company
- `PATCH  /rest/v2/companies/{company_id}` — Update a Company
- `GET    /rest/v2/companies/model` — Retrieve Company Custom Field Model
- `POST   /rest/v2/companies/model/customFields` — Create a Company Custom Field
- `PATCH  /rest/v2/companies/model/customFields/{custom_field_id}` — Update a Company Custom Field
- `GET    /rest/v2/companies/{company_id}/tags` — List Applied Tags
- `POST   /rest/v2/companies/{company_id}/tags/{tag_id}` — Add Tag to Company
- `DELETE /rest/v2/companies/{company_id}/tags/{tag_id}` — Remove Tag

### Descontos (Discounts)
- `GET/POST /rest/v2/discounts/freeTrials` — Subscription Free Trial Discounts
- `GET/DELETE/PATCH /rest/v2/discounts/freeTrials/{discount_id}` — Manage Free Trial Discount
- `GET/POST /rest/v2/discounts/orderTotals` — Order Total Discounts
- `GET/DELETE/PATCH /rest/v2/discounts/orderTotals/{discount_id}` — Manage Order Total Discount
- `GET/POST /rest/v2/discounts/productCategories` — Category Discounts
- `GET/DELETE/PATCH /rest/v2/discounts/productCategories/{discount_id}` — Manage Category Discount
- `GET/POST /rest/v2/discounts/products` — Product Discounts
- `GET/DELETE/PATCH /rest/v2/discounts/products/{discount_id}` — Manage Product Discount
- `GET/POST /rest/v2/discounts/shipping` — Shipping Discounts
- `GET/DELETE/PATCH /rest/v2/discounts/shipping/{discount_id}` — Manage Shipping Discount

### Emails
- `GET    /rest/v2/emails` — List Emails
- `POST   /rest/v2/emails` — Create an Email Record
- `GET    /rest/v2/emails/{id}` — Retrieve an Email
- `DELETE /rest/v2/emails/{id}` — Delete an Email Record
- `POST   /rest/v2/emails:batchAdd` — Create a set of Email Records
- `POST   /rest/v2/emails:batchRemove` — Remove a set of Email Records
- `POST   /rest/v2/emails:send` — Send an Email
- `GET    /rest/v2/emails/templates/{email_template_id}` — Retrieve an email template
- `POST   /rest/v2/emails/templates:send` — Send an email based on a template
- `GET    /rest/v2/emailAddresses/{email}/status` — Retrieve an Email Address status
- `PATCH  /rest/v2/emailAddresses/{email}/status` — Update an Email Address opt-in status

### Arquivos (Files)
- `GET    /rest/v2/files` — List all files
- `POST   /rest/v2/files` — Create a file
- `GET    /rest/v2/files/{file_id}` — Retrieve a file
- `POST   /rest/v2/files/{file_id}` — Update a file
- `DELETE /rest/v2/files/{file_id}` — Delete a file
- `GET    /rest/v2/files/{file_id}:data` — Retrieve a file's data

### Fontes de Leads (Lead Sources)
- `GET    /rest/v2/leadSources` — List Lead Sources
- `POST   /rest/v2/leadSources` — Create a Lead Source
- `GET    /rest/v2/leadSources/{lead_source_id}` — Retrieve a Lead Source
- `DELETE /rest/v2/leadSources/{lead_source_id}` — Delete a Lead Source
- `PATCH  /rest/v2/leadSources/{lead_source_id}` — Update a Lead Source
- `GET    /rest/v2/leadSourceCategories` — List Lead Source Categories
- `POST   /rest/v2/leadSourceCategories` — Create a Lead Source Category
- `GET/DELETE/PATCH /rest/v2/leadSourceCategories/{id}` — Manage Lead Source Category
- `GET/POST /rest/v2/leadSources/{lead_source_id}/expenses` — Lead Source Expenses
- `GET/DELETE/PATCH /rest/v2/leadSources/{lead_source_id}/expenses/{id}` — Manage Expense
- `GET/POST /rest/v2/leadSources/{lead_source_id}/recurringExpenses` — Recurring Expenses
- `GET/DELETE/PATCH /rest/v2/leadSources/{lead_source_id}/recurringExpenses/{id}` — Manage Recurring Expense
- `GET    /rest/v2/leadSources/{lead_source_id}/recurringExpenses/{id}/expenses` — List expenses from recurring expense

### Notas (Notes)
- `GET    /rest/v2/notes/model` — Retrieve Note Model
- `GET    /rest/v2/notes/templates` — Retrieve Note Templates
- `POST   /rest/v2/notes/model/customFields` — Create a Custom Field
- `PATCH  /rest/v2/notes/model/customFields/{custom_field_id}` — Update a Custom Field

### Oportunidades (Opportunities)
- `GET    /rest/v2/opportunities` — List Opportunities
- `POST   /rest/v2/opportunities` — Create an Opportunity
- `GET    /rest/v2/opportunities/{opportunity_id}` — Retrieve a Opportunity
- `DELETE /rest/v2/opportunities/{opportunity_id}` — Delete an Opportunity
- `PATCH  /rest/v2/opportunities/{opportunity_id}` — Update an opportunity
- `POST   /rest/v2/opportunities/model/customFields` — Create an Opportunity Custom Field
- `PATCH  /rest/v2/opportunities/model/customFields/{custom_field_id}` — Update a Opportunity's Custom Field
- `GET    /rest/v2/opportunities/stages` — List of Opportunity Stages
- `POST   /rest/v2/opportunities/stages` — Create an Opportunity Stage
- `GET    /rest/v2/opportunities/stages/{stage_id}` — Retrieve an Opportunity Stage
- `DELETE /rest/v2/opportunities/stages/{stage_id}` — Delete an Opportunity Stage
- `PATCH  /rest/v2/opportunities/stages/{stage_id}` — Update an Opportunity Stage

### Pedidos (Orders)
- `GET    /rest/v2/orders` — List orders
- `POST   /rest/v2/orders` — Create an Order
- `GET    /rest/v2/orders/{order_id}` — Retrieve an Order
- `DELETE /rest/v2/orders/{order_id}` — Delete an Order
- `PATCH  /rest/v2/orders/{order_id}` — Update an Order
- `POST   /rest/v2/orders/{order_id}:applyTax` — Apply Taxes on an Order
- `POST   /rest/v2/orders/{order_id}:attachFile` — Attach a File to an Order Invoice
- `POST   /rest/v2/orders/{order_id}:detachFile` — Detach a File from an Order Invoice
- `GET    /rest/v2/orders/model` — Retrieve Order Custom Field Model
- `POST   /rest/v2/orders/model/customFields` — Create an Order Custom Field
- `DELETE /rest/v2/orders/model/customFields/{custom_field_id}` — Delete an Order Custom Field
- `PATCH  /rest/v2/orders/model/customFields/{custom_field_id}` — Update an Order Custom Field
- `POST   /rest/v2/orders/{order_id}/items` — Create an Order Item
- `DELETE /rest/v2/orders/{order_id}/items/{order_item_id}` — Delete an Order Item
- `PATCH  /rest/v2/orders/{order_id}/items/{order_item_id}` — Update an Order Item
- `POST   /rest/v2/orders/{order_id}/items/{order_item_id}:applyCommission` — Apply Commission to an Order Item
- `GET    /rest/v2/orders/{order_id}/payments` — Retrieve Order Payments
- `POST   /rest/v2/orders/{order_id}/payments` — Create a Payment

### Pagamentos (Payments)
- `GET    /rest/v2/sales/payments` — List Payments
- `GET    /rest/v2/sales/transactions` — List Transactions
- `GET    /rest/v2/merchants` — List Merchant accounts
- `POST   /rest/v2/sales/merchants/{id}:setDefault` — Set default Merchant Account
- `GET    /rest/v2/paymentMethods` — List of Payment Methods
- `POST   /rest/v2/paymentMethodConfigs` — Create Payment Method Configuration

### Produtos (Products)
- `GET    /rest/v2/products` — List Products
- `POST   /rest/v2/products` — Create a Product
- `GET    /rest/v2/products/{product_id}` — Get a Product
- `DELETE /rest/v2/products/{product_id}` — Delete a Product
- `PATCH  /rest/v2/products/{product_id}` — Update a Product
- `POST   /rest/v2/products/{product_id}:adjustInventory` — Adjust Inventory of a Product
- `POST   /rest/v2/products/{product_id}/images` — Create the Product Image
- `DELETE /rest/v2/products/{product_id}/images` — Delete the Product Image
- `GET    /rest/v2/products/{product_id}/images/legacyImageData` — Retrieve Product Legacy Image Data
- `GET    /rest/v2/products/{product_id}/options` — List Product Options
- `POST   /rest/v2/products/{product_id}/options` — Create a Product Option
- `GET    /rest/v2/products/{product_id}/options/{product_option_id}` — Get Product Option
- `DELETE /rest/v2/products/{product_id}/options/{product_option_id}` — Delete a Product Option
- `PATCH  /rest/v2/products/{product_id}/options/{product_option_id}` — Updates a Product Option
- `POST   /rest/v2/products/{product_id}/options/{product_option_id}/listItems` — Add a Product Option List Option Value
- `DELETE /rest/v2/products/{product_id}/options/{product_option_id}/listItems/{item_id}` — Delete a Product Option List Item
- `PATCH  /rest/v2/products/{product_id}/options/{product_option_id}/listItems/{item_id}` — Updates a Product Option List Option Value
- `GET    /rest/v2/products/{product_id}/subscriptions` — List Subscription Plans
- `POST   /rest/v2/products/{product_id}/subscriptions` — Create Subscription Plan
- `GET    /rest/v2/products/{product_id}/subscriptions/{subscription_plan_id}` — Get Subscription Plan
- `DELETE /rest/v2/products/{product_id}/subscriptions/{subscription_plan_id}` — Delete Subscription Plan
- `PATCH  /rest/v2/products/{product_id}/subscriptions/{subscription_plan_id}` — Update Subscription Plan

### Categorias de Produtos
- `GET    /rest/v2/productCategories` — List all Product Categories
- `POST   /rest/v2/productCategories` — Create a Product Category
- `GET    /rest/v2/productCategories/{category_id}` — Get a Product Category
- `DELETE /rest/v2/productCategories/{category_id}` — Delete a Product Category
- `PATCH  /rest/v2/productCategories/{category_id}` — Update a Product Category
- `POST   /rest/v2/productCategories/{category_id}/images` — Create the product category image file
- `DELETE /rest/v2/productCategories/{category_id}/images` — Delete the image from a product category
- `POST   /rest/v2/productCategories/{category_id}:assignProducts` — Assign Products to a Product Category

### Bundles de Interesse
- `GET    /rest/v2/productInterestBundles` — List Product Interest Bundles
- `POST   /rest/v2/productInterestBundles` — Create a Product Interest Bundle
- `GET    /rest/v2/productInterestBundles/{id}` — Get a Product Interest Bundle
- `DELETE /rest/v2/productInterestBundles/{id}` — Delete a Product Interest Bundle
- `PATCH  /rest/v2/productInterestBundles/{id}` — Update a Product Interest Bundle
- `POST   /rest/v2/productInterestBundles/{id}/interests` — Create a Product Interest in an existing Bundle
- `DELETE /rest/v2/productInterestBundles/{id}/interests/{interest_id}` — Delete a Product Interest from an existing Bundle
- `PATCH  /rest/v2/productInterestBundles/{id}/interests/{interest_id}` — Update a Product Interest in an existing Bundle

### Referrals
- `POST   /rest/v2/referrals` — Create a Referral

### Relatórios (Reporting)
- `GET    /rest/v2/reporting/reports` — List Reports
- `GET    /rest/v2/reporting/reports/{report_id}` — Retrieve Report
- `POST   /rest/v2/reporting/reports/{report_id}:run` — Run a Report

### Configurações (Settings)
- `GET    /rest/v2/settings/applications:getConfiguration` — Get Application Configuration
- `GET    /rest/v2/settings/applications:isEnabled` — Get Application Status
- `GET    /rest/v2/settings/contactOptionTypes` — Get Contact Option types
- `GET    /rest/v2/businessProfile` — Retrieve Business Profile
- `PATCH  /rest/v2/businessProfile` — Update Business Profile

### Frete (Shipping)
- `GET    /rest/v2/shipping` — List Shipping methods

### Subscrições (Subscriptions)
- `GET    /rest/v2/subscriptions` — List Subscriptions
- `POST   /rest/v2/subscriptions` — Create Subscription
- `GET    /rest/v2/subscriptions/{subscription_id}` — Retrieve a Subscription
- `PATCH  /rest/v2/subscriptions/{subscription_id}` — Update a Subscription
- `POST   /rest/v2/subscriptions/{subscription_id}:deactivate` — Cancel Subscription
- `GET    /rest/v2/subscriptions/model` — Retrieve Subscription Custom Field Model
- `POST   /rest/v2/subscriptions/model/customFields` — Create a Subscription Custom Field
- `DELETE /rest/v2/subscriptions/model/customFields/{custom_field_id}` — Delete a Subscription Custom Field
- `PATCH  /rest/v2/subscriptions/model/customFields/{custom_field_id}` — Update a Subscription Custom Field

### Tags ⭐
- `GET    /rest/v2/tags` — List Tags
- `POST   /rest/v2/tags` — Create Tag
- `GET    /rest/v2/tags/{tag_id}` — Retrieve a Tag
- `DELETE /rest/v2/tags/{tag_id}` — Delete Tag
- `PATCH  /rest/v2/tags/{tag_id}` — Update a Tag
- `GET    /rest/v2/tags/categories` — List Tag Categories
- `POST   /rest/v2/tags/categories` — Create Tag Category
- `GET    /rest/v2/tags/categories/{tag_category_id}` — Retrieve a Tag Category
- `DELETE /rest/v2/tags/categories/{tag_category_id}` — Delete Tag Category
- `PATCH  /rest/v2/tags/categories/{tag_category_id}` — Update a Tag Category
- `GET    /rest/v2/tags/{tag_id}/contacts` — List Tagged Contacts
- `POST   /rest/v2/tags/{tag_id}/contacts:applyTags` — **Apply Tag** ⭐
- `POST   /rest/v2/tags/{tag_id}/contacts:removeTags` — Remove Tags
- `GET    /rest/v2/tags/{tag_id}/companies` — List Tagged Companies

### Tarefas (Tasks)
- `GET    /rest/v2/tasks` — List Tasks
- `POST   /rest/v2/tasks` — Create a Task
- `GET    /rest/v2/tasks/{task_id}` — Retrieve a Task
- `DELETE /rest/v2/tasks/{task_id}` — Delete a Task
- `PATCH  /rest/v2/tasks/{task_id}` — Update a Task
- `GET    /rest/v2/tasks/model` — Retrieve Task Model
- `POST   /rest/v2/tasks/model/customFields` — Create a Custom Field
- `DELETE /rest/v2/tasks/model/customFields/{custom_field_id}` — Delete a Custom Field
- `PATCH  /rest/v2/tasks/model/customFields/{custom_field_id}` — Update a Task's Custom Field

### Usuários (Users)
- `GET    /rest/v2/users` — List Users
- `GET    /rest/v2/users/{user_id}` — Get User
- `PATCH  /rest/v2/users/{user_id}` — Update User
- `GET    /rest/v2/users/{user_id}/signature` — Get User email signature
- `GET    /rest/v2/userGroups` — List User Groups
- `GET    /rest/v2/userGroups/{user_group_id}` — Retrieve a User Group
- `GET    /rest/v2/oauth/connect/userinfo` — Retrieve User Info

### Webforms
- `GET    /rest/v2/webforms` — List Webforms with filter
- `GET    /rest/v2/webforms/{webform_id}:data` — Get Webform HTML

### Integrações
- `POST   /rest/v2/integrations/wordpress/options` — Add a WordPress Opt-In Option
- `DELETE /rest/v2/integrations/wordpress/options/{option_key}` — Delete a WordPress Opt-In Option

### Localização
- `GET    /rest/v2/locales/countries` — List Countries
- `GET    /rest/v2/locales/countries/{country_code}` — Get Country
- `GET    /rest/v2/locales/countries/{country_code}/provinces` — List a Country's Provinces
- `GET    /rest/v2/locales/countries/{country_code}/provinces/{province_code}` — Get Province
