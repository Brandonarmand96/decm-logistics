import { FormEvent, useState } from "react";
import { AlertTriangle, CheckCircle2, LoaderCircle, X } from "lucide-react";
import { api } from "../api";

export type Drawer =
  | "request"
  | "quotation"
  | "job"
  | "procurement"
  | "supplier"
  | "transporter"
  | "expense"
  | "invoice"
  | "password"
  | null;

const serviceOptions = [
  "Transport and distribution",
  "Procurement + delivery",
  "Freight forwarding",
  "Warehousing",
  "Humanitarian logistics",
  "Supply chain consulting",
];

export function RecordDrawer({
  type,
  data,
  close,
  done,
}: {
  type: Exclude<Drawer, null>;
  data: any;
  close: () => void;
  done: (m: string) => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const config = drawerConfig(type, data);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      await api(config.path, { method: "POST", body: JSON.stringify(body) });
      done(config.success);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="drawer-backdrop" onMouseDown={close}>
      <aside
        className="drawer"
        onMouseDown={(e) => e.stopPropagation()}
        aria-label={config.title}
      >
        <div className="drawer-head">
          <div>
            <h2>{config.title}</h2>
            <p>{config.text}</p>
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
        <form onSubmit={submit}>
          {config.fields.map((f: any) => (
            <Field key={f.name} {...f} />
          ))}
          <div className="form-actions">
            <button type="button" className="secondary" onClick={close}>
              Cancel
            </button>
            <button className="primary" disabled={busy}>
              {busy ? <LoaderCircle className="spin" /> : <CheckCircle2 />}
              {busy ? "Saving…" : config.action}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
function Field({
  name,
  label,
  type = "text",
  required = true,
  options,
  min,
  step,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: { value: any; label: string }[];
  min?: string;
  step?: string;
  placeholder?: string;
}) {
  return (
    <label>
      {label}
      {options ? (
        <select name={name} required={required}>
          <option value="">Select…</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          rows={4}
          required={required}
          maxLength={2000}
          placeholder={placeholder}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          min={min}
          step={step}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}
function drawerConfig(type: string, data: any) {
  const requestOptions = (data.requests || [])
    .filter((r: any) => r.status !== "Converted")
    .map((r: any) => ({
      value: r.id,
      label: `${r.reference} · ${r.customer}`,
    }));
  const jobOptions = (data.jobs || []).map((j: any) => ({
    value: j.id,
    label: `${j.reference} · ${j.client}`,
  }));
  const base: any = {
    request: {
      title: "New service request",
      text: "Capture enough detail to prepare a quotation.",
      path: "/requests",
      success: "Service request created.",
      action: "Create request",
      fields: [
        { name: "customer", label: "Customer" },
        {
          name: "contact_email",
          label: "Contact email",
          type: "email",
          required: false,
        },
        {
          name: "service",
          label: "Service",
          options: serviceOptions.map((x) => ({ value: x, label: x })),
        },
        { name: "origin", label: "Origin" },
        { name: "destination", label: "Destination" },
        {
          name: "details",
          label: "Request details",
          type: "textarea",
          required: false,
        },
      ],
    },
    quotation: {
      title: "New quotation",
      text: "Price an open customer request.",
      path: "/quotations",
      success: "Quotation created.",
      action: "Create quotation",
      fields: [
        {
          name: "request_id",
          label: "Service request",
          options: requestOptions,
        },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          min: "0",
          step: "0.01",
        },
        {
          name: "valid_until",
          label: "Valid until",
          type: "date",
          required: false,
        },
        {
          name: "notes",
          label: "Commercial notes",
          type: "textarea",
          required: false,
        },
      ],
    },
    job: {
      title: "Create operational job",
      text: "Convert approved work into an owned delivery record.",
      path: "/jobs",
      success: "Job created.",
      action: "Create job",
      fields: [
        {
          name: "request_id",
          label: "Related request",
          options: requestOptions,
          required: false,
        },
        { name: "client", label: "Client" },
        { name: "service", label: "Service" },
        { name: "origin", label: "Origin" },
        { name: "destination", label: "Destination" },
        { name: "owner", label: "Owner", required: false },
        { name: "promise", label: "Promised date or window", required: false },
        {
          name: "value",
          label: "Booked value",
          type: "number",
          min: "0",
          step: "0.01",
        },
      ],
    },
    procurement: {
      title: "New purchase request",
      text: "Start an auditable procurement workflow.",
      path: "/procurement",
      success: "Purchase request created.",
      action: "Create request",
      fields: [
        { name: "requirement", label: "Requirement" },
        { name: "client", label: "Client" },
        {
          name: "amount",
          label: "Budget",
          type: "number",
          min: "0",
          step: "0.01",
        },
        {
          name: "due_date",
          label: "Required by",
          type: "date",
          required: false,
        },
      ],
    },
    supplier: {
      title: "Add supplier",
      text: "Create a partner record for verification.",
      path: "/suppliers",
      success: "Supplier added.",
      action: "Add supplier",
      fields: [
        { name: "name", label: "Organisation" },
        { name: "category", label: "Category" },
        { name: "email", label: "Email", type: "email", required: false },
        { name: "phone", label: "Phone", required: false },
        {
          name: "status",
          label: "Standing",
          options: ["Provisional", "Verified", "Review due", "Suspended"].map(
            (x) => ({ value: x, label: x }),
          ),
        },
      ],
    },
    transporter: {
      title: "Add transporter",
      text: "Record fleet capability and verification details.",
      path: "/transporters",
      success: "Transporter added.",
      action: "Add transporter",
      fields: [
        { name: "name", label: "Organisation or owner" },
        { name: "contact", label: "Contact" },
        { name: "vehicle_type", label: "Vehicle type" },
        { name: "registration", label: "Registration" },
        {
          name: "insurance_expiry",
          label: "Insurance expiry",
          type: "date",
          required: false,
        },
      ],
    },
    expense: {
      title: "Record expense",
      text: "Connect a direct cost to an operational job.",
      path: "/expenses",
      success: "Expense recorded.",
      action: "Record expense",
      fields: [
        { name: "job_id", label: "Job", options: jobOptions, required: false },
        { name: "category", label: "Category" },
        { name: "description", label: "Description" },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          min: "0.01",
          step: "0.01",
        },
        { name: "spent_on", label: "Date", type: "date" },
      ],
    },
    invoice: {
      title: "Create invoice",
      text: "Record a customer billing obligation.",
      path: "/invoices",
      success: "Invoice created.",
      action: "Create invoice",
      fields: [
        { name: "job_id", label: "Job", options: jobOptions, required: false },
        { name: "client", label: "Client" },
        {
          name: "amount",
          label: "Amount",
          type: "number",
          min: "0.01",
          step: "0.01",
        },
        { name: "due_date", label: "Due date", type: "date", required: false },
      ],
    },
    password: {
      title: "Change password",
      text: "Use at least 12 characters with upper case, lower case and a number.",
      path: "/auth/change-password",
      success: "Password changed. Use the new password next time you sign in.",
      action: "Change password",
      fields: [
        {
          name: "current_password",
          label: "Current password",
          type: "password",
        },
        { name: "new_password", label: "New password", type: "password" },
      ],
    },
  };
  return base[type];
}
