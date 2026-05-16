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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  KeyRound,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldOff,
  UserCog,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { UserStatus } from "../backend";
import type { CreateUserInput, UserView } from "../backend";
import { DEPARTMENTS } from "../constants/locations";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import { ROLE_LABELS, Role, validatePassword } from "../types";

const PROTECTED_ID = 230034n;

const ALL_ROLES: Role[] = [
  Role.SystemAdmin,
  Role.Employee,
  Role.SafetyOfficer,
  Role.HOD,
  Role.AreaInCharge,
  Role.ContractorAdmin,
];

function formatTimestamp(ts?: bigint): string {
  if (!ts) return "—";
  const ms = Number(ts);
  if (ms === 0) return "—";
  return new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: UserStatus }) {
  return status === UserStatus.Active ? (
    <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
      Active
    </Badge>
  ) : (
    <Badge variant="outline" className="text-muted-foreground border-border">
      Inactive
    </Badge>
  );
}

interface CreateUserForm {
  fullName: string;
  employeeId: string;
  email: string;
  department: string;
  designation: string;
  role: Role;
  password: string;
  confirmPassword: string;
}

const INITIAL_CREATE_FORM: CreateUserForm = {
  fullName: "",
  employeeId: "",
  email: "",
  department: "",
  designation: "",
  role: Role.Employee,
  password: "",
  confirmPassword: "",
};

