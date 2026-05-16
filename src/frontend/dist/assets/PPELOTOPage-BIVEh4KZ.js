import { a as createLucideIcon, d as useAuth, r as reactExports, j as jsxRuntimeExports, D as Shield, L as Lock, u as useBackend, f as useQuery, h as useQueryClient, i as useMutation, n as ue, B as Button, m as Label, I as Input, T as TriangleAlert, ao as PPEConditionIssue, ap as PPEInspectionCondition, aq as LockEntryStatus, ar as EnergySourceLOTO } from "./index-o5KNRZJC.js";
import { B as Badge } from "./badge-drMlJ0Eb.js";
import { H as HardHat, C as Checkbox } from "./checkbox-Dpb-gNfA.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BC0tVdjJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DLpeTQN2.js";
import { S as Skeleton } from "./skeleton-FWJuhcbn.js";
import { T as Textarea } from "./textarea-DwLBGk5G.js";
import { S as ShieldCheck } from "./shield-check-ayivU1Ib.js";
import { S as ShieldAlert } from "./shield-alert-C2RCAJyr.js";
import { P as Plus } from "./x-CXE19MnU.js";
import { Z as Zap } from "./zap-BiKxaMoq.js";
import { T as Trash2 } from "./trash-2-CXXHifdk.js";
import "./index-BgKcp2pS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["path", { d: "M10 17h.01", key: "nbq80n" }],
  ["path", { d: "M10 7v6", key: "nne03l" }],
  ["path", { d: "M14 7h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2", key: "1x5o8m" }],
  ["path", { d: "M22 11v2", key: "1wo06k" }],
  ["path", { d: "M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2", key: "1mdjgh" }]
];
const BatteryWarning = createLucideIcon("battery-warning", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "m3 17 2 2 4-4", key: "1jhpwq" }],
  ["path", { d: "m3 7 2 2 4-4", key: "1obspn" }],
  ["path", { d: "M13 6h8", key: "15sg57" }],
  ["path", { d: "M13 12h8", key: "h98zly" }],
  ["path", { d: "M13 18h8", key: "oe0vm4" }]
];
const ListChecks = createLucideIcon("list-checks", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
];
const LockOpen = createLucideIcon("lock-open", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m16 16 2 2 4-4", key: "gfu2re" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
      key: "e7tb2h"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12", key: "a4e8g8" }]
];
const PackageCheck = createLucideIcon("package-check", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
];
const Package = createLucideIcon("package", __iconNode);
function ts(n) {
  if (!n) return "—";
  return new Date(Number(n) / 1e6).toLocaleString();
}
function canManage(role) {
  return ["SystemAdmin", "SafetyOfficer"].includes(role);
}
function LotoBadge({ status }) {
  const map = {
    Draft: "bg-muted/50 text-muted-foreground border-border",
    Active: "bg-destructive/20 text-destructive border-destructive/40",
    Completed: "bg-primary/20 text-primary border-primary/40",
    Cancelled: "bg-muted/40 text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status]}`,
      children: [
        status === "Active" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" }),
        status
      ]
    }
  );
}
function PpeStatsBar() {
  const { actor, token } = useBackend();
  const { data } = useQuery({
    queryKey: ["ppeStats"],
    queryFn: async () => {
      const r = await actor.getPpeStats(token);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const stats = [
    {
      label: "PPE Compliance",
      value: data ? `${data.complianceRate}%` : "—",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4" }),
      color: "text-primary"
    },
    {
      label: "Total Items",
      value: data ? String(data.totalItems) : "—",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4" }),
      color: "text-foreground"
    },
    {
      label: "Low Stock",
      value: data ? String(data.issuanceCount) : "—",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
      color: "text-secondary"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mb-5", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card/60 backdrop-blur border border-border/50 rounded-xl p-4 flex items-center gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: s.color, children: s.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-bold ${s.color}`, children: s.value })
        ] })
      ]
    },
    s.label
  )) });
}
function LotoStatsBar() {
  const { actor, token } = useBackend();
  const { data } = useQuery({
    queryKey: ["lotoStats"],
    queryFn: async () => {
      const r = await actor.getLotoStats(token);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const stats = [
    {
      label: "Active LOTOs",
      value: data ? String(data.active) : "—",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
      color: data && data.active > 0n ? "text-destructive" : "text-foreground"
    },
    {
      label: "Completed This Month",
      value: data ? String(data.completedThisMonth) : "—",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4" }),
      color: "text-primary"
    },
    {
      label: "Overdue",
      value: data ? String(data.overdue) : "—",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4" }),
      color: data && data.overdue > 0n ? "text-destructive" : "text-muted-foreground"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mb-5", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-card/60 backdrop-blur border border-border/50 rounded-xl p-4 flex items-center gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: s.color, children: s.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xl font-bold ${s.color}`, children: s.value })
        ] })
      ]
    },
    s.label
  )) });
}
function PpeItemMaster({ canEdit }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    itemName: "",
    itemType: "",
    size: "",
    standard: "",
    shelfLifeMonths: ""
  });
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["ppeItems"],
    queryFn: async () => {
      const r = await actor.listPpeItems(token);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const addMut = useMutation({
    mutationFn: async () => {
      const r = await actor.createPpeItem(token, {
        itemName: form.itemName,
        itemType: form.itemType,
        size: form.size,
        standard: form.standard,
        shelfLifeMonths: BigInt(form.shelfLifeMonths || "0")
      });
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ppeItems"] });
      qc.invalidateQueries({ queryKey: ["ppeStats"] });
      ue.success("PPE item added");
      setOpen(false);
      setForm({
        itemName: "",
        itemType: "",
        size: "",
        standard: "",
        shelfLifeMonths: ""
      });
    },
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "sm",
        onClick: () => setOpen(true),
        "data-ocid": "ppe.item_master.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
          " Add PPE Item"
        ]
      }
    ) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10" }, i)) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 text-muted-foreground",
        "data-ocid": "ppe.item_master.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }),
          "No PPE items in master. Add one to get started."
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-left text-muted-foreground", children: [
        "Item ID",
        "Name",
        "Type",
        "Size",
        "Standard",
        "Shelf Life (mo)"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-t border-border/30 hover:bg-card/40",
          "data-ocid": `ppe.item_master.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: item.itemId.slice(0, 8) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: item.itemName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.itemType }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.size }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: item.standard }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: String(item.shelfLifeMonths) })
          ]
        },
        item.itemId
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-md",
        "data-ocid": "ppe.add_item.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add PPE Item" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 py-2", children: [
            ["itemName", "itemType", "size", "standard"].map(
              (f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "capitalize mb-1 block", children: f.replace(/([A-Z])/g, " $1") }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form[f],
                    onChange: (e) => setForm((p) => ({ ...p, [f]: e.target.value })),
                    "data-ocid": `ppe.add_item.${f}_input`
                  }
                )
              ] }, f)
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Shelf Life (months)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  value: form.shelfLifeMonths,
                  onChange: (e) => setForm((p) => ({ ...p, shelfLifeMonths: e.target.value })),
                  "data-ocid": "ppe.add_item.shelf_life_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => addMut.mutate(),
                disabled: addMut.isPending || !form.itemName,
                "data-ocid": "ppe.add_item.submit_button",
                children: addMut.isPending ? "Saving..." : "Add Item"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function PpeInventory({ canEdit }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [editId, setEditId] = reactExports.useState(null);
  const [qty, setQty] = reactExports.useState("");
  const [minLevel, setMinLevel] = reactExports.useState("");
  const { data: inv = [], isLoading } = useQuery({
    queryKey: ["ppeInventory"],
    queryFn: async () => {
      const r = await actor.listPpeInventory(token);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const { data: items = [] } = useQuery({
    queryKey: ["ppeItems"],
    queryFn: async () => {
      const r = await actor.listPpeItems(token);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const itemMap = Object.fromEntries(items.map((i) => [i.itemId, i]));
  const updateMut = useMutation({
    mutationFn: async () => {
      const r = await actor.updatePpeInventory(
        token,
        editId,
        BigInt(qty || "0"),
        BigInt(minLevel || "0")
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ppeInventory"] });
      qc.invalidateQueries({ queryKey: ["ppeStats"] });
      ue.success("Inventory updated");
      setEditId(null);
    },
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10" }, i)) }) : inv.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 text-muted-foreground",
        "data-ocid": "ppe.inventory.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PackageCheck, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }),
          "No inventory records yet."
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-left text-muted-foreground", children: [
        "Item Name",
        "In Stock",
        "Min Level",
        "Status",
        "Last Updated",
        ""
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: inv.map((row, i) => {
        const item = itemMap[row.itemId];
        const isLow = row.quantityInStock <= row.minStockLevel;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-t border-border/30 hover:bg-card/40",
            "data-ocid": `ppe.inventory.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: (item == null ? void 0 : item.itemName) ?? row.itemId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: String(row.quantityInStock) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: String(row.minStockLevel) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: isLow ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-destructive/20 text-destructive border-destructive/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
                " Low Stock"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-primary/20 text-primary border-primary/40", children: "OK" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: ts(row.lastUpdated) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => {
                    setEditId(row.itemId);
                    setQty(String(row.quantityInStock));
                    setMinLevel(String(row.minStockLevel));
                  },
                  "data-ocid": `ppe.inventory.edit_button.${i + 1}`,
                  children: "Edit"
                }
              ) })
            ]
          },
          row.itemId
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!editId, onOpenChange: (o) => !o && setEditId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-sm",
        "data-ocid": "ppe.update_inventory.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Update Inventory" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Quantity Delta (+ add, – remove)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: qty,
                  onChange: (e) => setQty(e.target.value),
                  "data-ocid": "ppe.update_inventory.qty_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Min Stock Level" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: minLevel,
                  onChange: (e) => setMinLevel(e.target.value),
                  "data-ocid": "ppe.update_inventory.min_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => updateMut.mutate(),
                disabled: updateMut.isPending,
                "data-ocid": "ppe.update_inventory.submit_button",
                children: updateMut.isPending ? "Saving..." : "Update"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function PpeIssuances({ canEdit }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const [filterEmp, setFilterEmp] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    employeeId: "",
    itemId: "",
    size: "",
    quantity: "1",
    condition: PPEConditionIssue.New
  });
  const { data: issuances = [], isLoading } = useQuery({
    queryKey: ["ppeIssuances"],
    queryFn: async () => {
      const r = await actor.listPpeIssuances(token, null);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const { data: items = [] } = useQuery({
    queryKey: ["ppeItems"],
    queryFn: async () => {
      const r = await actor.listPpeItems(token);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const itemMap = Object.fromEntries(items.map((i) => [i.itemId, i]));
  const filtered = filterEmp ? issuances.filter((i) => String(i.employeeId).includes(filterEmp)) : issuances;
  const issueMut = useMutation({
    mutationFn: async () => {
      const r = await actor.issuePpe(
        token,
        BigInt(form.employeeId),
        form.itemId,
        form.size,
        BigInt(form.quantity),
        form.condition
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ppeIssuances"] });
      ue.success("PPE issued");
      setOpen(false);
      setForm({
        employeeId: "",
        itemId: "",
        size: "",
        quantity: "1",
        condition: PPEConditionIssue.New
      });
    },
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Filter by Employee ID",
          value: filterEmp,
          onChange: (e) => setFilterEmp(e.target.value),
          className: "max-w-xs",
          "data-ocid": "ppe.issuances.search_input"
        }
      ),
      canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setOpen(true),
          className: "ml-auto",
          "data-ocid": "ppe.issuances.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
            " Issue PPE"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 text-muted-foreground",
        "data-ocid": "ppe.issuances.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }),
          "No issuances found."
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-left text-muted-foreground", children: [
        "Issuance ID",
        "Employee ID",
        "Item",
        "Size",
        "Qty",
        "Issue Date",
        "Condition"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((row, i) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-t border-border/30 hover:bg-card/40",
            "data-ocid": `ppe.issuances.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs", children: row.issuanceId.slice(0, 8) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: String(row.employeeId) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: ((_a = itemMap[row.itemId]) == null ? void 0 : _a.itemName) ?? row.itemId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: row.size }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: String(row.quantity) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: row.issueDate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${row.condition === "New" ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary/20 text-secondary border-secondary/40"}`,
                  children: row.condition
                }
              ) })
            ]
          },
          row.issuanceId
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-md",
        "data-ocid": "ppe.issue_ppe.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Issue PPE" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Employee ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: form.employeeId,
                  onChange: (e) => setForm((p) => ({ ...p, employeeId: e.target.value })),
                  "data-ocid": "ppe.issue_ppe.employee_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "PPE Item" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.itemId,
                  onValueChange: (v) => setForm((p) => ({ ...p, itemId: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "ppe.issue_ppe.item_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select item" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: it.itemId, children: [
                      it.itemName,
                      " (",
                      it.itemType,
                      ")"
                    ] }, it.itemId)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Size" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.size,
                    onChange: (e) => setForm((p) => ({ ...p, size: e.target.value })),
                    "data-ocid": "ppe.issue_ppe.size_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Quantity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: "1",
                    value: form.quantity,
                    onChange: (e) => setForm((p) => ({ ...p, quantity: e.target.value })),
                    "data-ocid": "ppe.issue_ppe.qty_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Condition" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.condition,
                  onValueChange: (v) => setForm((p) => ({ ...p, condition: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "ppe.issue_ppe.condition_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "New", children: "New" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Reissued", children: "Reissued" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => issueMut.mutate(),
                disabled: issueMut.isPending || !form.employeeId || !form.itemId,
                "data-ocid": "ppe.issue_ppe.submit_button",
                children: issueMut.isPending ? "Issuing..." : "Issue PPE"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
function PpeInspections({ canEdit }) {
  const { actor, token } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = reactExports.useState(false);
  const inspectionsRef = reactExports.useRef([]);
  const [, forceUpdate] = reactExports.useState(0);
  const inspections = inspectionsRef.current;
  const [form, setForm] = reactExports.useState({
    itemId: "",
    condition: PPEInspectionCondition.Good,
    remarks: "",
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  });
  const { data: items = [] } = useQuery({
    queryKey: ["ppeItems"],
    queryFn: async () => {
      const r = await actor.listPpeItems(token);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const itemMap = Object.fromEntries(items.map((i) => [i.itemId, i]));
  const recordMut = useMutation({
    mutationFn: async () => {
      const r = await actor.recordPpeInspection(
        token,
        form.itemId,
        form.condition,
        form.remarks,
        form.date
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (id) => {
      inspectionsRef.current = [
        ...inspectionsRef.current,
        {
          id: id ?? "—",
          itemId: form.itemId,
          inspector: (user == null ? void 0 : user.name) ?? "—",
          inspectionDate: form.date,
          condition: form.condition,
          remarks: form.remarks
        }
      ];
      forceUpdate((n) => n + 1);
      qc.invalidateQueries({ queryKey: ["ppeStats"] });
      ue.success("Inspection recorded");
      setOpen(false);
      setForm({
        itemId: "",
        condition: PPEInspectionCondition.Good,
        remarks: "",
        date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
      });
    },
    onError: (e) => ue.error(e.message)
  });
  const conditionColor = (c) => ({
    Good: "bg-primary/20 text-primary border-primary/40",
    Damaged: "bg-secondary/20 text-secondary border-secondary/40",
    Replace: "bg-destructive/20 text-destructive border-destructive/40"
  })[c];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "sm",
        onClick: () => setOpen(true),
        "data-ocid": "ppe.inspections.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
          " Record Inspection"
        ]
      }
    ) }),
    inspections.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-10 text-muted-foreground",
        "data-ocid": "ppe.inspections.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "w-8 h-8 mx-auto mb-2 opacity-40" }),
          "No inspections recorded yet."
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-left text-muted-foreground", children: [
        "ID",
        "Item",
        "Inspector",
        "Date",
        "Condition",
        "Remarks"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: inspections.map((row, i) => {
        var _a;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-t border-border/30 hover:bg-card/40",
            "data-ocid": `ppe.inspections.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs", children: row.id.slice(0, 8) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: ((_a = itemMap[row.itemId]) == null ? void 0 : _a.itemName) ?? row.itemId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: row.inspector }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: row.inspectionDate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${conditionColor(row.condition)}`,
                  children: row.condition
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: row.remarks })
            ]
          },
          row.id
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-md",
        "data-ocid": "ppe.record_inspection.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Record PPE Inspection" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "PPE Item" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.itemId,
                  onValueChange: (v) => setForm((p) => ({ ...p, itemId: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "ppe.record_inspection.item_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select item" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: it.itemId, children: it.itemName }, it.itemId)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Condition" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.condition,
                  onValueChange: (v) => setForm((p) => ({
                    ...p,
                    condition: v
                  })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "ppe.record_inspection.condition_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Good", children: "Good" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Damaged", children: "Damaged" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Replace", children: "Replace" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Inspection Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: form.date,
                  onChange: (e) => setForm((p) => ({ ...p, date: e.target.value })),
                  "data-ocid": "ppe.record_inspection.date_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Remarks" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: form.remarks,
                  onChange: (e) => setForm((p) => ({ ...p, remarks: e.target.value })),
                  "data-ocid": "ppe.record_inspection.remarks_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => recordMut.mutate(),
                disabled: recordMut.isPending || !form.itemId,
                "data-ocid": "ppe.record_inspection.submit_button",
                children: recordMut.isPending ? "Saving..." : "Record Inspection"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
const ENERGY_SOURCE_LABELS = {
  Electrical: "Electrical",
  Pneumatic: "Pneumatic",
  Hydraulic: "Hydraulic",
  Mechanical: "Mechanical",
  Thermal: "Thermal",
  Chemical: "Chemical",
  Gravitational: "Gravitational"
};
function LotoDetail({
  loto,
  onBack,
  canEdit
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [cancelOpen, setCancelOpen] = reactExports.useState(false);
  const [cancelReason, setCancelReason] = reactExports.useState("");
  const activateMut = useMutation({
    mutationFn: async () => {
      const r = await actor.activateLoto(token, loto.lotoNumber);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      qc.invalidateQueries({ queryKey: ["lotoStats"] });
      ue.success("LOTO activated");
    },
    onError: (e) => ue.error(e.message)
  });
  const completeMut = useMutation({
    mutationFn: async () => {
      const r = await actor.completeLoto(token, loto.lotoNumber);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      qc.invalidateQueries({ queryKey: ["lotoStats"] });
      ue.success("LOTO completed");
    },
    onError: (e) => ue.error(e.message)
  });
  const cancelMut = useMutation({
    mutationFn: async () => {
      const r = await actor.cancelLoto(token, loto.lotoNumber, cancelReason);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      qc.invalidateQueries({ queryKey: ["lotoStats"] });
      ue.success("LOTO cancelled");
      setCancelOpen(false);
    },
    onError: (e) => ue.error(e.message)
  });
  const lockMut = useMutation({
    mutationFn: async ({
      lockNumber,
      newStatus
    }) => {
      const r = await actor.updateLockStatus(
        token,
        loto.lotoNumber,
        lockNumber,
        newStatus
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      ue.success("Lock status updated");
    },
    onError: (e) => ue.error(e.message)
  });
  const allLocksRemoved = loto.lockRegister.length > 0 && loto.lockRegister.every((l) => l.status === "Removed");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onBack,
          "data-ocid": "loto.detail.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4 mr-1" }),
            " Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold", children: loto.lotoNumber }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          loto.equipmentName,
          " — Tag: ",
          loto.tagNumber
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LotoBadge, { status: loto.status })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: [
      { label: "Work Description", value: loto.workDescription },
      { label: "Start", value: ts(loto.startDateTime) },
      {
        label: "End",
        value: loto.endDateTime ? ts(loto.endDateTime) : "—"
      },
      { label: "Created By", value: String(loto.createdBy) },
      {
        label: "Authorized By",
        value: loto.authorizedByEmpId ? String(loto.authorizedByEmpId) : "—"
      },
      {
        label: "Authorized At",
        value: loto.authorizedAt ? ts(loto.authorizedAt) : "—"
      }
    ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/40 rounded-lg p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium break-words", children: value })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/40 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-2", children: "Energy Sources" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        loto.energySources.map((src) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "border-secondary/40 text-secondary",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 mr-1" }),
              ENERGY_SOURCE_LABELS[src]
            ]
          },
          src
        )),
        loto.energySources.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "None specified" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/40 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Isolation Points" }),
      loto.isolationPoints.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No isolation points added yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: loto.isolationPoints.map((pt, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between bg-background/40 rounded-lg px-3 py-2",
          "data-ocid": `loto.isolation.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: pt.location }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Lock: ",
                pt.lockNumber
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${pt.status === "Applied" ? "bg-destructive/20 text-destructive border-destructive/40" : "bg-primary/20 text-primary border-primary/40"}`,
                children: pt.status
              }
            )
          ]
        },
        pt.pointId
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/40 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Lock Register" }),
      loto.lockRegister.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No locks registered." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: loto.lockRegister.map((lk, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between bg-background/40 rounded-lg px-3 py-2",
          "data-ocid": `loto.lock.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              lk.status === "Applied" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "w-4 h-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
                  "Lock #",
                  lk.lockNumber
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "Assigned: Emp ",
                  String(lk.assignedEmpId)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${lk.status === "Applied" ? "bg-destructive/20 text-destructive border-destructive/40" : "bg-primary/20 text-primary border-primary/40"}`,
                  children: lk.status
                }
              ),
              canEdit && loto.status === "Active" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => lockMut.mutate({
                    lockNumber: lk.lockNumber,
                    newStatus: lk.status === "Applied" ? LockEntryStatus.Removed : LockEntryStatus.Applied
                  }),
                  disabled: lockMut.isPending,
                  "data-ocid": `loto.lock.toggle_button.${i + 1}`,
                  children: lk.status === "Applied" ? "Remove" : "Apply"
                }
              )
            ] })
          ]
        },
        lk.lockNumber
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/40 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-2", children: "Authorized Employees" }),
      loto.authorizedEmpIds.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No authorized employees listed." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: loto.authorizedEmpIds.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: String(id) }, String(id))) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/40 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold mb-3", children: "Procedure Steps" }),
      loto.procedureSteps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No procedure steps added." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-1 list-decimal list-inside", children: loto.procedureSteps.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-sm text-foreground py-1", children: step }, i)) })
    ] }),
    (loto.status === "Active" || loto.status === "Completed") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/40 rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BatteryWarning, { className: "w-4 h-4 text-secondary" }),
        "Re-energization Checklist"
      ] }),
      loto.reEnergizationChecklist.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No re-energization steps defined." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-1 list-decimal list-inside", children: loto.reEnergizationChecklist.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-sm py-1", children: step }, i)) })
    ] }),
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 pt-2", children: [
      loto.status === "Draft" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => activateMut.mutate(),
          disabled: activateMut.isPending,
          className: "bg-destructive/80 hover:bg-destructive text-destructive-foreground",
          "data-ocid": "loto.detail.activate_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 mr-1" }),
            activateMut.isPending ? "Activating..." : "Activate LOTO"
          ]
        }
      ),
      loto.status === "Active" && allLocksRemoved && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => completeMut.mutate(),
          disabled: completeMut.isPending,
          "data-ocid": "loto.detail.complete_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4 mr-1" }),
            completeMut.isPending ? "Completing..." : "Complete LOTO"
          ]
        }
      ),
      (loto.status === "Draft" || loto.status === "Active") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => setCancelOpen(true),
          className: "border-destructive/40 text-destructive hover:bg-destructive/10",
          "data-ocid": "loto.detail.cancel_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-1" }),
            " Cancel LOTO"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: cancelOpen, onOpenChange: setCancelOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-sm",
        "data-ocid": "loto.cancel.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Cancel LOTO" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason for cancellation" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: cancelReason,
                onChange: (e) => setCancelReason(e.target.value),
                "data-ocid": "loto.cancel.reason_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => setCancelOpen(false),
                  "data-ocid": "loto.cancel.cancel_button",
                  children: "Back"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  onClick: () => cancelMut.mutate(),
                  disabled: cancelMut.isPending || !cancelReason,
                  className: "flex-1 bg-destructive/80 hover:bg-destructive text-destructive-foreground",
                  "data-ocid": "loto.cancel.confirm_button",
                  children: cancelMut.isPending ? "Cancelling..." : "Confirm Cancel"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}
