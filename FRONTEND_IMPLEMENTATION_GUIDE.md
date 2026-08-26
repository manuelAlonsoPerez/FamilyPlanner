# Family Planner Frontend Implementation Guide

> Status: Parts 1–2 implemented — responsive local prototype complete; cloud integration pending
> Scope: Next.js web client, Amplify client integration, user experience, and frontend testing
> Architecture source: [ARCHITECTURE.md](./ARCHITECTURE.md)
> Last reviewed: 26 August 2026

This guide describes how to implement the Family Planner web application defined in the architecture. It intentionally keeps calendar credentials, approval authorization, agent execution, and calendar mutations outside the browser.

## Guide roadmap

- [x] Part 1 — Workspace and Next.js setup
- [x] Part 2 — Design foundation and application shell
- [ ] Part 3 — Amplify configuration and authentication
- [ ] Part 4 — Typed application contracts and data client
- [ ] Part 5 — Groups and memberships
- [ ] Part 6 — Real-time chat
- [ ] Part 7 — Calendar projection
- [ ] Part 8 — Proposal action cards and voting
- [ ] Part 9 — Calendar connection and audit history
- [ ] Part 10 — Accessibility, testing, and deployment

---

# Part 1 — Frontend foundations

## 1. Goals

The frontend must provide:

- user registration, verification, sign-in, sign-out, and recovery;
- a list of groups the current user belongs to;
- group creation and invitation flows;
- a group workspace containing calendar, chat, proposals, and membership;
- real-time messages and proposal-status updates;
- read-only rendering of the administrator's permitted calendar projection;
- explicit accept/reject controls for calendar proposals;
- visible pending, approved, executing, executed, rejected, stale, expired, and failed states;
- calendar connection settings for administrators;
- an audit/history view;
- responsive layouts for desktop and mobile;
- accessible keyboard and screen-reader behavior;
- a reliable end-to-end demonstration.

The frontend must not:

- receive Google refresh tokens or Apple app-specific passwords;
- call Google Calendar or CalDAV directly;
- decide whether an approval policy is satisfied;
- transition proposals to approved or executed;
- expose a generic calendar-execution mutation;
- trust role, group, event, or proposal identifiers supplied by the browser;
- display private administrator event details unless the backend explicitly returns them;
- render model output as trusted HTML.

## 2. Frontend architecture decisions

### 2.1 Next.js App Router

Use Next.js with:

- TypeScript;
- App Router;
- `src/` application layout;
- Tailwind CSS;
- ESLint;
- React Server Components by default;
- Client Components only where browser state, subscriptions, FullCalendar, or interactive Amplify APIs require them.

Do not turn the entire application into a Client Component. Keep route shells, static content, metadata, and non-interactive layouts server-renderable.

### 2.2 Client-driven authenticated workspace

The group workspace is subscription-heavy, so its interactive core should be client-side:

- chat timeline;
- message composer;
- proposal cards;
- voting controls;
- calendar view;
- live connection/status indicators.

Server-side authentication and initial data loading can be added through `@aws-amplify/adapter-nextjs`, but AppSync subscriptions remain client-side.

### 2.3 Amplify Gen 2 and AppSync

Use:

- Amplify Gen 2 backend definitions;
- Cognito user-pool authentication;
- AppSync/Amplify Data for typed queries, mutations, and subscriptions;
- `amplify_outputs.json` to configure the browser client;
- user-pool authorization as the default authenticated data mode.

The frontend consumes backend contracts. It does not define authorization through UI behavior.

### 2.4 No additional global state library initially

Use:

- Amplify Data for canonical server state;
- React state for local interaction state;
- URL state for shareable navigation state;
- small context providers for authentication and display preferences only.

Do not add Redux, Zustand, or another global store until a concrete cross-route state problem appears. Duplicating AppSync records in an unrelated client store increases stale-state risk.

### 2.5 FullCalendar Standard

Use FullCalendar Standard, not Scheduler/Premium:

- month view;
- week/day time-grid views;
- list view;
- event selection;
- date-range changes.

Standard plugins are MIT-licensed. Premium Scheduler requires separate licensing and is not needed for the MVP.

The current FullCalendar v7 React package exposes standard plugins from `@fullcalendar/react/*` and requires `temporal-polyfill`. Do not mix v6 package instructions with v7 imports.

### 2.6 Accessibility before visual polish

Use semantic HTML and accessible primitives. The calendar and proposal workflow involve consequential decisions, so:

- all operations must be keyboard accessible;
- color cannot be the only status indicator;
- proposal changes need textual before/after descriptions;
- focus must move predictably when dialogs open or status changes;
- mobile users need a list view alternative to the visual calendar.

### 2.7 MVP product defaults

This guide resolves the architecture's open frontend decisions as follows:

- Google Calendar is the only provider required for the judged MVP; Apple remains stretch;
- administrator approval plus all affected members is the default binding policy;
- every member may request create, update, or delete through chat, but approval remains policy-controlled;
- non-group administrator events render as `Busy`;
- each group selects its own target calendar;
- the administrator selects the group timezone;
- the judged demo uses controlled synthetic accounts;
- member presence is not implemented until a real heartbeat/presence contract exists;
- proposal revisions are requested through chat and create a new version rather than editing a card inline;
- raw numeric model confidence is not displayed because it suggests false precision; concrete ambiguities and conflicts are displayed.