export default function UsersPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { actor, token, isReady } = useBackend();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "ALL">("ALL");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "ALL">("ALL");

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] =
    useState<CreateUserForm>(INITIAL_CREATE_FORM);
  const [createErrors, setCreateErrors] = useState<Partial<CreateUserForm>>({});

  const [resetTarget, setResetTarget] = useState<UserView | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  // ── Data fetch ────────────────────────────────────────────────────────────
  const {
    data: users,
    isLoading,
    isError,
  } = useQuery<UserView[]>({
    queryKey: ["users", filterRole, filterDept, filterStatus],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listUsers(
        token,
        filterRole !== "ALL" ? filterRole : null,
        filterDept.trim() || null,
        filterStatus !== "ALL" ? filterStatus : null,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
  });

  // ── Derived: client-side search on top of server filters ──────────────────
  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        String(u.employeeId).includes(q),
    );
  }, [users, search]);

  // ── Unique departments for filter dropdown ────────────────────────────────
  const departments = useMemo(() => {
    if (!users) return [];
    const s = new Set(users.map((u) => u.department));
    return Array.from(s).sort();
  }, [users]);

  // ── Create user ───────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: async (input: CreateUserInput) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createUser(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (u) => {
      toast.success(`User ${u.fullName} created successfully.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setShowCreate(false);
      setCreateForm(INITIAL_CREATE_FORM);
    },
    onError: (e: Error) => {
      toast.error(e.message ?? "Failed to create user.");
    },
  });

  // ── Reset password ────────────────────────────────────────────────────────
  const resetMutation = useMutation({
    mutationFn: async ({
      target,
      password,
    }: { target: UserView; password: string }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.resetPassword(token, target.employeeId, password);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Password reset successfully.");
      setResetTarget(null);
      setNewPassword("");
    },
    onError: (e: Error) => {
      toast.error(e.message ?? "Failed to reset password.");
    },
  });

  // ── Toggle status ─────────────────────────────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: async ({
      target,
      newStatus,
    }: { target: UserView; newStatus: UserStatus }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.setUserStatus(
        token,
        target.employeeId,
        newStatus,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_data, { target, newStatus }) => {
      toast.success(
        `${target.fullName} has been ${newStatus === UserStatus.Active ? "reactivated" : "deactivated"}.`,
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (e: Error) => {
      toast.error(e.message ?? "Failed to update user status.");
    },
  });

  // Guard — all hooks called above
  if (user && user.role !== Role.SystemAdmin) {
    navigate({ to: "/dashboard" });
    return null;
  }

  // ── Form validation ───────────────────────────────────────────────────────
  function validateCreate(): boolean {
    const errs: Partial<CreateUserForm> = {};
    if (!createForm.fullName.trim()) errs.fullName = "Full name is required.";
    if (!createForm.employeeId.trim() || !/^\d+$/.test(createForm.employeeId))
      errs.employeeId = "Employee ID must be a numeric value.";
    if (
      !createForm.email.trim() ||
      !/^[^@]+@[^@]+\.[^@]+$/.test(createForm.email)
    )
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
      password: createForm.password,
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6" data-ocid="users.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <UserCog className="w-6 h-6 text-primary" />
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage system users, roles, and access.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setCreateForm(INITIAL_CREATE_FORM);
            setCreateErrors({});
            setShowCreate(true);
          }}
          className="gap-2"
          data-ocid="users.open_modal_button"
        >
          <Plus className="w-4 h-4" /> New User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-card border border-border rounded-lg p-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search name or Employee ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="users.search_input"
          />
        </div>
        <Select
          value={filterRole}
          onValueChange={(v) => setFilterRole(v as Role | "ALL")}
        >
          <SelectTrigger className="w-44" data-ocid="users.role_filter.select">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            {ALL_ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {ROLE_LABELS[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterDept || "ALL"}
          onValueChange={(v) => setFilterDept(v === "ALL" ? "" : v)}
        >
          <SelectTrigger className="w-44" data-ocid="users.dept_filter.select">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d} value={d}>
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterStatus}
          onValueChange={(v) => setFilterStatus(v as UserStatus | "ALL")}
        >
          <SelectTrigger
            className="w-36"
            data-ocid="users.status_filter.select"
          >
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value={UserStatus.Active}>Active</SelectItem>
            <SelectItem value={UserStatus.Inactive}>Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Employee ID
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Full Name
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Role
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Department
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                  Last Login
                </th>
                <th className="text-right px-4 py-3 text-muted-foreground font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              {isError && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center"
                    data-ocid="users.error_state"
                  >
                    <p className="text-destructive font-medium">
                      Failed to load users.
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Check your connection and try again.
                    </p>
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-16 text-center"
                    data-ocid="users.empty_state"
                  >
                    <UserCog className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">
                      No users found.
                    </p>
                    <p className="text-muted-foreground/60 text-xs mt-1">
                      Adjust your filters or create a new user.
                    </p>
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                filtered.map((u, idx) => {
                  const isProtected = u.employeeId === PROTECTED_ID;
                  return (
                    <tr
                      key={String(u.employeeId)}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`users.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-foreground">
                        {String(u.employeeId)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">
                          {u.fullName}
                        </span>
                        {isProtected && (
                          <Badge className="ml-2 text-[10px] bg-secondary/20 text-secondary border-secondary/30">
                            Protected
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <Badge className="text-[10px] bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30">
                            {ROLE_LABELS[u.role]}
                          </Badge>
                          {isProtected &&
                            u.roles
                              ?.filter((r) => r !== Role.SystemAdmin)
                              .map((r) => (
                                <Badge
                                  key={r}
                                  className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                                >
                                  {ROLE_LABELS[r as Role] ?? r}
                                </Badge>
                              ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {u.department}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={u.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {formatTimestamp(u.lastLogin)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="gap-1 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setResetTarget(u);
                              setNewPassword("");
                              setNewPasswordError("");
                            }}
                            data-ocid={`users.reset_password.${idx + 1}`}
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            Reset
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={isProtected || statusMutation.isPending}
                            className={`gap-1 ${
                              u.status === UserStatus.Active
                                ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                                : "text-primary hover:text-primary hover:bg-primary/10"
                            }`}
                            onClick={() =>
                              statusMutation.mutate({
                                target: u,
                                newStatus:
                                  u.status === UserStatus.Active
                                    ? UserStatus.Inactive
                                    : UserStatus.Active,
                              })
                            }
                            title={
                              isProtected
                                ? "Protected account cannot be deactivated"
                                : undefined
                            }
                            data-ocid={`users.toggle_status.${idx + 1}`}
                          >
                            {u.status === UserStatus.Active ? (
                              <>
                                <ShieldOff className="w-3.5 h-3.5" /> Deactivate
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" />{" "}
                                Reactivate
                              </>
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Create User Modal ─────────────────────────────────────────────── */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent
          className="max-w-lg bg-card border-border"
          data-ocid="users.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Plus className="w-5 h-5 text-primary" /> Create New User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="cu-name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="cu-name"
                placeholder="e.g. Rajan Pillai"
                value={createForm.fullName}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, fullName: e.target.value }))
                }
                data-ocid="users.create.name.input"
              />
              {createErrors.fullName && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="users.create.name.field_error"
                >
                  {createErrors.fullName}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cu-eid" className="text-foreground">
                Employee ID
              </Label>
              <Input
                id="cu-eid"
                inputMode="numeric"
                placeholder="Numeric only, e.g. 100042"
                value={createForm.employeeId}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    employeeId: e.target.value.replace(/\D/g, ""),
                  }))
                }
                data-ocid="users.create.employee_id.input"
              />
              {createErrors.employeeId && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="users.create.employee_id.field_error"
                >
                  {createErrors.employeeId}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cu-email" className="text-foreground">
                Email
              </Label>
              <Input
                id="cu-email"
                type="email"
                placeholder="e.g. rajan@rktrwheels.com"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, email: e.target.value }))
                }
                data-ocid="users.create.email.input"
              />
              {createErrors.email && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="users.create.email.field_error"
                >
                  {createErrors.email}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cu-dept" className="text-foreground">
                  Department
                </Label>
                <select
                  id="cu-dept"
                  value={createForm.department}
                  onChange={(e) =>
                    setCreateForm((f) => ({ ...f, department: e.target.value }))
                  }
                  data-ocid="users.create.department.select"
                  className="w-full rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="" disabled>
                    Select Department
                  </option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {createErrors.department && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="users.create.department.field_error"
                  >
                    {createErrors.department}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cu-desg" className="text-foreground">
                  Designation
                </Label>
                <Input
                  id="cu-desg"
                  placeholder="e.g. Supervisor"
                  value={createForm.designation}
                  onChange={(e) =>
                    setCreateForm((f) => ({
                      ...f,
                      designation: e.target.value,
                    }))
                  }
                  data-ocid="users.create.designation.input"
                />
                {createErrors.designation && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="users.create.designation.field_error"
                  >
                    {createErrors.designation}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Role</Label>
              <Select
                value={createForm.role}
                onValueChange={(v) =>
                  setCreateForm((f) => ({ ...f, role: v as Role }))
                }
              >
                <SelectTrigger data-ocid="users.create.role.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cu-pwd" className="text-foreground">
                Password
              </Label>
              <Input
                id="cu-pwd"
                type="password"
                placeholder="Min 8 chars, upper, number, special"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, password: e.target.value }))
                }
                data-ocid="users.create.password.input"
              />
              {createErrors.password && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="users.create.password.field_error"
                >
                  {createErrors.password}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cu-cpwd" className="text-foreground">
                Confirm Password
              </Label>
              <Input
                id="cu-cpwd"
                type="password"
                placeholder="Repeat password"
                value={createForm.confirmPassword}
                onChange={(e) =>
                  setCreateForm((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
                data-ocid="users.create.confirm_password.input"
              />
              {createErrors.confirmPassword && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="users.create.confirm_password.field_error"
                >
                  {createErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreate(false)}
              data-ocid="users.create.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateSubmit}
              disabled={createMutation.isPending}
              className="gap-2"
              data-ocid="users.create.submit_button"
            >
              {createMutation.isPending && (
                <RefreshCw className="w-4 h-4 animate-spin" />
              )}
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reset Password Modal ──────────────────────────────────────────── */}
      <Dialog
        open={!!resetTarget}
        onOpenChange={(open) => {
          if (!open) setResetTarget(null);
        }}
      >
        <DialogContent
          className="max-w-sm bg-card border-border"
          data-ocid="users.reset.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <KeyRound className="w-5 h-5 text-secondary" /> Reset Password
            </DialogTitle>
          </DialogHeader>
          {resetTarget && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Setting new password for{" "}
                <span className="font-semibold text-foreground">
                  {resetTarget.fullName}
                </span>{" "}
                (ID: {String(resetTarget.employeeId)})
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="rp-pwd" className="text-foreground">
                  New Password
                </Label>
                <Input
                  id="rp-pwd"
                  type="password"
                  placeholder="Min 8 chars, upper, number, special"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setNewPasswordError("");
                  }}
                  data-ocid="users.reset.password.input"
                />
                {newPasswordError && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="users.reset.password.field_error"
                  >
                    {newPasswordError}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetTarget(null)}
              data-ocid="users.reset.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleResetSubmit}
              disabled={resetMutation.isPending}
              className="gap-2"
              data-ocid="users.reset.confirm_button"
            >
              {resetMutation.isPending && (
                <RefreshCw className="w-4 h-4 animate-spin" />
              )}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
