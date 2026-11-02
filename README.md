# DECM Nexus Control Tower

An installable PWA and local API for logistics, procurement, partner, finance, evidence, and reporting workflows.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and replace `JWT_SECRET` before any shared deployment.
3. Start the web application and API together with `npm run dev`.
4. Open `http://127.0.0.1:4173` for the public homepage.
5. Open `http://127.0.0.1:4173/app` for the operational portal.

The seeded local administrator is `admin@decmnexus.com` with password `ChangeMe123!`. Change this immediately from the application sidebar.

## Remove demonstration data

First run `npm run data:preview-demo` to see how many packaged sample records will be affected. Then run `npm run data:clear-demo` to remove the sample jobs, requests, procurement records and unreferenced sample suppliers. The cleanup also removes expenses, invoices and uploaded documents attached to those sample jobs, including any you added to a sample job. It preserves the administrator account and unrelated business records, removes corresponding uploaded files, and disables future demo reseeding.

For a clean database from the first launch, set `SEED_DEMO_DATA=false` before starting the API.

## Quality checks

- `npm run build` creates the production PWA bundle.
- `npm test` runs the API integration tests.
- `npm run start` starts only the API on port 4174.

## Phase 1 coverage

- Authenticated service-request intake
- Quotation creation and approval status
- Job creation, assignment, status progression, milestones, incidents, and delivery evidence
- Controlled document uploads for PDF, PNG, JPEG, and DOCX up to 10 MB
- Invoice records and downloadable PDF operations reports
- Server-side validation, error recovery, audit history, and responsive PWA caching

## Phase 2 coverage

- Supplier and transporter onboarding
- Procurement requests and lifecycle stages
- Bid API and supplier comparison data model
- Expenses linked to jobs with live contribution updates
- Partner standing and performance records
- Role-aware navigation and API permissions
- Management reporting and audit access

## Deployment requirements

The included SQLite database and local document directory are appropriate for a single-server deployment. Before multi-server or public deployment, configure a managed database, object storage, TLS, backups, transactional email or WhatsApp providers, monitoring, and a rotated production secret. GPS, accounting, payment, and customs integrations require the selected external providers and credentials.

For temporary client sharing and a stable single-server Render deployment, see
[DEPLOYMENT.md](./DEPLOYMENT.md).

## Frontend structure

- `src/App.tsx` owns routing, authenticated state and the application shell.
- `src/marketing/MarketingSite.tsx` owns the four public marketing pages.
- `src/auth/Login.tsx` owns the authentication screen.
- `src/operations/OperationsViews.tsx` owns operational page composition.
- `src/operations/OperationsUi.tsx` contains reusable headings, status feedback,
  tables, tags and empty states.
- `src/operations/RecordDrawer.tsx` owns reusable record-entry forms.