## 3. Repository layout

The intended monorepo layout is:

```text
FamilyPlanner/
├── ARCHITECTURE.md
├── BACKEND_AGENTS_IMPLEMENTATION_GUIDE.md
├── FRONTEND_IMPLEMENTATION_GUIDE.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── amplify/
│   ├── auth/
│   │   └── resource.ts
│   ├── data/
│   │   └── resource.ts
│   └── backend.ts
├── frontend/
│   ├── package.json
│   ├── amplify_outputs.json
│   ├── next.config.ts
│   ├── playwright.config.ts
│   ├── vitest.config.ts
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── global-error.tsx
│   │   │   ├── not-found.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/page.tsx
│   │   │   │   ├── sign-up/page.tsx
│   │   │   │   └── verify/page.tsx
│   │   │   └── (app)/
│   │   │       ├── layout.tsx
│   │   │       ├── groups/page.tsx
│   │   │       ├── groups/new/page.tsx
│   │   │       ├── groups/[groupId]/page.tsx
│   │   │       ├── groups/[groupId]/settings/page.tsx
│   │   │       └── groups/[groupId]/history/page.tsx
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── calendar/
│   │   │   ├── chat/
│   │   │   ├── groups/
│   │   │   ├── proposals/
│   │   │   ├── shell/
│   │   │   └── ui/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── calendar/
│   │   │   ├── chat/
│   │   │   ├── groups/
│   │   │   └── proposals/
│   │   ├── lib/
│   │   │   ├── amplify/
│   │   │   ├── contracts/
│   │   │   ├── date-time/
│   │   │   ├── errors/
│   │   │   └── testing/
│   │   └── styles/
│   └── tests/
│       ├── component/
│       ├── integration/
│       └── e2e/
└── backend/
    └── agent-runtime/
```

Keep feature-specific logic close to its feature. Put only reusable visual primitives in `components/ui`.

Do not create all directories empty. Add each directory with the feature that first needs it.

## 4. Prerequisites

Required:

- Git;
- Node.js 20 or later;
- Corepack;
- a current pnpm release;
- AWS CLI 2.32 or later;
- the non-root `family-planner-dev` AWS profile from the backend guide;
- access to the selected AWS development account;
- a configured AWS budget.

Verify:

```bash
git --version
node --version
corepack --version
pnpm --version
aws --version
aws sts get-caller-identity --profile family-planner-dev
```

Stop if the AWS ARN ends in `:root`.

## 5. Initialize the pnpm workspace

From the repository root:

```bash
corepack enable
pnpm init
```

Configure the root `package.json` as private:

```json
{
  "name": "family-planner",
  "private": true,
  "scripts": {
    "dev:frontend": "pnpm --dir frontend dev",
    "build:frontend": "pnpm --dir frontend build",
    "lint:frontend": "pnpm --dir frontend lint",
    "test:frontend": "pnpm --dir frontend test"
  }
}
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - frontend
  - packages/*
```

Commit the root lockfile. Do not maintain a second npm or Yarn lockfile.

## 6. Scaffold Next.js

Run only if `frontend/package.json` does not exist:

```bash
pnpm create next-app@latest frontend \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm
```

Recommended choices:

- TypeScript: yes;
- ESLint: yes;
- React Compiler: defer until compatibility is confirmed across Amplify UI and FullCalendar;
- Tailwind CSS: yes;
- `src/` directory: yes;
- App Router: yes;
- import alias: `@/*`.

Do not pin a Next.js version from this guide. The generated lockfile records the tested version.

Run the generated application:

```bash
pnpm --dir frontend dev
```

Open `http://localhost:3000` and verify the initial page before adding AWS dependencies.

## 7. Install frontend dependencies

From `frontend/`:

```bash
pnpm add \
  aws-amplify \
  @aws-amplify/ui-react \
  @aws-amplify/adapter-nextjs \
  zod \
  @fullcalendar/react \
  temporal-polyfill \
  lucide-react
```

Add test tooling:

```bash
pnpm add --save-dev \
  vitest \
  @vitest/coverage-v8 \
  jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @axe-core/playwright \
  vite-tsconfig-paths \
  @playwright/test
```

Install Playwright's local browser after the package is locked:

```bash
pnpm exec playwright install chromium
```

Use only Chromium in the first local/CI iteration. Add WebKit and Firefox once the critical workflow is stable.

### FullCalendar version boundary

For current FullCalendar v7:

```typescript
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import listPlugin from "@fullcalendar/react/list";
import timeGridPlugin from "@fullcalendar/react/timegrid";
```

Do not separately install `@fullcalendar/core`, `@fullcalendar/daygrid`, or other v6-style standard plugin packages when using v7.

## 8. Optional component primitives

Use shadcn/ui as source-owned accessible primitives:

```bash
cd frontend
pnpm dlx shadcn@latest init
```

Add components only when needed:

```bash
pnpm dlx shadcn@latest add \
  alert-dialog \
  avatar \
  button \
  dialog \
  dropdown-menu \
  input \
  label \
  sheet \
  tabs \
  textarea \
  toast
```

Review generated code before committing it. Do not add the entire catalog.

## 9. Frontend environment files

The frontend should not need secret environment variables.

Use:

```text
frontend/.env.example
frontend/.env.local
```

Safe public settings may include:

```dotenv
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_SUPPORT_EMAIL=
```

