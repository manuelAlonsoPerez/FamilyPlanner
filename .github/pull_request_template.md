## 📝 Description

Establishes the Family Planner project foundation across the backend agent runtime
and frontend web application. It adds the architecture and implementation guides,
a Python/`uv` agent scaffold configured for Amazon Bedrock, and a responsive
Next.js prototype for calendar, chat, membership, and human-approved proposals.

## 🎯 What does this PR do?

- [x] Feature addition
- [ ] Bug fix
- [x] Documentation update
- [ ] Code refactoring
- [x] Other: Project and development-tool configuration

## 🔍 Changes Made

### Backend and agent runtime

- Added a Python 3.12 `uv` application scaffold under
  `backend/agent-runtime`.
- Added runtime dependencies for Strands Agents, Amazon Bedrock AgentCore,
  Boto3, Pydantic, Pydantic Settings, and Structlog.
- Added Ruff, mypy, pytest, pytest-asyncio, and coverage configuration.
- Added safe local environment defaults:
  - AWS region: `eu-central-1`
  - Bedrock model: `eu.amazon.nova-micro-v1:0`
  - AWS profile: `family-planner-dev`
  - bounded agent steps, context size, output tokens, and request timeout
- Added backend setup documentation covering non-root AWS authentication,
  least-privilege Bedrock permissions, cost controls, and AgentCore setup.
- Preserved the authorization boundary: the agent may propose calendar
  operations but cannot execute calendar mutations.

### Frontend

- Added a Next.js 16, React 19, TypeScript, and Tailwind CSS application.
- Added FullCalendar 7, Temporal Polyfill, and Lucide icons.
- Implemented a responsive Family Planner workspace with:
  - desktop split-view and mobile tab navigation;
  - group calendar with month, week, and list views;
  - family chat and local message preview;
  - AI calendar proposal cards with conflict and approval information;
  - local accept/reject preview controls;
  - group members and role-aware presentation;
  - keyboard focus styles and accessible labels.
- Added project and frontend scripts for development, linting, type checking,
  and production builds.
- Uses fixture data only. Authentication, persistence, subscriptions, backend
  voting, and external calendar writes are intentionally not connected yet.

### Repository and documentation

- Added pnpm workspace configuration and lockfiles.
- Added architecture, backend/agent, and frontend implementation guides.
- Added repository documentation and ignore rules for credentials, local
  environments, generated output, and dependencies.

## 🧪 Testing

- [x] I have tested this locally
- [ ] All automated tests pass — test suites will be added in later phases
- [x] No breaking changes

Validation completed:

- `pnpm frontend:lint`
- `pnpm frontend:typecheck`
- `pnpm frontend:build`
- Browser verification of responsive rendering and proposal interaction

## 📸 Screenshots (if applicable)

<!-- Add the latest desktop and mobile screenshots before opening the PR. -->

## 📋 Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Code is commented where necessary
- [x] Documentation updated
- [x] No credentials, OAuth secrets, calendar tokens, or private data committed
- [x] Calendar mutations remain outside the browser and agent runtime

## 🚀 Deployment Notes

- No AWS infrastructure or production environment is deployed by this PR.
- Frontend development requires Node.js and pnpm. Run `pnpm frontend:dev` from
  the repository root.
- Backend development requires Python 3.12 and `uv`.
- Copy `backend/agent-runtime/.env.example` to `.env` for local development.
- Use a non-root AWS identity and authenticate the `family-planner-dev` profile
  before invoking Bedrock.
- Amazon Nova Micro inference is usage-priced. Configure AWS Budgets before
  performing model invocations.
- Do not expose `AWS_PROFILE`, provider credentials, or OAuth secrets through
  `NEXT_PUBLIC_*` variables.

## 📞 Additional Notes

- The frontend currently demonstrates intended behavior with in-memory fixture
  data; approval choices do not change canonical proposal state.
- The backend currently provides dependency and tooling configuration, not the
  complete scheduling agent or calendar executor.
- Google Calendar is the planned MVP provider. Apple Calendar/CalDAV remains a
  stretch goal.