const ENERGY_SOURCES = Object.values(EnergySourceLOTO);
function LotoList({ canEdit }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [selected, setSelected] = reactExports.useState(null);
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    equipmentName: "",
    tagNumber: "",
    workDescription: "",
    startDateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
    energySources: []
  });
  const { data: lotos = [], isLoading } = useQuery({
    queryKey: ["lotos"],
    queryFn: async () => {
      const r = await actor.listLotos(token);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token
  });
  const createMut = useMutation({
    mutationFn: async () => {
      const input = {
        equipmentName: form.equipmentName,
        tagNumber: form.tagNumber,
        workDescription: form.workDescription,
        startDateTime: BigInt(new Date(form.startDateTime).getTime()) * 1000000n
      };
      const r = await actor.createLoto(token, input);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      qc.invalidateQueries({ queryKey: ["lotoStats"] });
      ue.success("LOTO created");
      setCreateOpen(false);
      setForm({
        equipmentName: "",
        tagNumber: "",
        workDescription: "",
        startDateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
        energySources: []
      });
    },
    onError: (e) => ue.error(e.message)
  });
  const toggleEnergy = (src) => {
    setForm((p) => ({
      ...p,
      energySources: p.energySources.includes(src) ? p.energySources.filter((s) => s !== src) : [...p.energySources, src]
    }));
  };
  if (selected) {
    const live = lotos.find((l) => l.lotoNumber === selected.lotoNumber) ?? selected;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      LotoDetail,
      {
        loto: live,
        onBack: () => setSelected(null),
        canEdit
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        size: "sm",
        onClick: () => setCreateOpen(true),
        "data-ocid": "loto.list.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
          " Create New LOTO"
        ]
      }
    ) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12" }, i)) }) : lotos.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-14 text-muted-foreground",
        "data-ocid": "loto.list.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-10 h-10 mx-auto mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No LOTO records yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Create a new LOTO to get started" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-card/80", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "text-left text-muted-foreground", children: [
        "LOTO Number",
        "Equipment",
        "Tag",
        "Energy Sources",
        "Start",
        "End",
        "Status",
        ""
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-medium", children: h }, h)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: lotos.map((loto, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-t border-border/30 hover:bg-card/40 cursor-pointer",
          onClick: () => setSelected(loto),
          onKeyDown: () => {
          },
          "data-ocid": `loto.list.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs font-semibold text-primary", children: loto.lotoNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: loto.equipmentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: loto.tagNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
              loto.energySources.slice(0, 3).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] border-secondary/40 text-secondary",
                  children: s
                },
                s
              )),
              loto.energySources.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px]", children: [
                "+",
                loto.energySources.length - 3
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: ts(loto.startDateTime) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: loto.endDateTime ? ts(loto.endDateTime) : "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LotoBadge, { status: loto.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: (e) => {
                  e.stopPropagation();
                  setSelected(loto);
                },
                "data-ocid": `loto.list.view_button.${i + 1}`,
                children: "View"
              }
            ) })
          ]
        },
        loto.lotoNumber
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "bg-card border-border max-w-lg",
        "data-ocid": "loto.create.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Create New LOTO" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 py-2 max-h-[70vh] overflow-y-auto pr-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Equipment Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.equipmentName,
                    onChange: (e) => setForm((p) => ({ ...p, equipmentName: e.target.value })),
                    "data-ocid": "loto.create.equipment_input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Tag Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.tagNumber,
                    onChange: (e) => setForm((p) => ({ ...p, tagNumber: e.target.value })),
                    "data-ocid": "loto.create.tag_input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Work Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: form.workDescription,
                  onChange: (e) => setForm((p) => ({ ...p, workDescription: e.target.value })),
                  "data-ocid": "loto.create.desc_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block", children: "Start Date/Time" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "datetime-local",
                  value: form.startDateTime,
                  onChange: (e) => setForm((p) => ({ ...p, startDateTime: e.target.value })),
                  "data-ocid": "loto.create.start_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block", children: "Energy Sources" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: ENERGY_SOURCES.map((src) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  htmlFor: `loto-energy-${src}`,
                  className: "flex items-center gap-2 cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Checkbox,
                      {
                        id: `loto-energy-${src}`,
                        checked: form.energySources.includes(src),
                        onCheckedChange: () => toggleEnergy(src),
                        "data-ocid": `loto.create.energy_${src.toLowerCase()}_checkbox`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: src })
                  ]
                },
                src
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => createMut.mutate(),
                disabled: createMut.isPending || !form.equipmentName || !form.tagNumber,
                "data-ocid": "loto.create.submit_button",
                children: createMut.isPending ? "Creating..." : "Create LOTO"
              }
            )
          ] })
        ]
      }
    ) })
  ] });
}
const PPE_SUB_TABS = [
  "Item Master",
  "Inventory",
  "Issuances",
  "Inspections"
];
function PpeTab({ canEdit }) {
  const [subTab, setSubTab] = reactExports.useState("Item Master");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PpeStatsBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 bg-card/40 rounded-lg p-1 mb-5 w-fit", children: PPE_SUB_TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setSubTab(t),
        className: `px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${subTab === t ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`,
        "data-ocid": `ppe.subtab.${t.toLowerCase().replace(/ /g, "_")}`,
        children: t
      },
      t
    )) }),
    subTab === "Item Master" && /* @__PURE__ */ jsxRuntimeExports.jsx(PpeItemMaster, { canEdit }),
    subTab === "Inventory" && /* @__PURE__ */ jsxRuntimeExports.jsx(PpeInventory, { canEdit }),
    subTab === "Issuances" && /* @__PURE__ */ jsxRuntimeExports.jsx(PpeIssuances, { canEdit }),
    subTab === "Inspections" && /* @__PURE__ */ jsxRuntimeExports.jsx(PpeInspections, { canEdit })
  ] });
}
const MAIN_TABS = ["PPE Management", "LOTO"];
function PPELOTOPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = reactExports.useState("PPE Management");
  const manageable = canManage((user == null ? void 0 : user.role) ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background px-4 md:px-8 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "p-2 rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "PPE & LOTO Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Personal Protective Equipment control and Lockout-Tagout procedures" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 bg-card/50 rounded-xl p-1 mb-6 w-fit border border-border/30", children: MAIN_TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setActiveTab(t),
        className: `flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-card/60"}`,
        "data-ocid": `ppe_loto.main_tab.${t.toLowerCase().replace(/ /g, "_")}`,
        children: [
          t === "PPE Management" ? /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
          t
        ]
      },
      t
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card/30 backdrop-blur border border-border/30 rounded-2xl p-5", children: [
      activeTab === "PPE Management" && /* @__PURE__ */ jsxRuntimeExports.jsx(PpeTab, { canEdit: manageable }),
      activeTab === "LOTO" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LotoStatsBar, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LotoList, { canEdit: manageable })
      ] })
    ] })
  ] });
}
export {
  PPELOTOPage as default
};