Do not place these in `NEXT_PUBLIC_*` variables:

- AWS credentials;
- Google OAuth client secrets;
- calendar tokens;
- AgentCore identifiers intended to remain server-side;
- webhook secrets;
- Cognito administrative credentials.

Amplify endpoint and user-pool configuration comes from `amplify_outputs.json`, not manually duplicated environment variables.

---

# Part 2 — Amplify and authentication

## 10. Initialize Amplify Gen 2

The architecture keeps `amplify/` in the repository root as a shared backend definition.

From the repository root:

```bash
pnpm create amplify@latest
```

Choose the repository root when prompted. Review every generated file before continuing.

The initial Amplify backend should contain:

- `amplify/auth/resource.ts`;
- `amplify/data/resource.ts`;
- `amplify/backend.ts`;
- required root development dependencies.

Do not accept a public API-key authorization mode for family data. Use Cognito user-pool authorization.

## 11. Amplify cloud sandbox

An Amplify sandbox creates real AWS resources and can incur costs. Use the non-root profile and budget.

Run from the repository root:

```bash
pnpm exec ampx sandbox \
  --profile family-planner-dev \
  --outputs-out-dir frontend
```

The sandbox should generate:

```text
frontend/amplify_outputs.json
```

It contains client configuration, not secret credentials. However, personal sandbox outputs are environment-specific. Prefer ignoring the sandbox-generated file and regenerate it for each developer/environment unless the chosen Amplify deployment workflow explicitly requires committing it.

Run the sandbox and Next.js dev server in separate terminals:

```bash
pnpm exec ampx sandbox \
  --profile family-planner-dev \
  --outputs-out-dir frontend
```

```bash
pnpm --dir frontend dev
```

Delete unused sandboxes to control costs.

## 12. Configure Amplify in Next.js

Create `frontend/src/lib/amplify/configure-amplify.tsx` as the single client-only configuration component:

```typescript
"use client";

import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";

Amplify.configure(outputs, { ssr: true });

export function ConfigureAmplify() {
  return null;
}
```

Render it once in the root layout.

Why `{ ssr: true }`:

- Amplify stores auth tokens in cookies suitable for Next.js server integration;
- later server-side auth helpers can use the same session;
- client subscriptions continue to work.

Do not call `Amplify.configure` from many feature modules.

## 13. Authentication backend

Configure Cognito email login in `amplify/auth/resource.ts`.

Initial requirements:

- email sign-up and login;
- email verification;
- password recovery;
- no social providers for the MVP;
- no global Cognito `ADMIN`/`MEMBER` groups for application roles.

Group roles belong to application membership records because one user can administer one Family Planner group and be a member of another.

MFA:

- optional TOTP can be added after the main flow works;
- SMS MFA adds cost and operational requirements;
- do not block the hackathon demo on SMS.

## 14. Authentication UI

The fastest first implementation may wrap Amplify UI's `Authenticator` in a Client Component. Replace its default visual treatment gradually rather than rebuilding every Cognito challenge immediately.

Required states:

- sign in;
- sign up;
- confirm sign-up code;
- resend confirmation;
- forgot password;
- reset password;
- signed-out session;
- expired session;
- network failure.

After authentication:

- route to `/groups`;
- restore the originally requested protected URL where safe;
- never put access tokens in query parameters or local application state.

## 15. Route protection

The `(app)` layout must verify authentication before rendering protected content.

Rules:

- server-side route protection improves user experience;
- every AppSync operation still enforces authorization independently;
- a client redirect is not a security boundary;
- unauthenticated users should return to sign-in without exposing group data;
- access-denied and not-found states should not reveal whether another group's ID exists.

Add the Next.js Amplify adapter only for server-side auth/data behavior actually used by the application.

---

# Part 3 — Contracts and data access

## 16. Amplify data authorization

Set the default Amplify Data authorization mode to `userPool`.

Do not use:

- public API keys for private groups;
- owner-only authorization as a substitute for group membership;
- client-provided role fields as authorization evidence.

Backend resolvers must derive the current user from Cognito identity and verify membership for every group resource.

## 17. Frontend domain contracts

The frontend needs typed representations for:

- `User`;
- `Group`;
- `Membership`;
- `Message`;
- `CalendarConnectionStatus`;
- `CalendarEventProjection`;
- `Proposal`;
- `Vote`;
- `AuditEntry`;
- pagination cursors;
- subscription events;
- application errors.

Generate types from the Amplify schema, then add Zod validation at boundaries where:

- data comes from custom JSON fields;
- an agent-produced proposal payload is represented as JSON;
- URL/search parameters enter the application;
- browser storage is read;
- fixture or mock data is loaded.

Do not manually duplicate the entire generated schema. Create small UI view models from generated records.

## 18. Proposal result types

The UI must model calendar operations as a discriminated union:

```typescript
type CalendarOperation =
  | { operation: "CREATE"; after: EventSnapshot }
  | { operation: "UPDATE"; before: EventSnapshot; after: EventSnapshot }
  | { operation: "DELETE"; before: EventSnapshot };
```

Proposal states:

```text
DRAFT
PENDING_APPROVAL
APPROVED
REJECTED
EXPIRED
SUPERSEDED
EXECUTING
EXECUTED
STALE
FAILED
```

The browser may render these states but must not infer or manufacture state transitions.

## 19. Data-client boundary

