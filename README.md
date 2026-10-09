# CurrículoPro AI

Aplicação web (SaaS) em português-BR para criar, organizar e exportar currículos
profissionais com apoio de um assistente de IA. O produto **não inventa fatos**:
a IA atua apenas na apresentação do conteúdo que você informa, e cada sugestão é
revisada manualmente antes de entrar no documento.

> Situação: implementação funcional de ponta a ponta (autenticação, persistência,
> editor, modelos, exportação em PDF e assistente). Recursos que dependem de
> serviços externos (provedor de pagamento, e-mail de recuperação de senha,
> Supabase e IA generativa) estão descritos em [Limitações conhecidas](#limitações-conhecidas).

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitetura](#arquitetura)
- [Como rodar localmente](#como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Modelo de dados](#modelo-de-dados)
- [Assistente de IA](#assistente-de-ia)
- [Planos e monetização](#planos-e-monetização)
- [Segurança, privacidade e LGPD](#segurança-privacidade-e-lgpd)
- [Acessibilidade, responsividade e SEO](#acessibilidade-responsividade-e-seo)
- [Testes e verificação](#testes-e-verificação)
- [Deploy](#deploy)
- [Limitações conhecidas](#limitações-conhecidas)
- [Checklist de aceitação](#checklist-de-aceitação)

---

## Funcionalidades

- **Landing page** institucional com identidade visual própria, seções de
  proposta de valor, modelos e preços.
- **Autenticação local** completa: criar conta, entrar e sair. Senhas com
  `scrypt` + salt; sessões opacas com token de 256 bits guardado apenas como hash
  SHA-256, em cookie `httpOnly` (`cp_session`), validade de 30 dias.
- **Painel** (`/painel`) com lista de currículos, percentual de preenchimento,
  criação, duplicação e exclusão com confirmação. Estado vazio orientado.
- **Editor** (`/curriculos/[id]/editar`) com salvamento automático (debounce de
  1,5 s), indicador de status, controle de concorrência otimista (HTTP 409),
  aviso ao sair com alterações pendentes e abas de edição/pré-visualização no
  mobile.
- **10 seções de conteúdo**: dados pessoais, resumo, experiências, formação,
  cursos, habilidades técnicas, habilidades comportamentais, idiomas, projetos e
  **adaptação para vaga** (via assistente contextual).
- **Assistente de IA** por seção, com sugestões que podem ser aplicadas ou
  descartadas, além de um painel de diagnóstico do currículo.
- **Três modelos**: Clássico (gratuito), Moderno (premium) e Minimalista
  (premium) — HTML na pré-visualização e variantes equivalentes no PDF.
- **Exportação A4 em PDF com texto real** (via `@react-pdf/renderer`, não é
  captura de tela) e opção de imprimir/salvar em PDF pela impressão do navegador
  com CSS de impressão dedicado.
- **Páginas** de preços, `not-found`, `error`, `robots.txt` e `sitemap.xml`.
  Rotas privadas são marcadas como `noindex`.

## Stack

| Camada            | Escolha                                                             |
| ----------------- | ------------------------------------------------------------------- |
| Framework         | Next.js 16 (App Router) + React 19                                  |
| Linguagem         | TypeScript em modo `strict`                                         |
| Estilo            | Tailwind CSS 4 (design tokens em `globals.css`)                     |
| Validação         | Zod 4 (esquema único compartilhado entre cliente e servidor)        |
| Persistência      | SQLite nativo do Node (`node:sqlite`, sem dependência nativa)       |
| Autenticação      | Implementação própria (scrypt + cookie de sessão)                   |
| PDF               | `@react-pdf/renderer` (texto real) + CSS de impressão               |
| Testes            | Vitest + Testing Library (jsdom)                                    |
| Lint              | ESLint 9 (flat config) + `eslint-config-next`                       |

## Arquitetura

```
src/
  app/                      rotas (App Router) e páginas
    (auth)/                 criar-conta, entrar, layout de autenticação
    api/                    endpoints: auth, resumes, ai
    curriculos/[id]/        editar e visualizar/exportar
    painel/ precos/         painel, preços
    robots.ts sitemap.ts    SEO
  components/
    ui/                     primitivas (botão, campos, superfícies, diálogo, ícones, logo)
    marketing/              cabeçalho, rodapé, menu mobile, vitrine de modelos
    app/                    cabeçalho e botão de sair da área logada
    auth/                   formulário de autenticação
    dashboard/              cliente do painel
    editor/                 shell do editor, seções, assistente
    resume/                 documento HTML + modelos (Clássico/Moderno/Minimalista)
    pdf/                    documento PDF e botões de exportação
  lib/
    ai/                     orquestração, provedor, prompt, assistente local, rate limit
    auth/                   senha, sessão, guarda de rotas/API
    db/                     conexão, migrações e repositórios (users, sessions, resumes, ai_usage)
    plans/                  regras de plano centralizadas
    resume/                 esquema, defaults, normalização, progresso, formato, modelos, exemplo
    utils/                  utilitários (cn, http)
tests/
  unit/                     esquema, senha, planos, IA, progresso, format, modelos
  integration/              banco: usuários, sessões, currículos, isolamento, uso de IA
```

Pontos de decisão relevantes:

- **Fonte única de verdade** do currículo em `src/lib/resume/schema.ts` (Zod).
  Os tipos TypeScript são inferidos do esquema, então cliente e servidor validam
  exatamente as mesmas regras.
- **Regras de plano** ficam centralizadas em `src/lib/plans/rules.ts`; a UI consulta
  esses dados em vez de espalhar condicionais.
- **Isolamento por usuário**: toda consulta de currículo inclui `user_id` na
  cláusula, impedindo acesso cruzado mesmo com um `id` válido de outro usuário.
- **Migrações versionadas e idempotentes** rodam automaticamente na primeira
  conexão (`_migrations`).

## Como rodar localmente

### Requisitos

- **Node.js 22.5+** (recomendado 24 LTS). A persistência usa o módulo nativo
  `node:sqlite`, disponível a partir do Node 22.5. Não há dependências nativas de
  compilação.
- npm 10+.

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Criar o arquivo de ambiente a partir do exemplo
cp .env.example .env.local
# edite .env.local e ajuste ao menos DATABASE_PATH e NEXT_PUBLIC_APP_URL

# 3. Ambiente de desenvolvimento
npm run dev
# abra http://localhost:3000
```

O banco é criado automaticamente no caminho de `DATABASE_PATH` (por padrão
`./data/curriculopro.sqlite`) na primeira requisição que usa o banco.

Para gerar e servir um build de produção:

```bash
npm run build
npm run start
```

## Variáveis de ambiente

Copie `.env.example` para `.env.local`. Nenhum segredo é versionado.

| Variável                  | Obrigatória | Padrão                       | Descrição                                                        |
| ------------------------- | :---------: | ---------------------------- | ---------------------------------------------------------------- |
| `DATABASE_PATH`           |     sim     | `./data/curriculopro.sqlite` | Caminho do arquivo SQLite (relativo à raiz).                     |
| `SESSION_SECRET`          |   produção  | segredo de dev               | Reservado para usos futuros (ex.: proteção CSRF).                |
| `NEXT_PUBLIC_APP_URL`     |     sim     | `http://localhost:3000`      | URL pública; define também o `Secure` do cookie (só em https).   |
| `AI_BASE_URL`             |     não     | `https://api.openai.com/v1`  | Endpoint compatível com a API OpenAI.                            |
| `AI_API_KEY`              |     não     | vazio                        | Se vazio, usa o assistente local determinístico.                 |
| `AI_MODEL`                |     não     | `gpt-4o-mini`                | Modelo usado nas chamadas.                                       |
| `AI_FREE_DAILY_LIMIT`     |     não     | `10`                         | Limite diário de IA no plano gratuito.                           |
| `AI_PREMIUM_DAILY_LIMIT`  |     não     | `200`                        | Limite diário de IA no plano premium.                            |
| `PAYMENT_PROVIDER`        |     não     | vazio                        | Nome do provedor (não integrado).                                |
| `PAYMENT_SECRET_KEY`      |     não     | vazio                        | Chave do provedor (não integrado).                               |

> Gere um segredo com `openssl rand -hex 32`.

## Scripts

| Comando             | O que faz                                    |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento.                 |
| `npm run build`     | Build de produção.                           |
| `npm run start`     | Serve o build de produção.                   |
| `npm run typecheck` | `tsc --noEmit` (TypeScript estrito).         |
| `npm run lint`      | ESLint (flat config).                        |
| `npm test`          | Executa a suíte Vitest uma vez.              |
| `npm run test:watch`| Vitest em modo observação.                   |

## Modelo de dados

Tabelas criadas pela migração `0001_init`:

- `users` — `id`, `email` (único), `password_hash`, `name`, `plan`
  (`free`/`premium`), timestamps.
- `sessions` — `id`, `user_id`, `token_hash` (único, SHA-256 do token),
  `created_at`, `expires_at`. Índices por usuário e por hash.
- `resumes` — `id`, `user_id`, `title`, `template_id`, `content` (JSON validado
  pelo esquema Zod), timestamps. Índices por usuário e por `(user_id, updated_at)`.
- `ai_usage` — `(user_id, day)` como chave primária e `count`. Base da cota diária.
- `_migrations` — controle interno das migrações aplicadas.

Todas as chaves estrangeiras usam `ON DELETE CASCADE`; o banco roda com
`journal_mode = WAL`, `foreign_keys = ON` e `busy_timeout = 5000`.

## Assistente de IA

A orquestração fica em `src/lib/ai/service.ts`:

1. Sem `AI_API_KEY`, usa o **assistente local** determinístico
   (`src/lib/ai/local-assistant.ts`), claramente rotulado na interface como
   “Assistente local (IA generativa não configurada)”.
2. Com chave configurada, valida a cota diária, chama o provedor
   (`completeJson`), valida a resposta contra um esquema Zod e, em qualquer
   falha, recorre ao assistente local com um aviso explícito.
3. O **consumo só é contabilizado após uso bem-sucedido**.
4. Há um **rate limit em memória** por usuário (rajada) além da cota diária.

Princípios invioláveis do prompt e do assistente local: nunca inventar fatos,
experiências ou habilidades; melhorar apenas a apresentação do que o usuário
forneceu; toda sugestão é revisável e descartável.

## Planos e monetização

- **Gratuito (R$ 0)**: currículos ilimitados, modelo Clássico, PDF, cota diária
  de IA configurável.
- **Premium**: todos os modelos, cotas de IA maiores e adaptação para vaga.

A cobrança **não está integrada** — não há provedor de pagamento conectado e
nenhuma cobrança real é feita. As regras de acesso estão prontas e centralizadas
em `src/lib/plans/rules.ts` para receber um provedor no futuro.

## Segurança, privacidade e LGPD

- Senhas nunca são armazenadas em texto: `scrypt` com salt aleatório por usuário.
- Tokens de sessão são aleatórios (256 bits) e persistidos apenas como hash
  SHA-256; cookies são `httpOnly`, `SameSite=Lax` e `Secure` em HTTPS.
- Validação de entrada com Zod em todas as rotas de API; limites de tamanho
  protegem banco e serviço de IA.
- Isolamento de dados por `user_id` em cada consulta de currículo.
- **Minimização de dados**: pedimos apenas o necessário (não exigimos endereço
  completo, apenas cidade/UF). Não há rastreamento de terceiros.
- Segredos ficam fora do repositório (`.env.local` no `.gitignore`).
- A IA é chamada **apenas no servidor**; a chave nunca chega ao cliente.
- Rotas privadas são `noindex` via metadados e `robots.txt`.

## Acessibilidade, responsividade e SEO

- Componentes com foco visível, rótulos de formulário, `aria-*` em diálogos e
  contêineres, e contraste adequado na paleta.
- Layout responsivo do celular ao desktop; o editor alterna entre edição e
  pré-visualização em telas pequenas.
- `sitemap.xml` e `robots.txt` gerados; páginas privadas desautorizadas e sem
  indexação.

## Testes e verificação

A suíte cobre esquema/normalização, progresso, formatação de datas, regras de
plano, senha, assistente local e serviço de IA, e a renderização dos três
modelos, além de testes de integração do banco (usuários, sessões, ciclo de vida
e isolamento de currículos, uso de IA).

```bash
npm run typecheck   # TypeScript estrito
npm run lint        # ESLint
npm test            # Vitest (23 testes)
npm run build       # build de produção
```

Os fluxos de API e de páginas também foram verificados de ponta a ponta contra um
servidor de produção local (autenticação, CRUD de currículos, gating de plano,
IA, renderização autenticada, redirecionamento anônimo e `robots.txt`).

## Deploy

O projeto é um app Next.js padrão e pode ser publicado em qualquer plataforma
compatível (Node 22.5+ / 24 LTS).

1. Defina as variáveis de ambiente no painel da plataforma (mínimo:
   `DATABASE_PATH`, `NEXT_PUBLIC_APP_URL` e, em produção, `SESSION_SECRET`).
2. Como o banco é um arquivo SQLite, use um **volume persistente** e aponte
   `DATABASE_PATH` para ele. Ambientes serverless sem disco persistente exigem
   migrar a persistência para um banco gerenciado (ver limitações).
3. Rode `npm run build` e `npm run start`.

## Workflow de Git

O repositório segue **trunk-based**: a branch `main` é a única linha permanente
e está sempre em estado publicável. Releases recebem tag semver (`v0.1.0`).

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`)
  com escopos quando útil (`feat(editor): …`). Cada commit é atômico e descreve
  uma única mudança.
- **Branches**: curtas e descartáveis, nomeadas por finalidade —
  `feat/nome-curto`, `fix/nome-curto`, `chore/nome-curto` — criadas a partir de
  `main` e removidas após o merge. Não manter `main` com work-in-progress.
- **Revisão**: para uma única pessoa, merges diretos em `main` após passar
  localmente por `typecheck`, `lint`, `test` e `build`.
- **Histórico**: antes do push inicial o histórico foi reorganizado em commits
  lógicos; evite reescrever histórico já publicado (use `git revert`).

## Limitações conhecidas

- **Persistência em arquivo SQLite** (`node:sqlite`): ótima para um único nó, mas
  não compartilha estado entre várias instâncias. Para escalar horizontalmente,
  troque a camada `src/lib/db/*` por um banco gerenciado (ex.: Postgres/Supabase)
  e implemente RLS. O código mantém o acesso a dados isolado em repositórios para
  facilitar isso.
- **Pagamento não integrado**: o plano premium existe como camada de regras, mas
  não há checkout nem cobrança real.
- **Recuperação de senha não implementada**: depende de um provedor de e-mail,
  que não está configurado.
- **IA generativa opcional**: sem `AI_API_KEY`, atua apenas o assistente local
  determinístico. Quando configurada, a qualidade depende do provedor escolhido.
- **Rate limit em memória**: reinicia com o processo e não é compartilhado entre
  instâncias; a cota diária persistida continua valendo.
- **Upload de foto e importação de arquivos** não fazem parte desta versão.
- **Cobertura de testes** prioriza regras de negócio e integração de dados; não
  há testes end-to-end em navegador automatizados nesta entrega.

## Checklist de aceitação

- [x] UI em pt-BR, moeda em BRL e datas no formato brasileiro.
- [x] Identidade visual com escala de espaçamento/tipografia/raio e estados de
      foco, hover, erro e sucesso; ícones e componentes reutilizáveis.
- [x] Cadastro, login e logout funcionais com sessão segura.
- [x] Painel com criação, listagem, duplicação e exclusão de currículos.
- [x] Editor com as seções de conteúdo e salvamento automático.
- [x] Três modelos (Clássico, Moderno, Minimalista) sobre os mesmos dados.
- [x] Exportação A4 em PDF com texto real e impressão pelo navegador.
- [x] Assistente de IA que nunca inventa fatos e tem fallback local rotulado.
- [x] Persistência real com migrações versionadas e isolamento por usuário.
- [x] Regras de plano centralizadas (gratuito/premium) sem cobrança falsa.
- [x] Rotas privadas protegidas e marcadas como `noindex`.
- [x] `typecheck`, `lint`, testes e build de produção passando.
