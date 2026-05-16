import { a as createLucideIcon, g as useNavigate, d as useAuth, u as useBackend, h as useQueryClient, r as reactExports, e as Role, f as useQuery, i as useMutation, j as jsxRuntimeExports, B as Button, I as Input, k as ROLE_LABELS, l as UserStatus, K as KeyRound, m as Label, v as validatePassword, n as ue } from "./index-o5KNRZJC.js";
import { B as Badge } from "./badge-drMlJ0Eb.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-BC0tVdjJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DLpeTQN2.js";
import { S as Skeleton } from "./skeleton-FWJuhcbn.js";
import { P as Plus } from "./x-CXE19MnU.js";
import { S as Search } from "./search-naONrdle.js";
import { S as ShieldCheck } from "./shield-check-ayivU1Ib.js";
import { R as RefreshCw } from "./refresh-cw-C2ML6aao.js";
import "./index-BgKcp2pS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      key: "1jlk70"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      key: "18rp1v"
    }
  ]
];
const ShieldOff = createLucideIcon("shield-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2", key: "1nfge6" }],
  ["path", { d: "m14.305 16.53.923-.382", key: "1itpsq" }],
  ["path", { d: "m15.228 13.852-.923-.383", key: "eplpkm" }],
  ["path", { d: "m16.852 12.228-.383-.923", key: "13v3q0" }],
  ["path", { d: "m16.852 17.772-.383.924", key: "1i8mnm" }],
  ["path", { d: "m19.148 12.228.383-.923", key: "1q8j1v" }],
  ["path", { d: "m19.53 18.696-.382-.924", key: "vk1qj3" }],
  ["path", { d: "m20.772 13.852.924-.383", key: "n880s0" }],
  ["path", { d: "m20.772 16.148.924.383", key: "1g6xey" }],
  ["circle", { cx: "18", cy: "15", r: "3", key: "gjjjvw" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCog = createLucideIcon("user-cog", __iconNode);
const PROTECTED_ID = 230034n;
const ALL_ROLES = [
  Role.SystemAdmin,
  Role.Employee,
  Role.SafetyOfficer,
  Role.HOD,
  Role.AreaInCharge,
  Role.ContractorAdmin
];
function formatTimestamp(ts) {
  if (!ts) return "—";
  const ms = Number(ts);
  if (ms === 0) return "—";
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function StatusBadge({ status }) {
  return status === UserStatus.Active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30", children: "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-muted-foreground border-border", children: "Inactive" });
}
const INITIAL_CREATE_FORM = {
  fullName: "",
  employeeId: "",
  email: "",
  department: "",
  designation: "",
  role: Role.Employee,
  password: "",
  confirmPassword: ""
};
function UsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { actor, token, isReady } = useBackend();
  const queryClient = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [filterRole, setFilterRole] = reactExports.useState("ALL");
  const [filterDept, setFilterDept] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("ALL");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [createForm, setCreateForm] = reactExports.useState(INITIAL_CREATE_FORM);
  const [createErrors, setCreateErrors] = reactExports.useState({});
  const [resetTarget, setResetTarget] = reactExports.useState(null);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [newPasswordError, setNewPasswordError] = reactExports.useState("");
  const {
    data: users,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["users", filterRole, filterDept, filterStatus],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listUsers(
        token,
        filterRole !== "ALL" ? filterRole : null,
        filterDept.trim() || null,
        filterStatus !== "ALL" ? filterStatus : null
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token
  });
  const filtered = reactExports.useMemo(() => {
    if (!users) return [];
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.fullName.toLowerCase().includes(q) || String(u.employeeId).includes(q)
    );
  }, [users, search]);
  const departments = reactExports.useMemo(() => {
    if (!users) return [];
    const s = new Set(users.map((u) => u.department));
    return Array.from(s).sort();
  }, [users]);
  const createMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createUser(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (u) => {
      ue.success(`User ${u.fullName} created successfully.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowCreate(false);
      setCreateForm(INITIAL_CREATE_FORM);
    },
    onError: (e) => {
      ue.error(e.message ?? "Failed to create user.");
    }
  });
  const resetMutation = useMutation({
    mutationFn: async ({
      target,
      password
    }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.resetPassword(token, target.employeeId, password);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      ue.success("Password reset successfully.");
      setResetTarget(null);
      setNewPassword("");
    },
    onError: (e) => {
      ue.error(e.message ?? "Failed to reset password.");
    }
  });
  const statusMutation = useMutation({
    mutationFn: async ({
      target,
      newStatus
    }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.setUserStatus(
        token,
        target.employeeId,
        newStatus
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_data, { target, newStatus }) => {
      ue.success(
        `${target.fullName} has been ${newStatus === UserStatus.Active ? "reactivated" : "deactivated"}.`
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e) => {
      ue.error(e.message ?? "Failed to update user status.");
    }
  });
  if (user && user.role !== Role.SystemAdmin) {
    navigate({ to: "/dashboard" });
    return null;
  }
  function validateCreate() {
    const errs = {};
    if (!createForm.fullName.trim()) errs.fullName = "Full name is required.";
    if (!createForm.employeeId.trim() || !/^\d+$/.test(createForm.employeeId))
      errs.employeeId = "Employee ID must be a numeric value.";
    if (!createForm.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(createForm.email))
      errs.email = "A valid email address is required.";
    if (!createForm.department.trim())
      errs.department = "Department is required.";
    if (!createForm.designation.trim())
      errs.designation = "Designation is required.";
    const pwdErr = validatePassword(createForm.password);
    if (pwdErr) errs.password = pwdErr;
    if (createForm.password !== createForm.confirmPassword)
      errs.confirmPassword = "Passwords do not match.";
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  }
  function handleCreateSubmit() {
    if (!validateCreate()) return;
    createMutation.mutate({
      fullName: createForm.fullName.trim(),
      employeeId: BigInt(createForm.employeeId),
      email: createForm.email.trim(),
      department: createForm.department.trim(),
      designation: createForm.designation.trim(),
      role: createForm.role,
      password: createForm.password
    });
  }
  function handleResetSubmit() {
    if (!resetTarget) return;
    const err = validatePassword(newPassword);
    if (err) {
      setNewPasswordError(err);
      return;
    }
    setNewPasswordError("");
    resetMutation.mutate({ target: resetTarget, password: newPassword });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "users.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "w-6 h-6 text-primary" }),
          "User Management"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Manage system users, roles, and access." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: () => {
            setCreateForm(INITIAL_CREATE_FORM);
            setCreateErrors({});
            setShowCreate(true);
          },
          className: "gap-2",
          "data-ocid": "users.open_modal_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            " New User"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 bg-card border border-border rounded-lg p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search name or Employee ID…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-9",
            "data-ocid": "users.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterRole,
          onValueChange: (v) => setFilterRole(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44", "data-ocid": "users.role_filter.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Roles" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Roles" }),
              ALL_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: ROLE_LABELS[r] }, r))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterDept || "ALL",
          onValueChange: (v) => setFilterDept(v === "ALL" ? "" : v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44", "data-ocid": "users.dept_filter.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Departments" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Departments" }),
              departments.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterStatus,
          onValueChange: (v) => setFilterStatus(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-36",
                "data-ocid": "users.status_filter.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UserStatus.Active, children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: UserStatus.Inactive, children: "Inactive" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-lg overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Employee ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Department" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Last Login" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-muted-foreground font-medium", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        isLoading && Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border/50", children: Array.from({ length: 7 }).map((_2, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, j)) }, i)),
        isError && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "td",
          {
            colSpan: 7,
            className: "px-4 py-12 text-center",
            "data-ocid": "users.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-medium", children: "Failed to load users." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1", children: "Check your connection and try again." })
            ]
          }
        ) }),
        !isLoading && !isError && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "td",
          {
            colSpan: 7,
            className: "px-4 py-16 text-center",
            "data-ocid": "users.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "w-10 h-10 text-muted-foreground/40 mx-auto mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No users found." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-xs mt-1", children: "Adjust your filters or create a new user." })
            ]
          }
        ) }),
        !isLoading && !isError && filtered.map((u, idx) => {
          var _a;
          const isProtected = u.employeeId === PROTECTED_ID;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/50 hover:bg-muted/20 transition-colors",
              "data-ocid": `users.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-foreground", children: String(u.employeeId) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: u.fullName }),
                  isProtected && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-2 text-[10px] bg-secondary/20 text-secondary border-secondary/30", children: "Protected" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30", children: ROLE_LABELS[u.role] }),
                  isProtected && ((_a = u.roles) == null ? void 0 : _a.filter((r) => r !== Role.SystemAdmin).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: "text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30",
                      children: ROLE_LABELS[r] ?? r
                    },
                    r
                  )))
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: u.department }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: u.status }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: formatTimestamp(u.lastLogin) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "gap-1 text-muted-foreground hover:text-foreground",
                      onClick: () => {
                        setResetTarget(u);
                        setNewPassword("");
                        setNewPasswordError("");
                      },
                      "data-ocid": `users.reset_password.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "w-3.5 h-3.5" }),
                        "Reset"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      disabled: isProtected || statusMutation.isPending,
                      className: `gap-1 ${u.status === UserStatus.Active ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-primary hover:text-primary hover:bg-primary/10"}`,
                      onClick: () => statusMutation.mutate({
                        target: u,
                        newStatus: u.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active
                      }),
                      title: isProtected ? "Protected account cannot be deactivated" : void 0,
                      "data-ocid": `users.toggle_status.${idx + 1}`,
                      children: u.status === UserStatus.Active ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3.5 h-3.5" }),
                        " Deactivate"
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
                        " ",
                        "Reactivate"
                      ] })
                    }
                  )
                ] }) })
              ]
            },
            String(u.employeeId)
          );
        })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showCreate, onOpenChange: setShowCreate, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-lg bg-card border-border",
        "data-ocid": "users.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5 text-primary" }),
            " Create New User"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cu-name", className: "text-foreground", children: "Full Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cu-name",
                  placeholder: "e.g. Rajan Pillai",
                  value: createForm.fullName,
                  onChange: (e) => setCreateForm((f) => ({ ...f, fullName: e.target.value })),
                  "data-ocid": "users.create.name.input"
                }
              ),
              createErrors.fullName && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "users.create.name.field_error",
                  children: createErrors.fullName
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cu-eid", className: "text-foreground", children: "Employee ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cu-eid",
                  inputMode: "numeric",
                  placeholder: "Numeric only, e.g. 100042",
                  value: createForm.employeeId,
                  onChange: (e) => setCreateForm((f) => ({
                    ...f,
                    employeeId: e.target.value.replace(/\D/g, "")
                  })),
                  "data-ocid": "users.create.employee_id.input"
                }
              ),
              createErrors.employeeId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "users.create.employee_id.field_error",
                  children: createErrors.employeeId
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cu-email", className: "text-foreground", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cu-email",
                  type: "email",
                  placeholder: "e.g. rajan@rktrwheels.com",
                  value: createForm.email,
                  onChange: (e) => setCreateForm((f) => ({ ...f, email: e.target.value })),
                  "data-ocid": "users.create.email.input"
                }
              ),
              createErrors.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "users.create.email.field_error",
                  children: createErrors.email
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cu-dept", className: "text-foreground", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "cu-dept",
                    placeholder: "e.g. Operations",
                    value: createForm.department,
                    onChange: (e) => setCreateForm((f) => ({ ...f, department: e.target.value })),
                    "data-ocid": "users.create.department.input"
                  }
                ),
                createErrors.department && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive",
                    "data-ocid": "users.create.department.field_error",
                    children: createErrors.department
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cu-desg", className: "text-foreground", children: "Designation" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "cu-desg",
                    placeholder: "e.g. Supervisor",
                    value: createForm.designation,
                    onChange: (e) => setCreateForm((f) => ({
                      ...f,
                      designation: e.target.value
                    })),
                    "data-ocid": "users.create.designation.input"
                  }
                ),
                createErrors.designation && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive",
                    "data-ocid": "users.create.designation.field_error",
                    children: createErrors.designation
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Role" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: createForm.role,
                  onValueChange: (v) => setCreateForm((f) => ({ ...f, role: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "users.create.role.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: ROLE_LABELS[r] }, r)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cu-pwd", className: "text-foreground", children: "Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cu-pwd",
                  type: "password",
                  placeholder: "Min 8 chars, upper, number, special",
                  value: createForm.password,
                  onChange: (e) => setCreateForm((f) => ({ ...f, password: e.target.value })),
                  "data-ocid": "users.create.password.input"
                }
              ),
              createErrors.password && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "users.create.password.field_error",
                  children: createErrors.password
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "cu-cpwd", className: "text-foreground", children: "Confirm Password" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "cu-cpwd",
                  type: "password",
                  placeholder: "Repeat password",
                  value: createForm.confirmPassword,
                  onChange: (e) => setCreateForm((f) => ({
                    ...f,
                    confirmPassword: e.target.value
                  })),
                  "data-ocid": "users.create.confirm_password.input"
                }
              ),
              createErrors.confirmPassword && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-xs text-destructive",
                  "data-ocid": "users.create.confirm_password.field_error",
                  children: createErrors.confirmPassword
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setShowCreate(false),
                "data-ocid": "users.create.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: handleCreateSubmit,
                disabled: createMutation.isPending,
                className: "gap-2",
                "data-ocid": "users.create.submit_button",
                children: [
                  createMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }),
                  "Create User"
                ]
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: !!resetTarget,
        onOpenChange: (open) => {
          if (!open) setResetTarget(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DialogContent,
          {
            className: "max-w-sm bg-card border-border",
            "data-ocid": "users.reset.dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "w-5 h-5 text-secondary" }),
                " Reset Password"
              ] }) }),
              resetTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                  "Setting new password for",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: resetTarget.fullName }),
                  " ",
                  "(ID: ",
                  String(resetTarget.employeeId),
                  ")"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rp-pwd", className: "text-foreground", children: "New Password" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "rp-pwd",
                      type: "password",
                      placeholder: "Min 8 chars, upper, number, special",
                      value: newPassword,
                      onChange: (e) => {
                        setNewPassword(e.target.value);
                        setNewPasswordError("");
                      },
                      "data-ocid": "users.reset.password.input"
                    }
                  ),
                  newPasswordError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "users.reset.password.field_error",
                      children: newPasswordError
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => setResetTarget(null),
                    "data-ocid": "users.reset.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    onClick: handleResetSubmit,
                    disabled: resetMutation.isPending,
                    className: "gap-2",
                    "data-ocid": "users.reset.confirm_button",
                    children: [
                      resetMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }),
                      "Reset Password"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  UsersPage as default
};