Create one generated Amplify data client in `src/lib/amplify/data-client.ts`.

Because the Amplify schema lives at repository root, add a frontend TypeScript path:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@amplify-schema": ["../amplify/data/resource.ts"]
    }
  }
}
```

Then generate one typed client:

```typescript
import type { Schema } from "@amplify-schema";
import { generateClient } from "aws-amplify/data";

export const dataClient = generateClient<Schema>();
```

Feature modules should call focused repository functions:

- `listMyGroups`;
- `getGroupWorkspace`;
- `listGroupMessages`;
- `postGroupMessage`;
- `listCalendarRange`;
- `getProposal`;
- `voteOnProposal`;
- `getCalendarConnectionStatus`;
- `listAuditHistory`.

Components should not contain raw GraphQL or Amplify Data operations.

Benefits:

- easier contract tests;
- one error-normalization path;
- mockable feature boundaries;
- reduced coupling to schema-generation details.

## 20. Required application operations

Queries:

- `myGroups`;
- `group(groupId)`;
- `groupMessages(groupId, cursor, limit)`;
- `groupCalendarRange(groupId, start, end)`;
- `proposal(groupId, proposalId)`;
- `proposalHistory(groupId, cursor)`;
- `calendarConnectionStatus(groupId)`.

Mutations:

- `createGroup(input)`;
- `inviteMember(groupId, email)`;
- `acceptInvitation(token)`;
- `postMessage(groupId, clientMessageId, body)`;
- `voteOnProposal(groupId, proposalId, version, decision)`;
- `cancelProposal(groupId, proposalId, version)`;
- `configureApprovalPolicy(groupId, policy)`;
- `startCalendarConnection(groupId, provider)`;
- `selectTargetCalendar(groupId, providerCalendarId)`;
- `disconnectCalendar(groupId)`.

Subscriptions:

- `onGroupMessage(groupId)`;
- `onProposalChanged(groupId)`;
- `onCalendarProjectionChanged(groupId)`;
- `onMembershipChanged(groupId)`.

There must be no public `executeCalendarOperation` operation.

## 21. Error normalization

Convert transport/provider errors into frontend categories:

- `UNAUTHENTICATED`;
- `FORBIDDEN`;
- `NOT_FOUND`;
- `VALIDATION`;
- `CONFLICT`;
- `STALE_VERSION`;
- `RATE_LIMITED`;
- `NETWORK`;
- `SERVICE_UNAVAILABLE`;
- `UNKNOWN`.

User messages should explain the next safe action without exposing stack traces, GraphQL documents, provider responses, tokens, or internal IDs.

---

# Part 4 — Application shell and navigation

## 22. Public and protected routes

Public:

- `/` — concise product explanation and sign-in entry;
- `/sign-in`;
- `/sign-up`;
- `/verify`;
- invitation acceptance route with an opaque token.

Protected:

- `/groups`;
- `/groups/new`;
- `/groups/[groupId]`;
- `/groups/[groupId]/settings`;
- `/groups/[groupId]/history`.

Do not expose group names or private metadata in page titles until membership is verified.

## 23. Desktop workspace

Desktop group workspace:

- application header;
- group selector and member controls;
- calendar occupying the larger panel;
- chat timeline and composer in the adjacent panel;
- proposal cards inline with conversation;
- connection and sync status visible but secondary.

The calendar and chat should be usable simultaneously during the demo.

## 24. Mobile workspace

On narrow screens:

- use tabs for `Chat`, `Calendar`, and `Members`;
- default to Chat when a proposal requires a decision;
- preserve scroll position when switching tabs;
- use calendar list view as the most readable mobile default;
- avoid horizontal split panes;
- keep composer and proposal actions clear of the on-screen keyboard.

## 25. Loading and route states

Every route needs:

- initial skeleton;
- empty state;
- partial-data state;
- retryable error;
- forbidden state;
- offline/reconnecting state where relevant.

Do not show a full-page spinner for subscription updates after initial load.

---

# Part 5 — Groups and memberships

## 26. Group list

Display:

- group name;
- current user's role;
- timezone;
- calendar-connection health;
- pending proposal count;
- latest activity time.

Empty state:

- explain what a group represents;
- offer `Create group`;
- offer invitation acceptance if a valid pending invitation exists.

## 27. Create group

Required inputs:

- group name;
- group timezone;
- initial approval policy.

Defaults:

- infer a suggested timezone from the browser;
- require explicit confirmation;
- store an IANA timezone such as `Europe/Oslo`, never only a UTC offset.

The backend assigns the creator as administrator. The browser must not submit an arbitrary administrator user ID.

## 28. Membership management

Administrators may:

- invite by email;
- view invitation status;
- remove members;
- change supported membership settings.

Members may:

- view group members;
- leave when policy allows.

Use confirmation dialogs for removal and leaving. Explain effects on pending proposals.

## 29. Role-aware rendering

Role-aware UI improves clarity:

- hide or disable administrator-only settings for members;
- label why an action is unavailable;
- keep server authorization authoritative;
- handle a role changing during an active session through the membership subscription.

If membership is revoked, immediately clear group-specific client state and route back to `/groups`.

### Presence boundary

The MVP displays membership, not live online/offline presence. `onMembershipChanged` keeps the member list current. Do not infer presence from recent messages or subscription connectivity. Add online presence only after the backend defines heartbeat, timeout, privacy, and multi-device semantics.

---

# Part 6 — Real-time chat

## 30. Message timeline

Render:

- user messages;
- agent clarification messages;
- system status messages;
- proposal cards;
- execution outcomes.

Messages need:

- sender name and type;
- timestamp localized to the viewer;
- stable ordering;
- reply/reference context where present;
- delivery/analysis state;
- accessible grouping.

Never use `dangerouslySetInnerHTML` for chat or model output.

## 31. Message composer

Behavior:

- multiline input;
- Enter sends;
- Shift+Enter inserts a newline;
- disabled only while submitting the same message;
- preserve unsent text on transient errors;
- clear after the server acknowledges persistence;
- enforce backend-compatible length limits;
- provide an accessible send button.

Generate `clientMessageId` with `crypto.randomUUID()` before mutation. Reuse it when retrying the same message so backend idempotency works.

## 32. Optimistic messages

Optimistic insertion is acceptable for chat:

1. add a local `SENDING` message;
2. submit with stable `clientMessageId`;
3. replace it with the canonical server record;
4. mark `FAILED_TO_SEND` on terminal failure;
5. let the user retry with the same ID.

Do not optimistically create an agent response or proposal.

## 33. Subscription lifecycle

For each group workspace:

- subscribe after authenticated membership is known;
- filter server-side by group where supported;
- merge by stable record ID;
- ignore duplicates;
- unsubscribe on group change/unmount;
- reconnect after token refresh or network recovery;
- backfill missed records with a query after reconnection.

Do not pass an empty subscription filter object. Amplify warns that empty filters may behave inconsistently with authorization rules.

## 34. Pagination and scroll

- request 50 recent messages initially;
- request older messages in pages of 50;
- fetch newest messages initially;
- load older pages when requested or when scrolling upward;
- preserve viewport position when prepending;
- scroll to the newest message only if the user is already near the bottom;
- show a `New messages` affordance otherwise;
- virtualize only after measurement shows it is needed.

Use 25 records per audit-history page. Treat these as frontend defaults; backend-enforced maximums remain authoritative.

## 35. Agent-analysis states

Represent:

- `NOT_REQUESTED`;
- `QUEUED`;
- `ANALYZING`;
- `CLARIFICATION_REQUIRED`;
- `PROPOSAL_CREATED`;
- `NO_ACTION`;
- `FAILED`.

These states explain asynchronous behavior without pretending the calendar changed immediately.

Agent-result rendering:

- `Clarification` becomes an agent question in chat;
- `Proposal` becomes an action card;
- `Refusal` becomes a concise agent message with the safe reason;
- `NoAction` normally updates analysis status without adding chat noise;
- hidden reasoning and chain-of-thought are never rendered.

---

# Part 7 — Calendar projection

## 36. Calendar data boundary

The frontend receives a projection from the Family Planner backend. It never queries Google or Apple directly.

Projection fields should be limited to:

- provider event ID only when the UI truly needs an opaque reference;
- title or redacted busy label;
- start/end;
- timezone;
- all-day status;
- location when permitted;
- group attendee summary;
- sync status;
- provider version only for diagnostics hidden from ordinary users.

Do not expose credential references or raw provider payloads.

## 37. FullCalendar component

Implement FullCalendar as a focused Client Component.

Initial plugins:

- day grid;
- time grid;
- list;
- interaction for selection only.

Initial behavior:

- desktop default: month;
- optional week/day view;
- mobile default: list;
- fetch events for the visible range;
- render in the group's timezone;
- indicate sync/pending status textually;
- open a read-only event detail dialog on selection.

Set accessible calendar options deliberately:

- make relevant events keyboard-focusable;
- choose a heading level consistent with the page;
- provide meaningful event hints/labels;
- retain list view as an alternative.

## 38. No direct drag-to-update in MVP

Do not enable event drag/drop or resize for immediate mutation.

If visual rescheduling is added later:

1. drag creates a proposed update;
2. UI shows before/after;
3. users approve through the normal proposal flow;
4. executor performs the write.

The calendar must never bypass approval.

## 39. Timezone behavior

- store/transport instants as ISO 8601;
- retain IANA timezone identifiers;
- render calendar in group timezone by default;
- show viewer timezone when different;
- clearly label daylight-saving transitions;
- do not calculate relative scheduling intent in the browser.

The agent/backend resolves phrases such as “next Friday.” The frontend only displays the normalized result.

## 40. Event privacy

Support at least:

- group-created event details;
- redacted `Busy` blocks for private administrator events;
- conflict indicators without private descriptions.

The backend decides which fields are returned. The frontend must not attempt to derive or fetch hidden details.

## 41. Calendar synchronization status

Show:

- connected provider;
- target calendar display name;
- last successful sync;
- syncing;
- reconnect required;
- provider unavailable;
- stale projection warning.

Do not claim that an external calendar is current when the last sync failed.

---

# Part 8 — Proposal action cards and voting

## 42. Action-card placement

Proposal cards belong in the chat timeline because they arise from conversation. A calendar event may link back to its originating proposal, but voting stays in the proposal card.

## 43. Proposal-card content

Every card shows:

- operation: create, update, or delete;
- event title;
- date, start, end, timezone;
- location when present;
- affected participants;
- calendar target;
- conflict warning;
- plain-language summary;
- approval requirement;
- current votes;
- proposal expiration;
- status and last update.

For update:

- present before and after values;
- emphasize only changed fields.

For delete:

- use explicit destructive language;
- display the exact event being removed;
- always show that administrator approval is mandatory;
- require a confirmation dialog before the administrator accepts the deletion.

## 44. Voting controls

Rules:

- show `Accept` and `Reject` to eligible voters;
- submit proposal ID and immutable proposal version;
- disable controls while that vote mutation is in flight;
- do not mark approved locally based on vote counts;
- replace UI state only with canonical mutation/subscription data;
- handle duplicate vote and stale-version responses;
- allow changed votes only if backend policy explicitly supports them.

Administrator approval must be visually identifiable when required, but the frontend cannot infer that it is sufficient.

## 45. Proposal status rendering

Use text and icons, not color alone:

- pending approval;
- approved, waiting to execute;
- executing;
- completed;
- rejected;
- expired;
- superseded;
- stale because the external event changed;
- failed with retry/recovery guidance.

Never show `Completed` until the backend executor confirms the provider operation.

## 46. Proposal replacement

If a proposal is superseded:

- preserve it in history;
- disable old voting controls;
- link to the replacement;
- explain that prior votes no longer apply.

## 47. Conflict and stale states

Conflict card actions may include:

- return to chat to clarify;
- request a regenerated proposal;
- open current event details;
- dismiss without mutation.

Do not offer a client-side “force update” that bypasses provider version checks.

---

# Part 9 — Settings and audit

## 48. Calendar connection settings

Administrator-only settings show:

- connected provider;
- account display identifier where safe;
- granted capability summary;
- selected target calendar;
- connection health;
- last sync;
- reconnect;
- disconnect.

Render the canonical connection lifecycle:

- `CONNECTING` — authorization is in progress;
- `ACTIVE` — provider access is healthy;
- `FAILED` — connection attempt failed and may be retried;
- `REFRESH_REQUIRED` — credentials must be renewed;
- `REVOKED` — connection is no longer active.

Starting Google connection:

- call `startCalendarConnection`;
- backend returns a safe authorization URL or redirect response;
- backend validates OAuth state and PKCE at its dedicated HTTPS callback;
- callback redirects to `/groups/[groupId]/settings?calendar=connected` without exposing an authorization code or token;
- do not expose refresh tokens to JavaScript.

Apple/CalDAV remains a stretch provider and needs different onboarding language.

## 49. Target-calendar selection

After connection:

- display calendars returned by the backend;
- clearly mark read-only calendars;
- require confirmation before changing the group's write target;
- explain effects on existing proposals;
- let the backend revalidate selected calendar permissions.

## 50. Approval-policy settings

Administrators configure supported policies through constrained controls, not free-form JSON.

Show:

- administrator approval requirement;
- all affected members vs majority;
- rejection behavior;
- expiration duration.

Display a plain-language example before saving.

## 51. Audit history

The history view should provide:

- time;
- actor;
- action;
- resource;
- proposal version;
- vote outcome;
- execution status;
- correlation reference suitable for support.

Do not display:

- hidden model reasoning;
- secrets;
- raw tokens;
- complete provider payloads;
- private event fields omitted elsewhere.

Use cursor pagination.

### Account and membership lifecycle

Provide:

- `Leave group` for eligible members;
- clear transfer/delete guidance when an administrator is the last administrator;
- an account-deletion request flow;
- retention and deletion messaging before confirmation;
- immediate sign-out and client-cache clearing after confirmed account deletion.

The frontend only requests these operations. Backend policy determines whether ownership transfer, group deletion, or delayed retention is required.

---

# Part 10 — Interaction quality

## 52. Async state policy

Every mutation uses an explicit lifecycle:

```text
idle → submitting → acknowledged
                  ↘ retryable error
                  ↘ terminal error
