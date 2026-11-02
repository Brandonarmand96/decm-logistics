import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  FileCheck2,
  FileText,
  LoaderCircle,
  PackageCheck,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Truck,
  Upload,
  X,
} from "lucide-react";
import { api, currency, type Job, type ServiceRequest } from "../api";
import type { Drawer } from "./RecordDrawer";
import { DataTable, Empty, Header, Tag, filtered } from "./OperationsUi";

type AnyRow = Record<string, any>;
const jobFlow = ["Awaiting pickup", "In transit", "At checkpoint", "Delivered"];

export type View =
  | "Command centre"
  | "Requests"
  | "Quotations"
  | "Jobs"
  | "Procurement"
  | "Partners"
  | "Finance"
  | "Reports"
  | "Audit";

export function renderView(view: View, c: any) {
  switch (view) {
    case "Command centre":
      return <Dashboard {...c} />;
    case "Requests":
      return <RequestPage {...c} />;
    case "Quotations":
      return <QuotePage {...c} />;
    case "Jobs":
      return <JobsPage {...c} />;
    case "Procurement":
      return <ProcurementPage {...c} />;
    case "Partners":
      return <PartnersPage {...c} />;
    case "Finance":
      return <FinancePage {...c} />;
    case "Reports":
      return <ReportsPage />;
    case "Audit":
      return <AuditPage {...c} />;
  }
}
function Dashboard({
  dashboard,
  setDrawer,
  user,
  setView,
  setFocusJob,
}: {
  dashboard: any;
  setDrawer: (x: Drawer) => void;
  user: any;
  setView: (x: View) => void;
  setFocusJob: (x: Job) => void;
}) {
  const jobs: Job[] = dashboard?.jobs || [];
  const active = jobs.filter((j) => j.status !== "Delivered").length;
  const risk = jobs.filter((j) => j.status === "Exception").length;
  const revenue = jobs.reduce((s, j) => s + j.value, 0);
  const margin = jobs.reduce((s, j) => s + j.value - j.cost, 0);
  const open = (reference: string) => {
    const job = jobs.find((j) => j.reference === reference);
    if (job) {
      setFocusJob(job);
      setView("Jobs");
    }
  };
  return (
    <>
      <Header
        title="Operations in motion"
        text={`${new Intl.DateTimeFormat("en-NG", { dateStyle: "full" }).format(new Date())} · Live server-backed view`}
        action={
          ["admin", "operations"].includes(user.role)
            ? "New request"
            : undefined
        }
        onAction={() => setDrawer("request")}
      />
      <section className="dispatch-brief">
        <div>
          <h2>{active} jobs are moving today.</h2>
          <p>
            <strong>{risk} needs intervention</strong>;{" "}
            {dashboard?.openRequests || 0} requests remain open.
          </p>
        </div>
        <dl>
          <div>
            <dt>Booked</dt>
            <dd>{currency(revenue)}</dd>
          </div>
          <div>
            <dt>Expected contribution</dt>
            <dd>
              {currency(margin)}{" "}
              <small>
                {revenue ? Math.round((margin / revenue) * 100) : 0}%
              </small>
            </dd>
          </div>
        </dl>
      </section>
      <div className="split">
        <section className="panel jobs-panel">
          <div className="panel-head">
            <div>
              <h2>Active movement ledger</h2>
              <p>Every owner, promise and next checkpoint.</p>
            </div>
          </div>
          <JobRecords rows={jobs.slice(0, 8)} />
        </section>
        <aside className="attention">
          <div className="panel-head">
            <div>
              <h2>Action queue</h2>
              <p>Decisions that unblock delivery.</p>
            </div>
          </div>
          <ol>
            {(dashboard?.actions || []).map((a: any) => (
              <li key={a.reference}>
                <span className="time">
                  {a.status === "Exception" ? "NOW" : "NEXT"}
                </span>
                <div>
                  <strong>
                    {a.reference} · {a.status}
                  </strong>
                  <p>
                    {a.client} · {a.promise}
                  </p>
                  <button onClick={() => open(a.reference)}>Open job</button>
                </div>
              </li>
            ))}
            {!dashboard?.actions?.length && (
              <Empty compact text="No operational actions need attention." />
            )}
          </ol>
        </aside>
      </div>
    </>
  );
}
function RequestPage({
  data,
  query,
  setDrawer,
  refresh,
  fail,
  user,
}: {
  data: any;
  query: string;
  setDrawer: (x: Drawer) => void;
  refresh: (m?: string) => void;
  fail: (x: string) => void;
  user: any;
}) {
  const rows = filtered(data.requests, query) as ServiceRequest[];
  const can = ["admin", "operations"].includes(user.role);
  const status = async (id: number, s: string) => {
    try {
      await api(`/requests/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: s }),
      });
      refresh("Request status updated.");
    } catch (e) {
      fail((e as Error).message);
    }
  };
  return (
    <>
      <Header
        title="Service requests"
        text="Qualify demand, prepare a quotation and convert approved work."
        action={can ? "New request" : undefined}
        onAction={() => setDrawer("request")}
      />
      <section className="panel list-panel">
        <DataTable
          headers={[
            "Reference",
            "Customer",
            "Service",
            "Route",
            "Status",
            can ? "Next action" : "Access",
          ]}
          rows={rows.map((r) => [
            r.reference,
            <>
              <strong>{r.customer}</strong>
              <small>{r.contact_email || "No email"}</small>
            </>,
            r.service,
            `${r.origin} → ${r.destination}`,
            <Tag value={r.status} />,
            can ? (
              <select
                aria-label={`Update ${r.reference}`}
                value={r.status}
                onChange={(e) => status(r.id, e.target.value)}
              >
                <option>New</option>
                <option>Quoted</option>
                <option>Approved</option>
                <option>Converted</option>
                <option>Cancelled</option>
              </select>
            ) : (
              <span className="read-only">Read only</span>
            ),
          ])}
        />
      </section>
    </>
  );
}
function QuotePage({
  data,
  query,
  setDrawer,
  refresh,
  fail,
  user,
}: {
  data: any;
  query: string;
  setDrawer: (x: Drawer) => void;
  refresh: (m?: string) => void;
  fail: (x: string) => void;
  user: any;
}) {
  const rows = filtered(data.quotes, query);
  const can = ["admin", "operations", "finance"].includes(user.role);
  const update = async (id: number, status: string) => {
    try {
      await api(`/quotations/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      refresh("Quotation status updated.");
    } catch (e) {
      fail((e as Error).message);
    }
  };
  return (
    <>
      <Header
        title="Quotations"
        text="Price, issue and record customer decisions without losing the request context."
        action={can ? "New quotation" : undefined}
        onAction={() => setDrawer("quotation")}
      />
      <section className="panel list-panel">
        <DataTable
          headers={[
            "Reference",
            "Customer",
            "Service",
            "Amount",
            "Valid until",
            "Status",
          ]}
          rows={rows.map((r: any) => [
            r.reference,
            r.customer,
            r.service,
            currency(r.amount),
            r.valid_until || "Not set",
            can ? (
              <select
                value={r.status}
                onChange={(e) => update(r.id, e.target.value)}
              >
                <option>Draft</option>
                <option>Sent</option>
                <option>Approved</option>
                <option>Rejected</option>
                <option>Expired</option>
              </select>
            ) : (
              <Tag value={r.status} />
            ),
          ])}
        />
      </section>
    </>
  );
}
function JobsPage({
  data,
  query,
  setDrawer,
  refresh,
  fail,
  user,
  focusJob,
  setFocusJob,
}: {
  data: any;
  query: string;
  setDrawer: (x: Drawer) => void;
  refresh: (m?: string) => void;
  fail: (x: string) => void;
  user: any;
  focusJob: Job | null;
  setFocusJob: (x: Job | null) => void;
}) {
  const rows = filtered(data.jobs, query) as Job[];
  const [selected, setSelected] = useState<Job | null>(focusJob);
  const can = ["admin", "operations"].includes(user.role);
  useEffect(() => {
    if (focusJob) {
      setSelected(focusJob);
      setFocusJob(null);
    }
  }, [focusJob, setFocusJob]);
  const advance = async (j: Job) => {
    const i = jobFlow.indexOf(j.status);
    const status =
      j.status === "Exception"
        ? "In transit"
        : jobFlow[Math.min(i + 1, jobFlow.length - 1)];
    try {
      await api(`/jobs/${j.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      refresh(`${j.reference} advanced to ${status}.`);
    } catch (e) {
      fail((e as Error).message);
    }
  };
  return (
    <>
      <Header
        title="Jobs"
        text="Track assignment, movement, exceptions, costs and evidence."
        action={can ? "Create job" : undefined}
        onAction={() => setDrawer("job")}
      />
      <section className="panel list-panel">
        <JobRecords
          rows={rows}
          advance={can ? advance : undefined}
          manage={setSelected}
        />
      </section>
      {selected && (
        <JobDetail
          job={selected}
          close={() => setSelected(null)}
          editable={can}
          fail={fail}
        />
      )}
    </>
  );
}
function JobRecords({
  rows,
  advance,
  manage,
}: {
  rows: Job[];
  advance?: (j: Job) => void;
  manage?: (j: Job) => void;
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Job</th>
            <th>Client and service</th>
            <th>Route</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Promise</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((j) => (
            <tr key={j.id}>
              <td>
                <strong>{j.reference}</strong>
              </td>
              <td>
                <strong>{j.client}</strong>
                <small>{j.service}</small>
              </td>
              <td>
                {j.origin} → {j.destination}
              </td>
              <td>
                <Tag value={j.status} />
              </td>
              <td>{j.owner}</td>
              <td>{j.promise}</td>
              <td>
                <div className="row-actions">
                  {manage && (
                    <button className="table-action" onClick={() => manage(j)}>
                      Evidence
                    </button>
                  )}
                  {advance && (
                    <button
                      className="table-action"
                      disabled={j.status === "Delivered"}
                      onClick={() => advance(j)}
                    >
                      Advance
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mobile-ledger">
        {rows.map((j) => (
          <article key={j.id}>
            <div className="mobile-ledger-head">
              <strong>{j.reference}</strong>
              <Tag value={j.status} />
            </div>
            <h3>{j.client}</h3>
            <p>{j.service}</p>
            <dl>
              <div>
                <dt>Route</dt>
                <dd>
                  {j.origin} → {j.destination}
                </dd>
              </div>
              <div>
                <dt>Promise</dt>
                <dd>{j.promise}</dd>
              </div>
            </dl>
            <div className="row-actions">
              {manage && (
                <button className="mobile-open" onClick={() => manage(j)}>
                  Evidence
                </button>
              )}
              {advance && (
                <button
                  className="mobile-open"
                  disabled={j.status === "Delivered"}
                  onClick={() => advance(j)}
                >
                  Advance status <ChevronRight />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {!rows.length && <Empty text="No jobs match this view." />}
    </div>
  );
}
function JobDetail({
  job,
  close,
  editable,
  fail,
}: {
  job: Job;
  close: () => void;
  editable: boolean;
  fail: (x: string) => void;
}) {
  const [events, setEvents] = useState<AnyRow[]>([]);
  const [documents, setDocuments] = useState<AnyRow[]>([]);
  const [error, setError] = useState("");
  const load = useCallback(
    () =>
      Promise.all([
        api<AnyRow[]>(`/jobs/${job.id}/events`),
        api<AnyRow[]>(`/documents/job/${job.id}`),
      ])
        .then(([e, d]) => {
          setEvents(e);
          setDocuments(d);
        })
        .catch((e) => setError(e.message)),
    [job.id],
  );
  useEffect(() => {
    load();
  }, [load]);
  async function addEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await api(`/jobs/${job.id}/events`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      form.reset();
      load();
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      fail(message);
    }
  }
  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await api(`/documents/job/${job.id}`, { method: "POST", body: fd });
      form.reset();
      load();
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      fail(message);
    }
  }
  return (
    <div className="drawer-backdrop" onMouseDown={close}>
      <aside
        className="drawer job-detail"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <div>
            <h2>{job.reference} evidence</h2>
            <p>
              {job.client} · {job.origin} to {job.destination}
            </p>
          </div>
          <button onClick={close} aria-label="Close">
            <X />
          </button>
        </div>
        {error && (
          <div className="inline-error">
            <AlertTriangle />
            {error}
          </div>
        )}
        {editable && (
          <>
            <section>
              <h3>Add milestone</h3>
              <form className="compact-form" onSubmit={addEvent}>
                <label>
                  Event type
                  <select name="event_type">
                    <option>Status update</option>
                    <option>Pickup</option>
                    <option>Checkpoint</option>
                    <option>Incident</option>
                    <option>Delivery</option>
                  </select>
                </label>
                <label>
                  Description
                  <textarea
                    name="description"
                    required
                    maxLength={1000}
                    rows={3}
                  />
                </label>
                <label>
                  Location
                  <input name="location" />
                </label>
                <button className="primary">
                  <Plus />
                  Add milestone
                </button>
              </form>
            </section>
            <section>
              <h3>Upload evidence</h3>
              <form className="upload-form" onSubmit={upload}>
                <label>
                  Category
                  <select name="category">
                    <option>Proof of delivery</option>
                    <option>Invoice</option>
                    <option>Packing list</option>
                    <option>Delivery note</option>
                    <option>Incident evidence</option>
                  </select>
                </label>
                <label className="file-field">
                  <Upload />
                  Choose PDF, image or Word document
                  <input
                    name="file"
                    type="file"
                    required
                    accept=".pdf,.png,.jpg,.jpeg,.docx"
                  />
                </label>
                <button className="secondary">Upload document</button>
              </form>
            </section>
          </>
        )}
        <section>
          <h3>Audit trail</h3>
          <div className="event-list">
            {events.map((x) => (
              <article key={x.id}>
                <strong>{x.event_type}</strong>
                <p>{x.description}</p>
                <small>
                  {x.location && `${x.location} · `}
                  {new Date(`${x.created_at}Z`).toLocaleString("en-NG")}
                </small>
              </article>
            ))}
            {!events.length && (
              <Empty compact text="No milestones recorded yet." />
            )}
          </div>
        </section>
        <section>
          <h3>Documents</h3>
          <div className="document-list">
            {documents.map((x) => (
              <a
                key={x.id}
                href={`http://127.0.0.1:4174/uploads/${x.stored_name}`}
                target="_blank"
                rel="noreferrer"
              >
                <FileText />
                <span>
                  <strong>{x.original_name}</strong>
                  <small>
                    {x.category} · {Math.round(x.size / 1024)} KB
                  </small>
                </span>
              </a>
            ))}
            {!documents.length && (
              <Empty compact text="No evidence uploaded yet." />
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
function ProcurementPage({
  data,
  query,
  setDrawer,
  refresh,
  fail,
  user,
}: {
  data: any;
  query: string;
  setDrawer: (x: Drawer) => void;
  refresh: (m?: string) => void;
  fail: (x: string) => void;
  user: any;
}) {
  const rows = filtered(data.procurement, query);
  const can = ["admin", "procurement"].includes(user.role);
  const update = async (id: number, stage: string) => {
    try {
      await api(`/procurement/${id}/stage`, {
        method: "PATCH",
        body: JSON.stringify({ stage }),
      });
      refresh("Procurement stage updated.");
    } catch (e) {
      fail((e as Error).message);
    }
  };
  return (
    <>
      <Header
        title="Procurement"
        text="Control every decision from purchase request to goods received."
        action={can ? "New purchase request" : undefined}
        onAction={() => setDrawer("procurement")}
      />
      <section className="panel list-panel">
        <DataTable
          headers={[
            "Reference",
            "Requirement",
            "Client",
            "Budget",
            "Due",
            "Stage",
          ]}
          rows={rows.map((r: any) => [
            r.reference,
            r.requirement,
            r.client,
            currency(r.amount),
            r.due_date || "Not set",
            can ? (
              <select
                value={r.stage}
                onChange={(e) => update(r.id, e.target.value)}
              >
                <option>Purchase request</option>
                <option>RFQ issued</option>
                <option>Bid comparison</option>
                <option>Supplier awarded</option>
                <option>Purchase order</option>
                <option>Goods received</option>
                <option>Closed</option>
              </select>
            ) : (
              <Tag value={r.stage} />
            ),
          ])}
        />
      </section>
    </>
  );
}
function PartnersPage({
  data,
  query,
  setDrawer,
  user,
}: {
  data: any;
  query: string;
  setDrawer: (x: Drawer) => void;
  user: any;
}) {
  const suppliers = filtered(data.suppliers, query);
  const transporters = filtered(data.transporters, query);
  const canSupplier = ["admin", "procurement"].includes(user.role),
    canTransport = ["admin", "operations"].includes(user.role);
  return (
    <>
      <Header
        title="Partners and suppliers"
        text="Verify capability, standing and performance before assignment."
        action={canSupplier ? "Add supplier" : undefined}
        onAction={() => setDrawer("supplier")}
      />
      {canTransport && (
        <div className="finance-actions">
          <button
            className="secondary"
            onClick={() => setDrawer("transporter")}
          >
            <Plus />
            Add transporter
          </button>
        </div>
      )}
      <div className="tabs-copy">
        <strong>Suppliers</strong>
        <span>{suppliers.length} records</span>
      </div>
      <section className="panel list-panel">
        <DataTable
          headers={[
            "Organisation",
            "Category",
            "Performance",
            "Orders",
            "Standing",
          ]}
          rows={suppliers.map((s: any) => [
            s.name,
            s.category,
            `${s.score}/100`,
            s.orders,
            <Tag value={s.status} />,
          ])}
        />
      </section>
      <div className="tabs-copy second">
        <strong>Transporters</strong>
        <span>{transporters.length} records</span>
      </div>
      <section className="panel list-panel">
        <DataTable
          headers={[
            "Organisation",
            "Vehicle",
            "Registration",
            "Insurance",
            "Standing",
          ]}
          rows={transporters.map((t: any) => [
            t.name,
            t.vehicle_type,
            t.registration,
            t.insurance_expiry || "Not recorded",
            <Tag value={t.status} />,
          ])}
        />
      </section>
    </>
  );
}
function FinancePage({
  data,
  query,
  setDrawer,
  user,
}: {
  data: any;
  query: string;
  setDrawer: (x: Drawer) => void;
  user: any;
}) {
  const expenses = filtered(data.expenses, query),
    invoices = filtered(data.invoices, query);
  const canExpense = ["admin", "operations", "finance"].includes(user.role),
    canInvoice = ["admin", "finance"].includes(user.role);
  return (
    <>
      <Header
        title="Finance"
        text="Keep commercial outcomes connected to operational work."
        action={canExpense ? "Record expense" : undefined}
        onAction={() => setDrawer("expense")}
      />
      {canInvoice && (
        <div className="finance-actions">
          <button className="secondary" onClick={() => setDrawer("invoice")}>
            <Plus />
            Create invoice
          </button>
        </div>
      )}
      <div className="tabs-copy">
        <strong>Invoices</strong>
        <span>{invoices.length} records</span>
      </div>
      <section className="panel list-panel">
        <DataTable
          headers={["Invoice", "Client", "Amount", "Due", "Status"]}
          rows={invoices.map((r: any) => [
            r.reference,
            r.client,
            currency(r.amount),
            r.due_date || "Not set",
            <Tag value={r.status} />,
          ])}
        />
      </section>
      <div className="tabs-copy second">
        <strong>Expenses</strong>
        <span>{expenses.length} records</span>
      </div>
      <section className="panel list-panel">
        <DataTable
          headers={["Job", "Category", "Description", "Amount", "Date"]}
          rows={expenses.map((r: any) => [
            r.job_reference || "General",
            r.category,
            r.description,
            currency(r.amount),
            r.spent_on,
          ])}
        />
      </section>
    </>
  );
}
function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api("/reports/summary")
      .then(setReport)
      .catch((e) => setError(e.message));
  }, []);
  async function download() {
    try {
      const blob = await api<Blob>("/reports/operations.pdf");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "decm-operations-report.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  return (
    <>
      <Header
        title="Reports"
        text="Management and customer-ready evidence generated from live records."
      />
      <section className="report-summary">
        <div>
          <h2>{report?.summary?.jobs || 0} jobs recorded</h2>
          <p>
            {currency(report?.summary?.revenue || 0)} revenue ·{" "}
            {currency(report?.summary?.contribution || 0)} expected contribution
          </p>
        </div>
        <button className="primary" onClick={download}>
          <Download />
          Download operations PDF
        </button>
      </section>
      {error && (
        <div className="error-banner">
          <AlertTriangle />
          {error}
        </div>
      )}
      <section className="panel list-panel">
        <DataTable
          headers={["Status", "Jobs"]}
          rows={(report?.byStatus || []).map((r: any) => [
            <Tag value={r.status} />,
            r.count,
          ])}
        />
      </section>
    </>
  );
}
function AuditPage({ data, query }: { data: any; query: string }) {
  const rows = filtered(data.audit, query);
  return (
    <>
      <Header
        title="Audit history"
        text="A trace of sign-ins and material changes across the workspace."
      />
      <section className="panel list-panel">
        <DataTable
          headers={["Time", "User", "Action", "Record", "Details"]}
          rows={rows.map((r: any) => [
            new Date(`${r.created_at}Z`).toLocaleString("en-NG"),
            r.user_name || "System",
            r.action,
            `${r.entity_type}${r.entity_id ? ` #${r.entity_id}` : ""}`,
            <code>{r.details}</code>,
          ])}
        />
      </section>
    </>
  );
}
