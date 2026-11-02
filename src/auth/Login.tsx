import { FormEvent, useState } from "react";
import { AlertTriangle, LoaderCircle, ShieldCheck } from "lucide-react";
import { login } from "../api";

export function Login({ onLogin }: { onLogin: (s: any) => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    try {
      onLogin(await login(String(fd.get("email")), String(fd.get("password"))));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-page">
      <section className="login-sheet">
        <a className="login-back" href="/">
          Back to website
        </a>
        <div className="brand login-brand">
          <img
            src="/decm-nexus-logo.png"
            alt="DECM Nexus Integrated Logistics and Consulting Ltd"
          />
        </div>
        <h1>Accountable operations begin here.</h1>
        <p>
          Sign in to coordinate requests, jobs, procurement, partners, finance
          and reporting in one auditable workspace.
        </p>
        {error && (
          <div className="inline-error">
            <AlertTriangle />
            {error}
          </div>
        )}
        <form onSubmit={submit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              required
              placeholder="you@company.com"
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </label>
          <button className="primary" disabled={busy}>
            {busy ? <LoaderCircle className="spin" /> : <ShieldCheck />}
            {busy ? "Signing in…" : "Sign in securely"}
          </button>
        </form>
        <small>
          Authorized access only. Contact your administrator for help.
        </small>
      </section>
      <aside className="login-context">
        <h2>From Strategy to Delivery.</h2>
        <dl>
          <div>
            <dt>One record</dt>
            <dd>
              Every request, decision, movement and document stays connected.
            </dd>
          </div>
          <div>
            <dt>Clear ownership</dt>
            <dd>Promised dates, next actions and exceptions remain visible.</dd>
          </div>
          <div>
            <dt>Commercial control</dt>
            <dd>Revenue, direct cost and contribution sit beside the work.</dd>
          </div>
        </dl>
      </aside>
    </main>
  );
}