```

Calendar execution is separate:

```text
approved → queued → executing → executed
                              ↘ stale
                              ↘ failed
```

Do not keep buttons spinning while waiting for an asynchronous agent or calendar worker. Acknowledge the accepted command and render its canonical status.

## 53. Optimistic-update policy

Allowed:

- pending chat message;
- low-risk display preference;
- tab/view selection.

Not allowed:

- approval completion;
- proposal status transitions;
- calendar event create/update/delete;
- membership role changes;
- connection success;
- audit records.

## 54. Notifications

Use:

- inline errors for field-specific problems;
- status banners for reconnect/sync issues;
- polite live regions for background completion;
- toasts only for short secondary confirmations.

Do not use a toast as the only record that a calendar operation failed.

## 55. Destructive actions

Require clear confirmation for:

- rejecting a proposal when rejection is terminal;
- deleting/cancelling an event proposal;
- removing a member;
- leaving a group;
- disconnecting a calendar;
- changing the target calendar.

Confirmation text must name the affected resource.

---

# Part 11 — Accessibility and responsive design

## 56. Accessibility baseline

Target WCAG 2.2 AA.

Required:

- semantic landmarks;
- one logical page heading;
- visible focus;
- skip link;
- keyboard-operable menus/dialogs/tabs;
- focus restoration after dialogs;
- accessible form labels and errors;
- status announcements through `aria-live`;
- sufficient contrast;
- reduced-motion support;
- touch targets large enough for mobile use.

## 57. Proposal accessibility

- operation appears in text;
- before/after values use semantic description lists;
- changed values are announced without relying on strike-through/color;
- vote totals include labels;
- disabled actions explain why;
- status changes use a polite live region;
- destructive proposals use explicit wording.

## 58. Calendar accessibility

- make events focusable where interaction exists;
- verify FullCalendar heading hierarchy;
- test month, time-grid, and list views with keyboard only;
- expose event details through a dialog with focus management;
- provide list view as an equivalent route to information;
- test at 200% zoom and narrow widths.

## 59. Responsive breakpoints

Design content-first rather than device-specific:

- large: simultaneous calendar/chat;
- medium: resizable or balanced panels;
- small: tabs and list calendar;
- very small: single-column cards and full-width dialogs/sheets.

Never hide proposal voting solely because the viewport is narrow.

---

# Part 12 — Security and privacy

## 60. Browser trust model

Treat every browser value as untrusted:

- route parameters;
- role labels;
- hidden inputs;
- proposal versions;
- calendar IDs;
- group IDs;
- invitation tokens.

The backend must authorize every operation.

## 61. Content safety

React escapes text by default. Keep chat, event titles, locations, and model summaries as text.

Do not:

- render model Markdown as HTML in the MVP;
- use `dangerouslySetInnerHTML`;
- execute links or scripts found in messages;
- log private conversation bodies to analytics.

If rich text is introduced later, use an allow-list sanitizer and a deliberately limited renderer.

## 62. Token and secret handling

- rely on Amplify Auth session management;
- do not copy JWTs to localStorage manually;
- do not log session objects;
- never place provider tokens in frontend state;
- use server-owned OAuth callback and credential storage;
- clear group-specific cache on sign-out.

## 63. Client logging

Production logs may include:

- route name;
- error category;
- correlation ID;
- operation name;
- timing.

They must not include:

- chat content;
- event descriptions;
- email invitation tokens;
- JWTs;
- OAuth codes;
- provider responses;
- private calendar details.

---

# Part 13 — Performance and resilience

## 64. Rendering strategy

- server-render public/static shells;
- client-render subscription-heavy workspace features;
- lazy-load FullCalendar if it materially reduces initial route cost;
- avoid loading calendar code on sign-in/group-list routes;
- keep proposal cards normal React components;
- paginate messages and audit history.

## 65. Subscription resilience

- show reconnecting status after connection loss;
- re-query after reconnect;
- deduplicate by record ID/version;
- do not create one subscription per message or proposal;
- dispose subscriptions during navigation;
- measure subscription error rates.

## 66. Calendar-range fetching

- query only visible calendar range plus a small buffer;
- cancel/ignore obsolete range requests;
- cache by group, timezone, and range;
- invalidate after projection subscription events;
- avoid loading the administrator's entire calendar.

## 67. Frontend metrics

Measure without collecting message content:

- route load time;
- message submit acknowledgement time;
- subscription reconnect count;
- proposal-card render failures;
- vote mutation latency;
- calendar-range query latency;
- JavaScript errors;
- Core Web Vitals.

---

# Part 14 — Testing

## 68. Test layers

### Unit tests

Use Vitest for:

- Zod contracts;
- event-to-calendar mapping;
- proposal before/after diffing;
- status-label selection;
- timezone formatting;
- error normalization;
- subscription deduplication.

### Component tests

Use React Testing Library for:

- message composer keyboard behavior;
- proposal cards;
- vote controls;
- dialogs;
- role-aware controls;
- loading/error/empty states.

Prefer queries by role, label, and accessible name.

### Integration tests

Use mock repositories/subscription sources for:

- optimistic message reconciliation;
- duplicate subscription events;
- stale proposal vote;
- role revocation;
- calendar reconnect state;
- event projection refresh.

### End-to-end tests

Use Playwright for:

1. authentication;
2. group creation;
3. invitation acceptance;
4. real-time chat between two contexts;
5. clarification response;
6. proposal appearance;
7. required votes;
8. executing and confirmed states;
9. calendar projection update;
10. audit entry.

## 69. Test fixtures

Use synthetic fixtures:

- fictional users;
- fictional family/group names;
- dedicated Google test calendar;
- deterministic timestamps;
- no production tokens;
- no copied personal events or conversations.

## 70. Accessibility tests

Automated:

- axe or equivalent accessibility checks;
- keyboard-focused component tests;
- accessible-name assertions.

Manual:

- keyboard-only full workflow;
- VoiceOver on macOS/iOS;
- 200% zoom;
- reduced motion;
- mobile viewport;
- high contrast.

Automated checks do not replace manual assistive-technology testing.

## 71. Frontend scripts

Expected scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

Create `frontend/vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/lib/testing/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

