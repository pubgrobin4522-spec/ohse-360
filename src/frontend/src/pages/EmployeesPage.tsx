import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Download,
  Plus,
  Search,
  User,
  Users,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { toast } from "sonner";
import type {
  AddEmployeeInput,
  EmployeeView,
  backendInterface,
} from "../backend";
import { EmployeeStatus, EmploymentType } from "../backend";
import { useBackend } from "../hooks/useBackend";

// ── helpers ──────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<EmployeeStatus, string> = {
  [EmployeeStatus.Active]: "bg-primary/15 text-primary border-primary/30",
  [EmployeeStatus.Inactive]: "bg-muted text-muted-foreground border-border",
  [EmployeeStatus.Resigned]:
    "bg-destructive/15 text-destructive border-destructive/30",
};

const STATUS_LABELS: Record<EmployeeStatus, string> = {
  [EmployeeStatus.Active]: "Active",
  [EmployeeStatus.Inactive]: "Inactive",
  [EmployeeStatus.Resigned]: "Resigned",
};

const EMP_TYPE_LABELS: Record<EmploymentType, string> = {
  [EmploymentType.FullTime]: "Full-time",
  [EmploymentType.Contract]: "Contract",
  [EmploymentType.Temporary]: "Temporary",
};

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function exportCSV(rows: EmployeeView[]) {
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
    "Email",
  ];
  const lines = rows.map((e) =>
    [
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
      e.email,
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(","),
  );
  const blob = new Blob([[headers.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `employees_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Form types & validation ───────────────────────────────────────────────────

interface EmpForm {
  fullName: string;
  dateOfBirth: string;
  contact: string;
  email: string;
  department: string;
  designation: string;
  site: string;
  joiningDate: string;
  employmentType: EmploymentType | "";
  empStatus: EmployeeStatus | "";
}

const EMPTY_FORM: EmpForm = {
  fullName: "",
  dateOfBirth: "",
  contact: "",
  email: "",
  department: "",
  designation: "",
  site: "",
  joiningDate: "",
  employmentType: "",
  empStatus: "",
};

type FormErrors = Partial<Record<keyof EmpForm, string>>;

function validateForm(f: EmpForm): FormErrors {
  const e: FormErrors = {};
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

// ── Detail panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  employee: EmployeeView;
  onClose: () => void;
  token: string;
  actor: backendInterface;
}

function DetailPanel({ employee, onClose, token, actor }: DetailPanelProps) {
  const { data: incidents } = useQuery({
    queryKey: ["incidents", "for-emp", employee.empCode],
    queryFn: async () => {
      const r = await actor.listIncidents(
        token,
        null,
        null,
        null,
        employee.department,
      );
      if (r.__kind__ === "err") return [];
      return r.ok.filter((i) => i.injuredPersonCode === employee.empCode);
    },
    staleTime: 60_000,
  });
  const { data: trainings } = useQuery({
    queryKey: ["trainings", "for-dept", employee.department],
    queryFn: async () => {
      const r = await actor.listTrainings(token, employee.department, null);
      if (r.__kind__ === "err") return [];
      return r.ok.filter((t) =>
        t.attendees.some((a) => a.empCode === employee.empCode),
      );
    },
    staleTime: 60_000,
  });
  const { data: ptws } = useQuery({
    queryKey: ["ptws", "for-emp", employee.empCode],
    queryFn: async () => {
      const r = await actor.listPTWs(token, null, null);
      if (r.__kind__ === "err") return [];
      return r.ok;
    },
    staleTime: 60_000,
  });

  const rows: [string, string][] = [
    ["Employee Code", employee.empCode],
    ["Department", employee.department],
    ["Designation", employee.designation],
    ["Site", employee.site],
    ["Date of Birth", formatDate(employee.dateOfBirth)],
    ["Joining Date", formatDate(employee.joiningDate)],
    ["Employment Type", EMP_TYPE_LABELS[employee.employmentType]],
    ["Contact", employee.contact],
    ["Email", employee.email],
  ];

  return (
    <div
      data-ocid="employees.detail_panel"
      className="fixed inset-0 z-40 flex"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="presentation"
    >
      {/* backdrop */}
      <div className="flex-1 bg-background/60 backdrop-blur-sm" />
      {/* panel */}
      <div
        className="w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-xs text-primary font-mono uppercase tracking-wider">
              {employee.empCode}
            </p>
            <h2 className="text-lg font-bold text-foreground truncate">
              {employee.fullName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {employee.designation}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close detail panel"
            onClick={onClose}
            data-ocid="employees.detail.close_button"
            className="rounded-lg p-2 hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-6 py-4 space-y-6">
            {/* Status */}
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={`${STATUS_BADGE[employee.empStatus]} px-3 py-1 font-medium`}
              >
                {STATUS_LABELS[employee.empStatus]}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {EMP_TYPE_LABELS[employee.employmentType]}
              </span>
            </div>

            {/* Linked record badges */}
            <div className="grid grid-cols-3 gap-3">
              <div
                data-ocid="employees.detail.incidents_count"
                className="elevated-card rounded-xl p-4 text-center"
              >
                <AlertTriangle className="w-5 h-5 text-destructive mx-auto mb-1" />
                <p className="text-2xl font-bold font-mono text-foreground">
                  {incidents === undefined ? "…" : incidents.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Incidents
                </p>
              </div>
              <div
                data-ocid="employees.detail.trainings_count"
                className="elevated-card rounded-xl p-4 text-center"
              >
                <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold font-mono text-foreground">
                  {trainings === undefined ? "…" : trainings.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Trainings
                </p>
              </div>
              <div
                data-ocid="employees.detail.ptw_count"
                className="elevated-card rounded-xl p-4 text-center"
              >
                <ClipboardList className="w-5 h-5 text-accent mx-auto mb-1" />
                <p className="text-2xl font-bold font-mono text-foreground">
                  {ptws === undefined ? "…" : ptws.length}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">PTWs</p>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Detail rows */}
            <div className="space-y-3">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-start gap-4"
                >
                  <span className="text-sm text-muted-foreground shrink-0 w-32">
                    {label}
                  </span>
                  <span className="text-sm text-foreground text-right break-words min-w-0">
                    {value || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ── Add Employee Modal ────────────────────────────────────────────────────────

interface AddEmpModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (input: AddEmployeeInput) => Promise<void>;
  isSaving: boolean;
}

function AddEmployeeModal({
  open,
  onClose,
  onSave,
  isSaving,
}: AddEmpModalProps) {
  const [form, setForm] = useState<EmpForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<keyof EmpForm>>(new Set());

  const set = (key: keyof EmpForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (touched.has(key)) {
      const next = { ...form, [key]: value };
      const e = validateForm(next as EmpForm);
      setErrors((prev) => ({ ...prev, [key]: e[key] }));
    }
  };

  const blur = (key: keyof EmpForm) => {
    setTouched((s) => new Set(s).add(key));
    const e = validateForm(form);
    setErrors((prev) => ({ ...prev, [key]: e[key] }));
  };

  async function handleSubmit() {
    const allKeys = Object.keys(EMPTY_FORM) as (keyof EmpForm)[];
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
      employmentType: form.employmentType as EmploymentType,
    });
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched(new Set());
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    setTouched(new Set());
    onClose();
  }

  const field = (
    key: keyof EmpForm,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div className="space-y-1">
      <Label htmlFor={key} className="text-sm font-medium text-foreground">
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input
        id={key}
        {...props}
        value={form[key] as string}
        onChange={(e) => set(key, e.target.value)}
        onBlur={() => blur(key)}
        data-ocid={`employees.form.${key}_input`}
        className={errors[key] ? "border-destructive" : ""}
      />
      {errors[key] && (
        <p
          className="text-xs text-destructive"
          data-ocid={`employees.form.${key}.field_error`}
        >
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="max-w-2xl w-full bg-card border-border"
        data-ocid="employees.add_dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Add New Employee
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="grid grid-cols-2 gap-4 pr-2">
            {/* Full name spans both columns */}
            <div className="col-span-2">
              {field("fullName", "Full Name", {
                placeholder: "e.g. Rajan Pillai",
              })}
            </div>

            {field("dateOfBirth", "Date of Birth", { type: "date" })}
            {field("joiningDate", "Joining Date", { type: "date" })}
            {field("contact", "Contact Number", {
              placeholder: "+91 99999 00000",
            })}
            {field("email", "Email", {
              type: "email",
              placeholder: "rajan@example.com",
            })}
            {field("department", "Department", {
              placeholder: "e.g. Production",
            })}
            {field("designation", "Designation", {
              placeholder: "e.g. Shift Supervisor",
            })}
            {field("site", "Site", { placeholder: "e.g. Plant A – Kochi" })}

            {/* Employment Type */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-foreground">
                Employment Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.employmentType}
                onValueChange={(v) => set("employmentType", v)}
              >
                <SelectTrigger
                  data-ocid="employees.form.employmentType_select"
                  className={errors.employmentType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmploymentType.FullTime}>
                    Full-time
                  </SelectItem>
                  <SelectItem value={EmploymentType.Contract}>
                    Contract
                  </SelectItem>
                  <SelectItem value={EmploymentType.Temporary}>
                    Temporary
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.employmentType && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="employees.form.employmentType.field_error"
                >
                  {errors.employmentType}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-foreground">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.empStatus}
                onValueChange={(v) => set("empStatus", v)}
              >
                <SelectTrigger
                  data-ocid="employees.form.empStatus_select"
                  className={errors.empStatus ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={EmployeeStatus.Active}>Active</SelectItem>
                  <SelectItem value={EmployeeStatus.Inactive}>
                    Inactive
                  </SelectItem>
                  <SelectItem value={EmployeeStatus.Resigned}>
                    Resigned
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.empStatus && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="employees.form.empStatus.field_error"
                >
                  {errors.empStatus}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
            data-ocid="employees.add.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            data-ocid="employees.add.submit_button"
          >
            {isSaving ? "Saving…" : "Add Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

const ALL = "__all__" as const;

export default function EmployeesPage() {
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();

  // filter state
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState<string>(ALL);
  const [filterSite, setFilterSite] = useState<string>(ALL);
  const [filterStatus, setFilterStatus] = useState<EmployeeStatus | typeof ALL>(
    ALL,
  );

  // modal & detail state
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState<EmployeeView | null>(null);

  // debounced search ref (send to backend after 400ms)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  function handleSearchChange(v: string) {
    setSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(v), 400);
  }

  // ── fetch employees ──────────────────────────────────────────────────────
  const {
    data: employees,
    isLoading,
    isError,
  } = useQuery<EmployeeView[]>({
    queryKey: [
      "employees",
      filterDept,
      filterSite,
      filterStatus,
      debouncedSearch,
    ],
    queryFn: async () => {
      if (!actor || !token) return [];
      const r = await actor.listEmployees(
        token,
        filterDept === ALL ? null : filterDept,
        filterSite === ALL ? null : filterSite,
        filterStatus === ALL ? null : filterStatus,
        debouncedSearch.trim() || null,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: isReady,
    staleTime: 30_000,
  });

  // ── derived filter options from data ────────────────────────────────────
  const { departments, sites } = useMemo(() => {
    const depts = new Set<string>();
    const sts = new Set<string>();
    for (const e of employees ?? []) {
      if (e.department) depts.add(e.department);
      if (e.site) sts.add(e.site);
    }
    return { departments: [...depts].sort(), sites: [...sts].sort() };
  }, [employees]);

  // ── add employee mutation ────────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: async (input: AddEmployeeInput) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const r = await actor.addEmployee(token, input);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (emp) => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast.success(`Employee ${emp.empCode} added successfully.`);
      setAddOpen(false);
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to add employee."),
  });

  // ── row skeleton ─────────────────────────────────────────────────────────
  const SkeletonRows = () => (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          {Array.from({ length: 8 }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <Skeleton className="h-4 w-full rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-5" data-ocid="employees.page">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="section-header mb-0 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Employee Master
        </h1>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => exportCSV(employees ?? [])}
            disabled={!employees || employees.length === 0}
            data-ocid="employees.export_button"
            className="gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => setAddOpen(true)}
            data-ocid="employees.add_button"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="elevated-card rounded-xl px-4 py-3 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search name or code…"
            className="pl-9 h-9"
            data-ocid="employees.search_input"
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Department */}
        <Select value={filterDept} onValueChange={setFilterDept}>
          <SelectTrigger
            className="w-[160px] h-9 text-sm"
            data-ocid="employees.filter.dept_select"
          >
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Site */}
        <Select value={filterSite} onValueChange={setFilterSite}>
          <SelectTrigger
            className="w-[140px] h-9 text-sm"
            data-ocid="employees.filter.site_select"
          >
            <SelectValue placeholder="All Sites" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Sites</SelectItem>
            {sites.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filterStatus}
          onValueChange={(v) =>
            setFilterStatus(v as EmployeeStatus | typeof ALL)
          }
        >
          <SelectTrigger
            className="w-[130px] h-9 text-sm"
            data-ocid="employees.filter.status_select"
          >
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Statuses</SelectItem>
            <SelectItem value={EmployeeStatus.Active}>Active</SelectItem>
            <SelectItem value={EmployeeStatus.Inactive}>Inactive</SelectItem>
            <SelectItem value={EmployeeStatus.Resigned}>Resigned</SelectItem>
          </SelectContent>
        </Select>

        {/* Count badge */}
        {!isLoading && employees && (
          <span className="ml-auto text-sm text-muted-foreground">
            {employees.length}{" "}
            {employees.length === 1 ? "employee" : "employees"}
          </span>
        )}
      </div>

      {/* ── Table ── */}
      <div className="elevated-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-left">
                <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                  Code
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                  Full Name
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                  Department
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                  Designation
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                  Site
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                  Status
                </th>
                <th className="px-4 py-3 font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                  Joining Date
                </th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SkeletonRows />
              ) : isError ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center"
                    data-ocid="employees.error_state"
                  >
                    <p className="text-destructive font-medium">
                      Failed to load employees.
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Check your connection and try again.
                    </p>
                  </td>
                </tr>
              ) : !employees || employees.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-16 text-center"
                    data-ocid="employees.empty_state"
                  >
                    <Users className="w-10 h-10 text-muted/60 mx-auto mb-3" />
                    <p className="text-foreground font-medium">
                      No employees found
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      {search ||
                      filterDept !== ALL ||
                      filterSite !== ALL ||
                      filterStatus !== ALL
                        ? "Try adjusting your filters."
                        : "Add your first employee to get started."}
                    </p>
                    {!(
                      search ||
                      filterDept !== ALL ||
                      filterSite !== ALL ||
                      filterStatus !== ALL
                    ) && (
                      <Button
                        type="button"
                        size="sm"
                        className="mt-4"
                        onClick={() => setAddOpen(true)}
                        data-ocid="employees.empty_state.add_button"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Employee
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                employees.map((emp, idx) => (
                  <tr
                    key={emp.empCode}
                    data-ocid={`employees.item.${idx + 1}`}
                    onClick={() => setSelected(emp)}
                    onKeyDown={(e) => e.key === "Enter" && setSelected(emp)}
                    tabIndex={0}
                    className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-primary">
                        {emp.empCode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground truncate max-w-[160px] block">
                        {emp.fullName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[120px]">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground truncate max-w-[140px]">
                      {emp.designation}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {emp.site}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`${STATUS_BADGE[emp.empStatus]} text-xs`}
                      >
                        {STATUS_LABELS[emp.empStatus]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {formatDate(emp.joiningDate)}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail panel ── */}
      {selected && actor && token && (
        <DetailPanel
          employee={selected}
          onClose={() => setSelected(null)}
          token={token}
          actor={actor}
        />
      )}

      {/* ── Add modal ── */}
      <AddEmployeeModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(input) => addMutation.mutateAsync(input).then(() => undefined)}
        isSaving={addMutation.isPending}
      />
    </div>
  );
}
