import { u as useBackend, h as useQueryClient, r as reactExports, f as useQuery, i as useMutation, j as jsxRuntimeExports, U as Users, B as Button, I as Input, E as EmployeeStatus, n as ue, S as ScrollArea, T as TriangleAlert, o as BookOpen, C as ClipboardList, m as Label, p as EmploymentType } from "./index-KlJ1Xkuh.js";
import { B as Badge } from "./badge-9gf8k1SD.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Bs5nxuZB.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-07LXmFHp.js";
import { S as Separator } from "./separator-BAceehUw.js";
import { S as Skeleton } from "./skeleton-BD1qWQ8I.js";
import { D as DEPARTMENTS } from "./locations-CVEfhVNL.js";
import { D as Download } from "./download-BfljrMPH.js";
import { P as Plus, X } from "./x-De3qytGh.js";
import { S as Search } from "./search-B9Llb9ph.js";
import { C as ChevronRight } from "./chevron-right-DIz5FQTE.js";
import { U as User } from "./user-BvAoThH5.js";
import "./index-DhDE9dTE.js";
const STATUS_BADGE = {
  [EmployeeStatus.Active]: "bg-primary/15 text-primary border-primary/30",
  [EmployeeStatus.Inactive]: "bg-muted text-muted-foreground border-border",
  [EmployeeStatus.Resigned]: "bg-destructive/15 text-destructive border-destructive/30"
};
const STATUS_LABELS = {
  [EmployeeStatus.Active]: "Active",
  [EmployeeStatus.Inactive]: "Inactive",
  [EmployeeStatus.Resigned]: "Resigned"
};
const EMP_TYPE_LABELS = {
  [EmploymentType.FullTime]: "Full-time",
  [EmploymentType.Contract]: "Contract",
  [EmploymentType.Temporary]: "Temporary"
};
function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return iso;
  }
}
function exportCSV(rows) {
  const headers = [
    "Employee Code",
    "Full Name",
    "Department",
    "Designation",
    "Site",
    "Employment Type",
    "Status",
    "Joining Date",
    "Date of Birth",
    "Contact",
    "Email"
  ];
  const lines = rows.map(
    (e) => [
      e.empCode,
      e.fullName,
      e.department,
      e.designation,
      e.site,
      EMP_TYPE_LABELS[e.employmentType],
      STATUS_LABELS[e.empStatus],
      e.joiningDate,
      e.dateOfBirth,
      e.contact,
      e.email
    ].map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
  );
  const blob = new Blob([[headers.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8;"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `employees_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
const EMPTY_FORM = {
  fullName: "",
  dateOfBirth: "",
  contact: "",
  email: "",
  department: "",
  designation: "",
  site: "",
  joiningDate: "",
  employmentType: "",
  empStatus: ""
};
function validateForm(f) {
  const e = {};
  if (!f.fullName.trim()) e.fullName = "Full name is required.";
  if (!f.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
  if (!f.contact.trim()) e.contact = "Contact is required.";
  else if (!/^[0-9+\-\s()]{7,15}$/.test(f.contact.trim()))
    e.contact = "Enter a valid phone number.";
  if (!f.email.trim()) e.email = "Email is required.";
  else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))
    e.email = "Enter a valid email address.";
  if (!f.department.trim()) e.department = "Department is required.";
  if (!f.designation.trim()) e.designation = "Designation is required.";
  if (!f.site.trim()) e.site = "Site is required.";
  if (!f.joiningDate) e.joiningDate = "Joining date is required.";
  if (!f.employmentType) e.employmentType = "Employment type is required.";
  if (!f.empStatus) e.empStatus = "Status is required.";
  return e;
}
function DetailPanel({ employee, onClose, token, actor }) {
  const { data: incidents } = useQuery({
    queryKey: ["incidents", "for-emp", employee.empCode],
    queryFn: async () => {
      const r = await actor.listIncidents(
        token,
        null,
        null,
        null,
        employee.department
      );
      if (r.__kind__ === "err") return [];
      return r.ok.filter((i) => i.injuredPersonCode === employee.empCode);
    },
    staleTime: 6e4
  });
  const { data: trainings } = useQuery({
    queryKey: ["trainings", "for-dept", employee.department],
    queryFn: async () => {
      const r = await actor.listTrainings(token, employee.department, null);
      if (r.__kind__ === "err") return [];
      return r.ok.filter(
        (t) => t.attendees.some((a) => a.empCode === employee.empCode)
      );
    },
    staleTime: 6e4
  });
  const { data: ptws } = useQuery({
    queryKey: ["ptws", "for-emp", employee.empCode],
    queryFn: async () => {
      const r = await actor.listPTWs(token, null, null);
      if (r.__kind__ === "err") return [];
      return r.ok;
    },
    staleTime: 6e4
  });
  const rows = [
    ["Employee Code", employee.empCode],
    ["Department", employee.department],
    ["Designation", employee.designation],
    ["Site", employee.site],
    ["Date of Birth", formatDate(employee.dateOfBirth)],
    ["Joining Date", formatDate(employee.joiningDate)],
    ["Employment Type", EMP_TYPE_LABELS[employee.employmentType]],
    ["Contact", employee.contact],
    ["Email", employee.email]
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "employees.detail_panel",
      className: "fixed inset-0 z-40 flex",
      onClick: onClose,
      onKeyDown: (e) => e.key === "Escape" && onClose(),
      role: "presentation",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 bg-background/60 backdrop-blur-sm" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col h-full",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-mono uppercase tracking-wider", children: employee.empCode }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground truncate", children: employee.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: employee.designation })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Close detail panel",
                    onClick: onClose,
                    "data-ocid": "employees.detail.close_button",
                    className: "rounded-lg p-2 hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `${STATUS_BADGE[employee.empStatus]} px-3 py-1 font-medium`,
                      children: STATUS_LABELS[employee.empStatus]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: EMP_TYPE_LABELS[employee.employmentType] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": "employees.detail.incidents_count",
                      className: "elevated-card rounded-xl p-4 text-center",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-destructive mx-auto mb-1" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-mono text-foreground", children: incidents === void 0 ? "…" : incidents.length }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Incidents" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": "employees.detail.trainings_count",
                      className: "elevated-card rounded-xl p-4 text-center",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5 text-primary mx-auto mb-1" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-mono text-foreground", children: trainings === void 0 ? "…" : trainings.length }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Trainings" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": "employees.detail.ptw_count",
                      className: "elevated-card rounded-xl p-4 text-center",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-5 h-5 text-accent mx-auto mb-1" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-mono text-foreground", children: ptws === void 0 ? "…" : ptws.length }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "PTWs" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: rows.map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex justify-between items-start gap-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground shrink-0 w-32", children: label }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground text-right break-words min-w-0", children: value || "—" })
                    ]
                  },
                  label
                )) })
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
function AddEmployeeModal({
  open,
  onClose,
  onSave,
  isSaving
}) {
  const [form, setForm] = reactExports.useState(EMPTY_FORM);
  const [errors, setErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState(/* @__PURE__ */ new Set());
  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (touched.has(key)) {
      const next = { ...form, [key]: value };
      const e = validateForm(next);
      setErrors((prev) => ({ ...prev, [key]: e[key] }));
    }
  };
  const blur = (key) => {
    setTouched((s) => new Set(s).add(key));
    const e = validateForm(form);
    setErrors((prev) => ({ ...prev, [key]: e[key] }));
  };
  async function handleSubmit() {
    const allKeys = Object.keys(EMPTY_FORM);
    setTouched(new Set(allKeys));
    const e = validateForm(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    await onSave({
      fullName: form.fullName.trim(),
      dateOfBirth: form.dateOfBirth,
      contact: form.contact.trim(),
      email: form.email.trim(),
      department: form.department.trim(),
      designation: form.designation.trim(),
      site: form.site.trim(),
      joiningDate: form.joiningDate,
      employmentType: form.employmentType
    });
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched(/* @__PURE__ */ new Set());
  }
  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched(/* @__PURE__ */ new Set());
    onClose();
  }
  const field = (key, label, props) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: key, className: "text-sm font-medium text-foreground", children: [
      label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        id: key,
        ...props,
        value: form[key],
        onChange: (e) => set(key, e.target.value),
        onBlur: () => blur(key),
        "data-ocid": `employees.form.${key}_input`,
        className: errors[key] ? "border-destructive" : ""
      }
    ),
    errors[key] && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "text-xs text-destructive",
        "data-ocid": `employees.form.${key}.field_error`,
        children: errors[key]
      }
    )
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl w-full bg-card border-border",
      "data-ocid": "employees.add_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5 text-primary" }),
          "Add New Employee"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "max-h-[60vh] pr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 pr-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: field("fullName", "Full Name", {
            placeholder: "e.g. Rajan Pillai"
          }) }),
          field("dateOfBirth", "Date of Birth", { type: "date" }),
          field("joiningDate", "Joining Date", { type: "date" }),
          field("contact", "Contact Number", {
            placeholder: "+91 99999 00000"
          }),
          field("email", "Email", {
            type: "email",
            placeholder: "rajan@example.com"
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Label,
              {
                htmlFor: "department",
                className: "text-sm font-medium text-foreground",
                children: [
                  "Department ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.department,
                onValueChange: (v) => set("department", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      id: "department",
                      "data-ocid": "employees.form.department_input",
                      className: errors.department ? "border-destructive" : "",
                      onBlur: () => blur("department"),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Department" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
                ]
              }
            ),
            errors.department && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "employees.form.department.field_error",
                children: errors.department
              }
            )
          ] }),
          field("designation", "Designation", {
            placeholder: "e.g. Shift Supervisor"
          }),
          field("site", "Site", { placeholder: "e.g. Plant A – Kochi" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-foreground", children: [
              "Employment Type ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.employmentType,
                onValueChange: (v) => set("employmentType", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "data-ocid": "employees.form.employmentType_select",
                      className: errors.employmentType ? "border-destructive" : "",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmploymentType.FullTime, children: "Full-time" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmploymentType.Contract, children: "Contract" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmploymentType.Temporary, children: "Temporary" })
                  ] })
                ]
              }
            ),
            errors.employmentType && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "employees.form.employmentType.field_error",
                children: errors.employmentType
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-foreground", children: [
              "Status ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.empStatus,
                onValueChange: (v) => set("empStatus", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "data-ocid": "employees.form.empStatus_select",
                      className: errors.empStatus ? "border-destructive" : "",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select status" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmployeeStatus.Active, children: "Active" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmployeeStatus.Inactive, children: "Inactive" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmployeeStatus.Resigned, children: "Resigned" })
                  ] })
                ]
              }
            ),
            errors.empStatus && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "employees.form.empStatus.field_error",
                children: errors.empStatus
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: handleClose,
              disabled: isSaving,
              "data-ocid": "employees.add.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: handleSubmit,
              disabled: isSaving,
              "data-ocid": "employees.add.submit_button",
              children: isSaving ? "Saving…" : "Add Employee"
            }
          )
        ] })
      ]
    }
  ) });
}
const ALL = "__all__";
function EmployeesPage() {
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();
  const [search, setSearch] = reactExports.useState("");
  const [filterDept, setFilterDept] = reactExports.useState(ALL);
  const [filterSite, setFilterSite] = reactExports.useState(ALL);
  const [filterStatus, setFilterStatus] = reactExports.useState(
    ALL
  );
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(null);
  const debounceRef = reactExports.useRef(null);
  const [debouncedSearch, setDebouncedSearch] = reactExports.useState("");
  function handleSearchChange(v) {
    setSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(v), 400);
  }
  const {
    data: employees,
    isLoading,
    isError
  } = useQuery({
    queryKey: [
      "employees",
      filterDept,
      filterSite,
      filterStatus,
      debouncedSearch
    ],
    queryFn: async () => {
      if (!actor || !token) return [];
      const r = await actor.listEmployees(
        token,
        filterDept === ALL ? null : filterDept,
        filterSite === ALL ? null : filterSite,
        filterStatus === ALL ? null : filterStatus,
        debouncedSearch.trim() || null
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: isReady,
    staleTime: 3e4
  });
  const { departments, sites } = reactExports.useMemo(() => {
    const depts = /* @__PURE__ */ new Set();
    const sts = /* @__PURE__ */ new Set();
    for (const e of employees ?? []) {
      if (e.department) depts.add(e.department);
      if (e.site) sts.add(e.site);
    }
    return { departments: [...depts].sort(), sites: [...sts].sort() };
  }, [employees]);
  const addMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const r = await actor.addEmployee(token, input);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (emp) => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      ue.success(`Employee ${emp.empCode} added successfully.`);
      setAddOpen(false);
    },
    onError: (e) => ue.error(e.message ?? "Failed to add employee.")
  });
  const SkeletonRows = () => /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: Array.from({ length: 8 }).map((_2, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full rounded" }) }, j)) }, i)) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "employees.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "section-header mb-0 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 text-primary" }),
        "Employee Master"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => exportCSV(employees ?? []),
            disabled: !employees || employees.length === 0,
            "data-ocid": "employees.export_button",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
              "Export CSV"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            onClick: () => setAddOpen(true),
            "data-ocid": "employees.add_button",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Add Employee"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl px-4 py-3 flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[180px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: search,
            onChange: (e) => handleSearchChange(e.target.value),
            placeholder: "Search name or code…",
            className: "pl-9 h-9",
            "data-ocid": "employees.search_input"
          }
        ),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": "Clear search",
            onClick: () => {
              setSearch("");
              setDebouncedSearch("");
            },
            className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterDept, onValueChange: setFilterDept, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "w-[160px] h-9 text-sm",
            "data-ocid": "employees.filter.dept_select",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Departments" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ALL, children: "All Departments" }),
          departments.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterSite, onValueChange: setFilterSite, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "w-[140px] h-9 text-sm",
            "data-ocid": "employees.filter.site_select",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Sites" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ALL, children: "All Sites" }),
          sites.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: filterStatus,
          onValueChange: (v) => setFilterStatus(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-[130px] h-9 text-sm",
                "data-ocid": "employees.filter.status_select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Statuses" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: ALL, children: "All Statuses" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmployeeStatus.Active, children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmployeeStatus.Inactive, children: "Inactive" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: EmployeeStatus.Resigned, children: "Resigned" })
            ] })
          ]
        }
      ),
      !isLoading && employees && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-sm text-muted-foreground", children: [
        employees.length,
        " ",
        employees.length === 1 ? "employee" : "employees"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs", children: "Code" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs", children: "Department" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs", children: "Designation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs", children: "Site" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs", children: "Joining Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 w-10" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRows, {}) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "td",
        {
          colSpan: 8,
          className: "px-4 py-12 text-center",
          "data-ocid": "employees.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-medium", children: "Failed to load employees." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mt-1", children: "Check your connection and try again." })
          ]
        }
      ) }) : !employees || employees.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "td",
        {
          colSpan: 8,
          className: "px-4 py-16 text-center",
          "data-ocid": "employees.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 text-muted/60 mx-auto mb-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: "No employees found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: search || filterDept !== ALL || filterSite !== ALL || filterStatus !== ALL ? "Try adjusting your filters." : "Add your first employee to get started." }),
            !(search || filterDept !== ALL || filterSite !== ALL || filterStatus !== ALL) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                className: "mt-4",
                onClick: () => setAddOpen(true),
                "data-ocid": "employees.empty_state.add_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
                  " Add Employee"
                ]
              }
            )
          ]
        }
      ) }) : employees.map((emp, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `employees.item.${idx + 1}`,
          onClick: () => setSelected(emp),
          onKeyDown: (e) => e.key === "Enter" && setSelected(emp),
          tabIndex: 0,
          className: "border-b border-border hover:bg-muted/30 cursor-pointer transition-colors group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary", children: emp.empCode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate max-w-[160px] block", children: emp.fullName }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground truncate max-w-[120px]", children: emp.department }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground truncate max-w-[140px]", children: emp.designation }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: emp.site }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `${STATUS_BADGE[emp.empStatus]} text-xs`,
                children: STATUS_LABELS[emp.empStatus]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: formatDate(emp.joiningDate) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" }) })
          ]
        },
        emp.empCode
      )) })
    ] }) }) }),
    selected && actor && token && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DetailPanel,
      {
        employee: selected,
        onClose: () => setSelected(null),
        token,
        actor
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddEmployeeModal,
      {
        open: addOpen,
        onClose: () => setAddOpen(false),
        onSave: (input) => addMutation.mutateAsync(input).then(() => void 0),
        isSaving: addMutation.isPending
      }
    )
  ] });
}
export {
  EmployeesPage as default
};