Create the test setup only when the first component test is added:

```typescript
import "@testing-library/jest-dom/vitest";
```

Keep Playwright configuration separate from Vitest. Playwright tests run against the application in a real browser; Vitest component tests use the controlled `jsdom` environment.

## 72. CI quality gate

For frontend changes:

1. install Node through the repository version policy;
2. enable Corepack;
3. run `pnpm install --frozen-lockfile`;
4. run lint;
5. run TypeScript checking;
6. run unit/component tests;
7. build Next.js;
8. run critical Playwright tests against a controlled environment.

Unit tests must not require AWS credentials.

---

# Part 15 — Deployment

## 73. Environments

Use:

- `dev` — personal Amplify sandbox;
- `demo` — stable production/demo environment used for judging.

Keep separate:

- Cognito pools;
- AppSync endpoints;
- tables;
- OAuth redirects;
- generated Amplify outputs;
- test users;
- calendar connections.

Never connect a personal calendar to the judging environment.

## 74. Amplify Hosting

Deploy Next.js through Amplify Hosting.

For the monorepo:

- mark the repository as a monorepo;
- set the frontend application root to `frontend`;
- configure the shared backend path according to Amplify's monorepo workflow;
- generate `amplify_outputs.json` for the target branch;
- use pnpm with the committed lockfile;
- keep main/demo deployments Git-driven.

