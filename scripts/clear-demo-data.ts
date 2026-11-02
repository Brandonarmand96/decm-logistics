import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dryRun = process.argv.includes("--dry-run");
const databasePath = path.resolve(process.env.DB_PATH || "data/decm.sqlite");
if (dryRun && !fs.existsSync(databasePath)) {
  console.table({ jobs: 0, requests: 0, procurement: 0, linkedDocuments: 0 });
  console.log("Dry run only. The database does not exist, so no data was changed.");
  process.exit(0);
}
const db = dryRun
  ? new Database(databasePath, { readonly: true, fileMustExist: true })
  : (await import("../server/db.js")).db;

const demoJobs = ["NX-24014", "NX-24015", "NX-24016", "NX-24017", "NX-24018"];
const demoRequests = ["SR-1040", "SR-1041", "SR-1042", "SR-1043", "SR-1044"];
const demoProcurement = ["PR-1046", "PR-1047", "PR-1048"];
const demoSuppliers = [
  ["Atlas Industrial Supply", "orders@atlas.example"],
  ["MedAxis Wholesale", "sales@medaxis.example"],
  ["Coastal Fleet Partners", "dispatch@coastal.example"],
  ["Prime Office Source", "hello@prime.example"],
];
const placeholders = (items: unknown[]) => items.map(() => "?").join(",");
const jobIds = (
  db
    .prepare(
      `SELECT id FROM jobs WHERE reference IN (${placeholders(demoJobs)})`,
    )
    .all(...demoJobs) as { id: number }[]
).map((row) => row.id);
const linkedDocuments = jobIds.length
  ? (db
      .prepare(
        `SELECT stored_name FROM documents WHERE entity_type='job' AND entity_id IN (${placeholders(jobIds)})`,
      )
      .all(...jobIds) as { stored_name: string }[])
  : [];
const count = (table: string, column: string, values: string[]) =>
  Number(
    (
      db
        .prepare(
          `SELECT COUNT(*) count FROM ${table} WHERE ${column} IN (${placeholders(values)})`,
        )
        .get(...values) as { count: number }
    ).count,
  );

console.table({
  jobs: jobIds.length,
  requests: count("service_requests", "reference", demoRequests),
  procurement: count("procurement_requests", "reference", demoProcurement),
  linkedDocuments: linkedDocuments.length,
});
if (dryRun) {
  console.log("Dry run only. No data was changed.");
  db.close();
  process.exit(0);
}

db.transaction(() => {
  if (jobIds.length) {
    const ids = placeholders(jobIds);
    db.prepare(
      `DELETE FROM documents WHERE entity_type='job' AND entity_id IN (${ids})`,
    ).run(...jobIds);
    db.prepare(`DELETE FROM expenses WHERE job_id IN (${ids})`).run(...jobIds);
    db.prepare(`DELETE FROM invoices WHERE job_id IN (${ids})`).run(...jobIds);
  }
  db.prepare(
    `DELETE FROM jobs WHERE reference IN (${placeholders(demoJobs)})`,
  ).run(...demoJobs);
  db.prepare(
    `DELETE FROM service_requests WHERE reference IN (${placeholders(demoRequests)})`,
  ).run(...demoRequests);
  db.prepare(
    `DELETE FROM procurement_requests WHERE reference IN (${placeholders(demoProcurement)})`,
  ).run(...demoProcurement);
  for (const [name, email] of demoSuppliers) {
    db.prepare(
      "DELETE FROM suppliers WHERE name=? AND email=? AND NOT EXISTS (SELECT 1 FROM bids WHERE bids.supplier_id=suppliers.id)",
    ).run(name, email);
  }
  db.prepare(
    "INSERT INTO app_meta (key,value) VALUES ('demo_seed_disabled','1') ON CONFLICT(key) DO UPDATE SET value='1'",
  ).run();
})();

for (const document of linkedDocuments) {
  const uploadPath = path.resolve("data/uploads", document.stored_name);
  if (fs.existsSync(uploadPath)) fs.unlinkSync(uploadPath);
}

console.log(
  "Packaged demonstration records were removed and reseeding was disabled.",
);
console.log(
  "The administrator account and unrelated business records were preserved.",
);
console.log(
  "Note: records attached to the demonstration jobs were removed with those jobs.",
);
db.close();
