import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Download,
  FileCheck2,
  FileText,
  Globe2,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Network,
  PackageCheck,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Truck,
  Upload,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import {
  api,
  currency,
  getSession,
  login,
  saveSession,
  type Job,
  type ServiceRequest,
} from "./api";
import { Login } from "./auth/Login";
import { MarketingSite } from "./marketing/MarketingSite";
import { RecordDrawer, type Drawer } from "./operations/RecordDrawer";
import { renderView, type View } from "./operations/OperationsViews";
import { Status } from "./operations/OperationsUi";

type AnyRow = Record<string, any>;
const nav: { label: View; icon: typeof LayoutDashboard; roles?: string[] }[] = [
  { label: "Command centre", icon: LayoutDashboard },
  { label: "Requests", icon: ClipboardList },
  { label: "Quotations", icon: FileText },
  { label: "Jobs", icon: Truck },
  { label: "Procurement", icon: Boxes },
  { label: "Partners", icon: Users },
  {
    label: "Finance",
    icon: CircleDollarSign,
    roles: ["admin", "finance", "operations"],
  },
  { label: "Reports", icon: FileCheck2 },
  { label: "Audit", icon: ShieldCheck, roles: ["admin"] },
];
const jobFlow = ["Awaiting pickup", "In transit", "At checkpoint", "Delivered"];
export default function App() {
  const [session, setSession] = useState(getSession());
  const [view, setView] = useState<View>("Command centre");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [menu, setMenu] = useState(false);
  const [data, setData] = useState<Record<string, AnyRow[]>>({});
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [focusJob, setFocusJob] = useState<Job | null>(null);
  useEffect(() => {
    const logout = () => setSession(null);
    window.addEventListener("decm:logout", logout);
    return () => window.removeEventListener("decm:logout", logout);
  }, []);
  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError("");
    try {
      const [
        d,
        requests,
        quotes,
        jobs,
        procurement,
        suppliers,
        transporters,
        expenses,
        invoices,
      ] = await Promise.all([
        api("/dashboard"),
        api("/requests"),
        api("/quotations"),
        api("/jobs"),
        api("/procurement"),
        api("/suppliers"),
        api("/transporters"),
        api("/expenses"),
        api("/invoices"),
      ]);
      setDashboard(d);
      setData({
        requests: requests as AnyRow[],
        quotes: quotes as AnyRow[],
        jobs: jobs as AnyRow[],
        procurement: procurement as AnyRow[],
        suppliers: suppliers as AnyRow[],
        transporters: transporters as AnyRow[],
        expenses: expenses as AnyRow[],
        invoices: invoices as AnyRow[],
      });
      if (session.user.role === "admin")
        api<AnyRow[]>("/audit")
          .then((a) => setData((p) => ({ ...p, audit: a })))
          .catch(() => {});
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [session]);
  useEffect(() => {
    load();
  }, [load]);
  const refresh = async (message?: string) => {
    await load();
    if (message) {
      setNotice(message);
      setTimeout(() => setNotice(""), 4000);
    }
    setDrawer(null);
  };
  const publicPath =
    window.location.pathname === "/index.html"
      ? "/"
      : window.location.pathname.replace(/\/$/, "") || "/";
  useEffect(() => {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = ["/", "/services", "/about", "/contact"].includes(
      publicPath,
    )
      ? "index, follow, max-image-preview:large"
      : "noindex, nofollow";
    if (publicPath === "/app") {
      document.title = "Client Portal | DECM Nexus";
    }
  }, [publicPath]);
  if (["/", "/services", "/about", "/contact"].includes(publicPath))
    return <MarketingSite path={publicPath} />;
  if (
    window.location.pathname !== "/app" &&
    window.location.pathname !== "/app/"
  )
    return <NotFound />;
  if (!session) return <Login onLogin={setSession} />;
  const allowed = nav.filter(
    (n) => !n.roles || n.roles.includes(session.user.role),
  );
  const logout = () => {
    saveSession(null);
    setSession(null);
  };
  return (
    <div className="app-shell">
      <aside className={menu ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <img
            src="/decm-nexus-logo-white.png"
            alt="DECM Nexus Integrated Logistics and Consulting Ltd"
          />
        </div>
        <button
          className="close-menu"
          onClick={() => setMenu(false)}
          aria-label="Close navigation"
        >
          <X />
        </button>
        <nav aria-label="Primary navigation">
          {allowed.map((n) => (
            <button
              key={n.label}
              className={view === n.label ? "active" : ""}
              onClick={() => {
                setView(n.label);
                setMenu(false);
              }}
            >
              <n.icon />
              <span>{n.label}</span>
              {n.label === "Jobs" && (
                <b>
                  {data.jobs?.filter((j) => j.status !== "Delivered").length ||
                    0}
                </b>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="profile">
            <span>
              {session.user.name
                .split(" ")
                .map((x) => x[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div>
              <strong>{session.user.name}</strong>
              <small>{session.user.role}</small>
            </div>
          </div>
          <button onClick={() => setDrawer("password")}>
            <ShieldCheck />
            <span>Change password</span>
          </button>
          <button onClick={logout}>
            <LogOut />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMenu(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </button>
          <div className="search">
            <Search />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label="Search workspace"
            />
          </div>
          <span className="live-label">
            <i />
            SERVER CONNECTED
          </span>
          <button
            className="icon-button"
            onClick={() => refresh()}
            aria-label="Refresh data"
          >
            <RefreshCcw />
          </button>
          {["admin", "operations"].includes(session.user.role) && (
            <button className="primary" onClick={() => setDrawer("request")}>
              <Plus />
              New request
            </button>
          )}
        </header>
        <section className="workspace">
          <Status
            notice={notice}
            error={error}
            loading={loading}
            retry={load}
          />
          {renderView(view, {
            data,
            dashboard,
            query,
            user: session.user,
            setDrawer,
            refresh,
            fail: setError,
            setView,
            focusJob,
            setFocusJob,
          })}
        </section>
      </main>
      {drawer && (
        <RecordDrawer
          type={drawer}
          data={data}
          close={() => setDrawer(null)}
          done={refresh}
        />
      )}
    </div>
  );
}

function NotFound() {
  return (
    <main className="not-found">
      <img
        src="/decm-nexus-logo.png"
        alt="DECM Nexus Integrated Logistics and Consulting Ltd"
      />
      <p>404 · Page not found</p>
      <h1>This route is not on the delivery plan.</h1>
      <div>
        <a className="primary" href="/">
          Return to homepage
        </a>
        <a className="secondary" href="/app">
          Open client portal
        </a>
      </div>
    </main>
  );
}