Do not deploy a personal sandbox as production.

## 75. Branch workflow

- feature branches: local frontend plus personal sandbox where needed;
- main/demo branch: stable deployment;
- pull requests: lint, type-check, test, build;
- backend schema changes: reviewed with corresponding frontend contract changes;
- delete abandoned branch resources to control costs.

## 76. Deployment verification

After deployment:

- authentication works from the hosted domain;
- Cognito callback/logout URLs are correct;
- protected routes reject signed-out users;
- AppSync queries and subscriptions connect;
- two browser sessions receive chat updates;
- proposal votes update;
- calendar connection redirect returns safely;
- refresh/deep links work;
- no secrets appear in browser source or logs;
- error monitoring and budget alerts are active.

---

# Part 16 — Delivery sequence

## 77. Phase 1 — Static product shell

- scaffold Next.js;
- add design tokens/primitives;
- implement public/auth shells;
- build group workspace with synthetic fixtures;
- implement responsive calendar/chat layout;
- create proposal-card variants for every state.

Exit criterion: the complete product flow can be reviewed visually without AWS.

## 78. Phase 2 — Authentication and groups

- initialize Amplify;
- configure Cognito;
- protect routes;
- implement group list/create/invitations;
- add membership-aware navigation.

Exit criterion: two synthetic users can authenticate and join one group.

