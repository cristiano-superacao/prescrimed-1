# Prescrimed

Sistema de gestão de saúde multi-tenant para casas de repouso, clínicas de fisioterapia e petshop, com backend Node.js/Express, frontend React/Vite, PostgreSQL e módulo comercial/fiscal integrado.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Railway](https://img.shields.io/badge/Deploy-Railway-purple.svg)](https://railway.app/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg)](https://www.postgresql.org/)

## Visão geral

- Layout responsivo e profissional para desktop, tablet e mobile.
- Módulos clínicos, administrativos, estoque, financeiro e comercial/fiscal.
- Autenticação JWT e isolamento multi-tenant por empresa.
- Deploy principal em Railway com PostgreSQL.

## Acesso rápido

- Manual operacional: [docs/guides/MANUAL_DO_SISTEMA.md](docs/guides/MANUAL_DO_SISTEMA.md)
- Documentação técnica: [docs/guides/DOCUMENTATION.md](docs/guides/DOCUMENTATION.md)
- Índice de guias: [docs/guides/README.md](docs/guides/README.md)
- Guia Streamlit: [docs/guides/STREAMLIT_GUIDE.md](docs/guides/STREAMLIT_GUIDE.md)
- Legado MySQL: [legacy/mysql/README.md](legacy/mysql/README.md)

## Stack atual

- Backend: Node.js 20+, Express, Sequelize e PostgreSQL.
- Frontend: React 18, Vite, Tailwind CSS, Zustand e Axios.
- Infra: Railway, Nixpacks e healthcheck em `/health`.
- Integrações: webhook público em `/api/public/webhooks/payment` e emissão fiscal por provedor REST.

## Início rápido

Pré-requisitos:

- Node.js 20+
- npm 10+
- PostgreSQL

Execução local:

```bash
git clone https://github.com/cristiano-superacao/prescrimed.git
cd prescrimed
npm install
npm run build:client
# configure .env a partir de .env.example
npm start
```

Desenvolvimento:

```bash
npm run dev
npm run client
```

## Scripts principais

- `npm run seed:complete` para popular o banco com dados completos.
- `npm run test:api:complete` para validar os fluxos principais da API.
- `npm run test:api:quick` para smoke test rápido.
- `npm run create:local-admin` para criar admin local.
- `npm run build:client` para gerar o frontend de produção.
- `npm run build:template` para gerar a pasta `Template/` pronta para upload na HostGator.
- `npm run streamlit` para subir o dashboard analítico.

## Publicação na HostGator

Para hospedagem compartilhada, use:

```bash
npm run build:template
```

Esse comando gera a pasta `Template/` com o frontend estático, arquivo `.htaccess` e instruções de upload.

Importante:

- O projeto é compatível com HostGator apenas se o plano oferecer Node.js em execução contínua e acesso a PostgreSQL local ou remoto.
- Se o backend também rodar no mesmo domínio, use o build HostGator apontando para `/api` na mesma origem.
- Se a conta HostGator for apenas hospedagem estática/shared sem Node.js, a pasta `Template/` cobre somente o frontend React e a API precisa continuar em outro ambiente compatível.
- O endpoint usado nesse build fica configurado em `client/.env.hostgator`.

Webhook de pagamento:

- Para validar/usar webhook assinado em `/api/public/webhooks/payment`, o backend precisa ter `PAYMENT_WEBHOOK_SECRET` configurado (e, em geral, `PAYMENT_WEBHOOK_STRICT=true`).

## Observações

- A configuração principal do ambiente está em [.env.example](.env.example).
- Guias de deploy e operação ficam em [docs/guides/README.md](docs/guides/README.md).
- O material de MySQL foi arquivado e não faz parte do fluxo atual.
