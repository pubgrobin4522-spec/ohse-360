import { u as useBackend, r as reactExports, f as useQuery, j as jsxRuntimeExports, B as Button, I as Input, G as AuditAction, e as Role, k as ROLE_LABELS, S as ScrollArea } from "./index-o5KNRZJC.js";
import { B as Badge } from "./badge-drMlJ0Eb.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DLpeTQN2.js";
import { S as Skeleton } from "./skeleton-FWJuhcbn.js";
import { S as ShieldCheck } from "./shield-check-ayivU1Ib.js";
import { D as Download } from "./download-ClH3W2L_.js";
import { F as Funnel } from "./funnel-zCB_4DbY.js";
import { S as Search } from "./search-naONrdle.js";
import { f as format } from "./format-Bkzw-s0a.js";
import "./index-BgKcp2pS.js";
const ACTION_COLORS = {
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
  PasswordReset: "bg-violet-950 text-violet-400 border-violet-800"
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
  "Notification"
];
const ACTIONS = [
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
  AuditAction.PasswordReset
];
const ROLES = [
  "All",
  Role.SystemAdmin,
  Role.Employee,
  Role.SafetyOfficer,
  Role.HOD,
  Role.AreaInCharge,
  Role.ContractorAdmin
];
const PAGE_SIZE = 30;
function formatTs(ts) {
  try {
    return format(new Date(Number(ts / 1000000n)), "dd MMM yyyy HH:mm:ss");
  } catch {
    return "—";
  }
}
function entriesToCsv(entries) {
  const header = [
    "Timestamp",
    "User ID",
    "User Name",
    "Role",
    "Module",
    "Action",
    "Record Ref",
    "Detail"
  ];
  const rows = entries.map((e) => [
    formatTs(e.timestamp),
    String(e.actorId),
    e.actorName,
    ROLE_LABELS[e.actorRole] ?? e.actorRole,
    e.module,
    e.action,
    e.recordRef,
    `"${e.detail.replace(/"/g, "'")}"`
  ]);
  return [header, ...rows].map((r) => r.join(",")).join("\n");
}
function AuditPage() {
  const { actor, token, isReady } = useBackend();
  const [search, setSearch] = reactExports.useState("");
  const [filterModule, setFilterModule] = reactExports.useState("All");
  const [filterAction, setFilterAction] = reactExports.useState("All");
  const [filterRole, setFilterRole] = reactExports.useState("All");
  const [fromDate, setFromDate] = reactExports.useState("");
  const [toDate, setToDate] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(1);
  const fromTs = fromDate ? BigInt(new Date(fromDate).getTime()) * 1000000n : null;
  const toTs = toDate ? BigInt((/* @__PURE__ */ new Date(`${toDate}T23:59:59`)).getTime()) * 1000000n : null;
  const { data: rawEntries = [], isLoading } = useQuery({
    queryKey: ["audit", filterModule, fromDate, toDate],
    queryFn: async () => {
      if (!actor || !token) return [];
      const mod = filterModule === "All" ? null : filterModule;
      const res = await actor.listAuditEntries(token, mod, fromTs, toTs);
      return res.__kind__ === "ok" ? res.ok : [];
    },
    enabled: isReady
  });
  const filtered = reactExports.useMemo(() => {
    let list = rawEntries;
    if (filterAction !== "All")
      list = list.filter((e) => e.action === filterAction);
    if (filterRole !== "All")
      list = list.filter((e) => e.actorRole === filterRole);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) => e.recordRef.toLowerCase().includes(q) || e.actorName.toLowerCase().includes(q) || String(e.actorId).includes(q) || e.detail.toLowerCase().includes(q)
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
    a.download = `audit-trail-${format(/* @__PURE__ */ new Date(), "yyyyMMdd-HHmmss")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function resetPage() {
    setPage(1);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "audit.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Audit Trail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Immutable record of all system actions — ",
            filtered.length,
            " entries"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: downloadCsv,
          className: "gap-2 border-border text-muted-foreground hover:text-foreground",
          "data-ocid": "audit.export_button",
          disabled: filtered.length === 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
            "Export CSV"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "elevated-card rounded-lg p-4 space-y-3",
        "data-ocid": "audit.filter.panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5" }),
            "Filters"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative xl:col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Search record ref, user, detail…",
                  value: search,
                  onChange: (e) => {
                    setSearch(e.target.value);
                    resetPage();
                  },
                  className: "pl-8 bg-background border-border text-sm",
                  "data-ocid": "audit.search_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filterModule,
                onValueChange: (v) => {
                  setFilterModule(v);
                  resetPage();
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "bg-background border-border text-sm",
                      "data-ocid": "audit.filter.module.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Module" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: MODULES.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filterAction,
                onValueChange: (v) => {
                  setFilterAction(v);
                  resetPage();
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "bg-background border-border text-sm",
                      "data-ocid": "audit.filter.action.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Action" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: ACTIONS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: a, children: a === "All" ? "All Actions" : a }, a)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filterRole,
                onValueChange: (v) => {
                  setFilterRole(v);
                  resetPage();
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "bg-background border-border text-sm",
                      "data-ocid": "audit.filter.role.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Role" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r === "All" ? "All Roles" : ROLE_LABELS[r] ?? r }, r)) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 xl:col-span-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: fromDate,
                  onChange: (e) => {
                    setFromDate(e.target.value);
                    resetPage();
                  },
                  className: "bg-background border-border text-sm",
                  "data-ocid": "audit.filter.from_date",
                  title: "From date"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: toDate,
                  onChange: (e) => {
                    setToDate(e.target.value);
                    resetPage();
                  },
                  className: "bg-background border-border text-sm",
                  "data-ocid": "audit.filter.to_date",
                  title: "To date"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-lg overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/30 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap", children: "Timestamp" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap", children: "User ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap", children: "User Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap", children: "Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap", children: "Module" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap", children: "Action" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap", children: "Record Ref" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[200px]", children: "Detail" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: isLoading ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: Array.from({ length: 8 }).map((_2, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full rounded" }) }, j)) }, i)) : pageEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "td",
          {
            colSpan: 8,
            className: "px-4 py-16 text-center",
            "data-ocid": "audit.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-10 h-10 text-muted-foreground/30 mx-auto mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No audit entries match your filters." })
            ]
          }
        ) }) : pageEntries.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "hover:bg-muted/20 transition-colors",
            "data-ocid": `audit.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground font-mono whitespace-nowrap", children: formatTs(entry.timestamp) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-foreground whitespace-nowrap", children: String(entry.actorId) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-sm text-foreground whitespace-nowrap", children: entry.actorName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: ROLE_LABELS[entry.actorRole] ?? entry.actorRole }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground", children: entry.module }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs border ${ACTION_COLORS[entry.action] ?? "bg-muted text-muted-foreground border-border"}`,
                  children: entry.action
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs font-mono text-primary whitespace-nowrap", children: entry.recordRef || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground max-w-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2", title: entry.detail, children: entry.detail || "—" }) })
            ]
          },
          String(entry.id)
        )) })
      ] }) }),
      !isLoading && filtered.length > PAGE_SIZE && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Showing ",
          (page - 1) * PAGE_SIZE + 1,
          "–",
          Math.min(page * PAGE_SIZE, filtered.length),
          " of ",
          filtered.length,
          " ",
          "entries"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setPage((p) => Math.max(1, p - 1)),
              disabled: page === 1,
              className: "h-7 text-xs border-border",
              "data-ocid": "audit.pagination_prev",
              children: "Previous"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground px-2", children: [
            "Page ",
            page,
            " of ",
            totalPages
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
              disabled: page === totalPages,
              className: "h-7 text-xs border-border",
              "data-ocid": "audit.pagination_next",
              children: "Next"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  AuditPage,
  AuditPage as default
};