## 79. Phase 3 — Real-time chat

- typed data repositories;
- paginated messages;
- optimistic send;
- subscriptions and reconnection;
- agent/system message variants.

Exit criterion: two sessions exchange messages and recover after reconnect.

## 80. Phase 4 — Calendar projection

- FullCalendar views;
- visible-range query;
- event privacy/redaction;
- timezone display;
- sync health;
- mobile list view.

Exit criterion: the UI renders backend-projected test events without provider credentials.

## 81. Phase 5 — Proposals and voting

- operation cards;
- before/after rendering;
- approval requirements and votes;
- stale/version handling;
- executing/executed states;
- accessibility announcements.

Exit criterion: an approved backend proposal progresses to confirmed UI state without client-side authorization assumptions.

## 82. Phase 6 — Settings, audit, and hardening

- calendar connection settings;
- approval-policy settings;
- audit history;
- error/recovery states;
- accessibility review;
- Playwright critical path;
- Amplify Hosting demo deployment.

## 83. Frontend definition of done

Frontend MVP is complete when:

1. users can authenticate and recover access;
2. administrators can create a group and invite a member;
3. both users can chat in real time;
4. the calendar projection renders in group timezone;
5. agent clarifications and proposals appear in chat;
6. eligible users can vote exactly once per proposal version;
7. UI never claims execution before backend confirmation;
8. stale, rejected, expired, and failed states are understandable;
9. calendar credentials never reach browser code;
10. desktop and mobile workflows are usable;
11. keyboard and screen-reader checks pass;
12. lint, type-check, tests, build, and critical Playwright flow pass;
13. hosted demo works with synthetic judging accounts.

## 84. Decisions required before implementation

1. Final project name and visual identity.
2. Whether the first auth UI uses Amplify `Authenticator` or custom challenge screens.
3. Exact approval policy available in the MVP.
4. Whether private administrator events appear as `Busy` or are omitted.
5. Whether member votes can be changed before execution.
6. Invitation delivery mechanism for the demo.
7. Default mobile tab and calendar view.
8. Whether `amplify_outputs.json` is generated per environment or committed for a controlled branch.

Recommended defaults:

- use Amplify `Authenticator` first;
- administrator plus affected-member approval;
- private events shown as `Busy`;
- votes immutable per proposal version;
- invitation links copied manually for the demo if email delivery is not ready;
- Chat default on mobile;
- list calendar on mobile;
- regenerate Amplify outputs per environment.

## 85. References

- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [create-next-app CLI](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- [Amplify Gen 2 Next.js quickstart](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/)
- [Amplify outputs configuration](https://docs.amplify.aws/react/reference/amplify_outputs/)
- [Amplify Next.js server-side rendering](https://docs.amplify.aws/react/frontend/server-side-rendering/)
- [Amplify real-time subscriptions](https://docs.amplify.aws/react/frontend/data/subscribe-data/)
- [Amplify sandbox CLI](https://docs.amplify.aws/react/reference/cli-commands/)
- [Amplify monorepo deployment](https://docs.amplify.aws/react/deploy-and-host/fullstack-branching/monorepos/)
- [FullCalendar React](https://fullcalendar.io/docs/react)
- [FullCalendar accessibility](https://fullcalendar.io/docs/accessibility)
- [FullCalendar licensing](https://fullcalendar.io/license)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)

Recheck package commands and framework integration guidance against current official documentation when implementation starts. Next.js, Amplify Gen 2, and FullCalendar evolve quickly.
