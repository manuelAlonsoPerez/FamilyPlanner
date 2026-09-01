## 📝 Description

Refactors the Family Planner workspace from one large client component into
focused, reusable components. It preserves the existing frontend behavior while
making each workspace area easier to maintain and test.

It also suppresses root-level hydration warnings caused by browser extensions,
such as LanguageTool, adding attributes to the document before React hydrates.

## 🎯 What does this PR do?

- [ ] Feature addition
- [x] Bug fix
- [ ] Documentation update
- [x] Code refactoring
- [ ] Other

## 🔍 Changes Made

- Extracted the workspace UI into dedicated components:
  - `Sidebar`
  - `TopBar`
  - `CalendarPanel`
  - `ChatPanel`
  - `ProposalCard`
  - `MembersPanel`
- Added a reusable `BrandMark` component.
- Moved shared fixture data and TypeScript types into `workspace-data.ts`.
- Reduced `family-workspace.tsx` to workspace composition, responsive tab state,
  and layout orchestration.
- Kept interactive state close to the component that owns it:
  - calendar selection remains in `CalendarPanel`;
  - chat drafts and messages remain in `ChatPanel`;
  - proposal voting is passed to `ProposalCard` through typed props.
- Added `suppressHydrationWarning` to the root `<html>` element to prevent
  extension-injected attributes from triggering the Next.js development
  hydration overlay.
- Preserved the existing responsive layout, accessibility labels, fixture data,
  and preview-only behavior.

## 🧪 Testing

- [x] I have tested this locally
- [ ] All automated tests pass — automated frontend tests are not implemented yet
- [x] No breaking changes

Validation completed:

- `pnpm frontend:lint`
- `pnpm frontend:typecheck`
- `pnpm frontend:build`

## 📸 Screenshots (if applicable)

No visual changes are expected from this refactor.

## 📋 Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Code is commented where necessary
- [x] Documentation updated where needed
- [x] Components have clear responsibilities
- [x] Shared data and types are not duplicated
- [x] Existing accessibility behavior is preserved

## 🚀 Deployment Notes

- No deployment configuration or environment variables changed.
- No backend, AWS, Amplify, or calendar-provider changes are included.
- Run `pnpm frontend:dev` from the repository root for local development.

## 📞 Additional Notes

- The hydration suppression is scoped to the root document element. Application
  hydration mismatches below the root will still be reported.
- The frontend continues to use in-memory fixture data. Authentication,
  persistence, subscriptions, backend voting, and calendar writes remain
  outside this PR.
