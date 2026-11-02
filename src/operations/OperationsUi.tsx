import {
  AlertTriangle,
  Building2,
  LoaderCircle,
  PackageCheck,
  Plus,
} from "lucide-react";

type AnyRow = Record<string, any>;

export function Header({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action && (
        <button className="primary" onClick={onAction}>
          <Plus />
          {action}
        </button>
      )}
    </div>
  );
}
export function Status({
  notice,
  error,
  loading,
  retry,
}: {
  notice: string;
  error: string;
  loading: boolean;
  retry: () => void;
}) {
  return (
    <>
      {loading && (
        <div className="loading-line" role="status">
          <LoaderCircle className="spin" />
          Refreshing operational records…
        </div>
      )}
      {notice && (
        <div className="toast" role="status">
          <PackageCheck />
          {notice}
        </div>
      )}
      {error && (
        <div className="error-banner" role="alert">
          <AlertTriangle />
          <span>{error}</span>
          <button onClick={retry}>Try again</button>
        </div>
      )}
    </>
  );
}
export const filtered = (rows: AnyRow[] = [], query: string) =>
  rows.filter((r) =>
    JSON.stringify(r).toLowerCase().includes(query.toLowerCase()),
  );
export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: any[][];
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <Empty text="No records match this view." />}
    </div>
  );
}
export function Tag({ value }: { value: string }) {
  const v = value.toLowerCase();
  const tone =
    v.includes("exception") ||
    v.includes("overdue") ||
    v.includes("suspend") ||
    v.includes("reject")
      ? "red"
      : v.includes("deliver") ||
          v.includes("paid") ||
          v.includes("verified") ||
          v.includes("approved") ||
          v.includes("received")
        ? "green"
        : v.includes("transit") || v.includes("sent") || v.includes("converted")
          ? "blue"
          : v.includes("checkpoint") ||
              v.includes("award") ||
              v.includes("review")
            ? "gold"
            : "neutral";
  return <span className={`status ${tone}`}>{value}</span>;
}
export function Empty({
  text,
  compact = false,
}: {
  text: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "empty compact" : "empty"}>
      <Building2 />
      <p>{text}</p>
    </div>
  );
}
