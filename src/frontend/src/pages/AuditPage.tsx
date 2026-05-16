import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download, Filter, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { AuditEntry } from "../backend";
import { AuditAction, Role } from "../backend";
import { useBackend } from "../hooks/useBackend";
import { ROLE_LABELS } from "../types";

const ACTION_COLORS: Record<AuditAction, string> = {
  Login: "bg-primary/10 text-primary border-primary/20",
  Logout: "bg-muted/60 text-muted-foreground border-border",
  Created: "bg-emerald-950 text-emerald-400 border-emerald-800",
  Updated: "bg-blue-950 text-blue-400 border-blue-800",
  Approved: "bg-green-950 text-green-400 border-green-800",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Closed: "bg-secondary/10 text-secondary border-secondary/20",
  Deactivated: "bg-orange-950 text-orange-400 border-orange-800",
  Reactivated: "bg-teal-950 text-teal-400 border-teal-800",
  PasswordChanged: "bg-indigo-950 text-indigo-400 border-indigo-800",
  PasswordReset: "bg-violet-950 text-violet-400 border-violet-800",
};

const MODULES = [
  "All",
  "Auth",
  "User",
  "Employee",
  "Incident",
  "Training",
  "PTW",
  "CAPA",
  "Notification",
];
const ACTIONS: Array<AuditAction | "All"> = [
  "All",
  AuditAction.Login,
  AuditAction.Logout,
  AuditAction.Created,
  AuditAction.Updated,
  AuditAction.Approved,
  AuditAction.Rejected,
  AuditAction.Closed,
  AuditAction.Deactivated,
  AuditAction.Reactivated,
  AuditAction.PasswordChanged,
  AuditAction.PasswordReset,
];
const ROLES: Array<Role | "All"> = [
  "All",
  Role.SystemAdmin,
  Role.Employee,
  Role.SafetyOfficer,
  Role.HOD,
  Role.AreaInCharge,
  Role.ContractorAdmin,
];

const PAGE_SIZE = 30;

function formatTs(ts: bigint): string {
  try {
    return format(new Date(Number(ts / 1_000_000n)), "dd MMM yyyy HH:mm:ss");
  } catch {
    return "—";
  }
}

function entriesToCsv(entries: AuditEntry[]): string {
  const header = [
    "Timestamp",
    "User ID",
    "User Name",
    "Role",
    "Module",
    "Action",
    "Record Ref",
    "Detail",
  ];
  const rows = entries.map((e) => [
    formatTs(e.timestamp),
    String(e.actorId),
    e.actorName,
    ROLE_LABELS[e.actorRole] ?? e.actorRole,
    e.module,
    e.action,
    e.recordRef,
    `"${e.detail.replace(/"/g, "'")}"`,
  ]);
  return [header, ...rows].map((r) => r.join(",")).join("\n");
}

export default function AuditPage() {
  const { actor, token, isReady } = useBackend();

  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("All");
  const [filterAction, setFilterAction] = useState<AuditAction | "All">("All");
  const [filterRole, setFilterRole] = useState<Role | "All">("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const fromTs = fromDate
    ? BigInt(new Date(fromDate).getTime()) * 1_000_000n
    : null;
  const toTs = toDate
    ? BigInt(new Date(`${toDate}T23:59:59`).getTime()) * 1_000_000n
    : null;

  const { data: rawEntries = [], isLoading } = useQuery<AuditEntry[]>({
    queryKey: ["audit", filterModule, fromDate, toDate],
    queryFn: async () => {
      if (!actor || !token) return [];
      const mod = filterModule === "All" ? null : filterModule;
      const res = await actor.listAuditEntries(token, mod, fromTs, toTs);
      return res.__kind__ === "ok" ? res.ok : [];
    },
    enabled: isReady,
  });

  const filtered = useMemo(() => {
    let list = rawEntries;
    if (filterAction !== "All")
      list = list.filter((e) => e.action === filterAction);
    if (filterRole !== "All")
      list = list.filter((e) => e.actorRole === filterRole);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.recordRef.toLowerCase().includes(q) ||
          e.actorName.toLowerCase().includes(q) ||
          String(e.actorId).includes(q) ||
          e.detail.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [rawEntries, filterAction, filterRole, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageEntries = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function downloadCsv() {
    const csv = entriesToCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-trail-${format(new Date(), "yyyyMMdd-HHmmss")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function resetPage() {
    setPage(1);
  }

  return (
    <div className="space-y-6" data-ocid="audit.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Audit Trail</h1>
            <p className="text-sm text-muted-foreground">
              Immutable record of all system actions — {filtered.length} entries
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadCsv}
          className="gap-2 border-border text-muted-foreground hover:text-foreground"
          data-ocid="audit.export_button"
          disabled={filtered.length === 0}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div
        className="elevated-card rounded-lg p-4 space-y-3"
        data-ocid="audit.filter.panel"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="relative xl:col-span-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search record ref, user, detail…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              className="pl-8 bg-background border-border text-sm"
              data-ocid="audit.search_input"
            />
          </div>
          <Select
            value={filterModule}
            onValueChange={(v) => {
              setFilterModule(v);
              resetPage();
            }}
          >
            <SelectTrigger
              className="bg-background border-border text-sm"
              data-ocid="audit.filter.module.select"
            >
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {MODULES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterAction}
            onValueChange={(v) => {
              setFilterAction(v as AuditAction | "All");
              resetPage();
            }}
          >
            <SelectTrigger
              className="bg-background border-border text-sm"
              data-ocid="audit.filter.action.select"
            >
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {ACTIONS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a === "All" ? "All Actions" : a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterRole}
            onValueChange={(v) => {
              setFilterRole(v as Role | "All");
              resetPage();
            }}
          >
            <SelectTrigger
              className="bg-background border-border text-sm"
              data-ocid="audit.filter.role.select"
            >
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r === "All" ? "All Roles" : (ROLE_LABELS[r as Role] ?? r)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2 xl:col-span-1">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                resetPage();
              }}
              className="bg-background border-border text-sm"
              data-ocid="audit.filter.from_date"
              title="From date"
            />
            <Input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                resetPage();
              }}
              className="bg-background border-border text-sm"
              data-ocid="audit.filter.to_date"
              title="To date"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="elevated-card rounded-lg overflow-hidden">
        <ScrollArea className="w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Timestamp
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  User ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  User Name
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Module
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  Record Ref
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[200px]">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageEntries.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center"
                    data-ocid="audit.empty_state"
                  >
                    <ShieldCheck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No audit entries match your filters.
                    </p>
                  </td>
                </tr>
              ) : (
                pageEntries.map((entry, idx) => (
                  <tr
                    key={String(entry.id)}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`audit.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap">
                      {formatTs(entry.timestamp)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-foreground whitespace-nowrap">
                      {String(entry.actorId)}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      {entry.actorName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-muted-foreground">
                        {ROLE_LABELS[entry.actorRole] ?? entry.actorRole}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground">
                        {entry.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${ACTION_COLORS[entry.action] ?? "bg-muted text-muted-foreground border-border"}`}
                      >
                        {entry.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-primary whitespace-nowrap">
                      {entry.recordRef || "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs">
                      <span className="line-clamp-2" title={entry.detail}>
                        {entry.detail || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ScrollArea>

        {/* Pagination */}
        {!isLoading && filtered.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
              entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-7 text-xs border-border"
                data-ocid="audit.pagination_prev"
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground px-2">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-7 text-xs border-border"
                data-ocid="audit.pagination_next"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { AuditPage };
