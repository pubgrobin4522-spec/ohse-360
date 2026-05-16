import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Link2,
  Plus,
  RefreshCw,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import type React from "react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  ContractorDocStatus,
  ContractorStatus,
  type ContractorView,
  InductionStatus,
  PerformanceRating,
  Role,
} from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackendCall } from "../hooks/useBackend";

// ─── helpers ────────────────────────────────────────────────────────────────

function canManage(role: Role) {
  return [Role.SafetyOfficer, Role.SystemAdmin, Role.ContractorAdmin].includes(
    role,
  );
}

function fmtDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

function docStatusColor(s: ContractorDocStatus) {
  if (s === ContractorDocStatus.Valid) return "text-emerald-400";
  if (s === ContractorDocStatus.Expiring) return "text-amber-400";
  return "text-red-400";
}

function contractorStatusBadge(s: ContractorStatus) {
  if (s === ContractorStatus.Active)
    return (
      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
        Active
      </Badge>
    );
  if (s === ContractorStatus.Expired)
    return (
      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
        Expired
      </Badge>
    );
  return (
    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
      Blacklisted
    </Badge>
  );
}

function inductionBadge(s: InductionStatus) {
  if (s === InductionStatus.Pass)
    return (
      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
        Pass
      </Badge>
    );
  if (s === InductionStatus.Fail)
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
        Fail
      </Badge>
    );
  return (
    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
      Pending
    </Badge>
  );
}

// ─── stat card ───────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = "cyan",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: "cyan" | "red" | "emerald" | "amber";
}) {
  const colors: Record<string, string> = {
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex gap-4 items-center">
      <div className={`rounded-lg border p-3 ${colors[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── register contractor dialog ──────────────────────────────────────────────

function RegisterContractorDialog({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { call } = useBackendCall();
  const [form, setForm] = useState({
    companyName: "",
    registrationNumber: "",
    contactPerson: "",
    email: "",
    phone: "",
    typeOfWork: "",
    contractStartDate: "",
    contractEndDate: "",
  });
  const [saving, setSaving] = useState(false);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await call((a, t) => a.createContractor(t, form));
      if ("err" in r) throw new Error(r.err);
      toast.success(`Contractor registered: ${r.ok}`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-slate-900 border-white/10 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Register New Contractor
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["companyName", "Company Name"],
                ["registrationNumber", "Registration Number"],
                ["contactPerson", "Contact Person"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["typeOfWork", "Type of Work"],
                ["contractStartDate", "Contract Start Date"],
                ["contractEndDate", "Contract End Date"],
              ] as [keyof typeof form, string][]
            ).map(([k, lbl]) => (
              <div key={k}>
                <Label className="text-xs text-muted-foreground mb-1 block">
                  {lbl}
                </Label>
                <Input
                  type={k.includes("Date") ? "date" : "text"}
                  value={form[k]}
                  onChange={set(k)}
                  required
                  className="bg-white/5 border-white/10 text-foreground h-8 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/10"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {saving ? "Registering…" : "Register"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── add document dialog ──────────────────────────────────────────────────────

const DOC_TYPES = [
  "Trade License",
  "Insurance Certificate",
  "DOSH Registration",
  "Safety Plan",
];

function AddDocumentDialog({
  open,
  contractorId,
  onClose,
  onSuccess,
}: {
  open: boolean;
  contractorId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { call } = useBackendCall();
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [expiryDate, setExpiryDate] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await call((a, t) =>
        a.addContractorDocument(t, contractorId, docType, expiryDate),
      );
      if ("err" in r) throw new Error(r.err);
      toast.success("Document added");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-slate-900 border-white/10 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 mt-2">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Document Type
            </Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger className="bg-white/5 border-white/10 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10">
                {DOC_TYPES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">
              Expiry Date
            </Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-foreground"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="border-white/10"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {saving ? "Adding…" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── add employee dialog ──────────────────────────────────────────────────────

function AddEmployeeDialog({
  open,
  contractorId,
  onClose,
  onSuccess,
}: {
  open: boolean;
  contractorId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { call } = useBackendCall();
  const [form, setForm] = useState({ empName: "", idNumber: "", trade: "" });
  const [saving, setSaving] = useState(false);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await call((a, t) =>
        a.addContractorEmployee(t, contractorId, {
          ...form,
          inductionStatus: InductionStatus.Pending,
          inductionDate: undefined,
          certificateNumber: undefined,
        }),
      );
      if ("err" in r) throw new Error(r.err);
      toast.success("Employee added");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-slate-900 border-white/10 max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Add Contractor Employee
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 mt-2">
          {(["empName", "idNumber", "trade"] as const).map((k) => (
            <div key={k}>
              <Label className="text-xs text-muted-foreground mb-1 block capitalize">
                {k === "empName"
                  ? "Employee Name"
                  : k === "idNumber"
                    ? "ID Number"
                    : "Trade / Skill"}
              </Label>
              <Input
                value={form[k]}
                onChange={set(k)}
                required
                className="bg-white/5 border-white/10 text-foreground"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="border-white/10"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {saving ? "Adding…" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── detail tabs ─────────────────────────────────────────────────────────────

function ContractorDetail({
  contractor,
  onRefresh,
}: {
  contractor: ContractorView;
  onRefresh: () => void;
}) {
  const { call } = useBackendCall();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [inductingEmp, setInductingEmp] = useState<string | null>(null);
  const [inductResult, setInductResult] = useState<Record<string, string>>({});
  const [perfForm, setPerfForm] = useState({
    safetyScore: 75,
    incidentCount: 0,
    nearMissCount: 0,
    ptwCompliance: 90,
    trainingCompliance: 85,
    overallRating: PerformanceRating.Good,
  });
  const [savingPerf, setSavingPerf] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  const canEdit = user ? canManage(user.role) : false;

  const linkedPtwQuery = useQuery({
    queryKey: ["ptw-list"],
    queryFn: async () => {
      const r = await call((a, t) => a.listPTWs(t, null, null));
      if ("err" in r) throw new Error(r.err);
      return r.ok;
    },
  });

  const linkedPtws = (linkedPtwQuery.data ?? []).filter((p) =>
    contractor.linkedPtwNumbers.includes(p.id),
  );

  const updateStatus = async (status: ContractorStatus) => {
    setSavingStatus(true);
    try {
      const r = await call((a, t) =>
        a.updateContractorStatus(t, contractor.contractorId, status),
      );
      if ("err" in r) throw new Error(r.err);
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["contractors"] });
      qc.invalidateQueries({
        queryKey: ["contractor", contractor.contractorId],
      });
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSavingStatus(false);
    }
  };

  const recordInduction = async (idNumber: string, passed: boolean) => {
    try {
      const r = await call((a, t) =>
        a.recordInduction(t, contractor.contractorId, idNumber, passed),
      );
      if ("err" in r) throw new Error(r.err);
      setInductResult((prev) => ({
        ...prev,
        [idNumber]: passed ? ("ok" in r ? r.ok : "CONIND-PASS") : "FAIL",
      }));
      toast.success(
        passed
          ? `Induction passed — cert: ${"ok" in r ? r.ok : ""}`
          : "Induction failed — recorded",
      );
      qc.invalidateQueries({ queryKey: ["contractors"] });
      qc.invalidateQueries({
        queryKey: ["contractor", contractor.contractorId],
      });
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setInductingEmp(null);
    }
  };

  const submitPerf = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPerf(true);
    try {
      const r = await call((a, t) =>
        a.recordContractorPerformance(t, contractor.contractorId, {
          safetyScore: BigInt(perfForm.safetyScore),
          incidentCount: BigInt(perfForm.incidentCount),
          nearMissCount: BigInt(perfForm.nearMissCount),
          ptwCompliance: perfForm.ptwCompliance,
          trainingCompliance: perfForm.trainingCompliance,
          overallRating: perfForm.overallRating,
          evaluatedAt: BigInt(Date.now()) * 1_000_000n,
          evaluatedBy: BigInt(user?.employeeId ?? 0),
        }),
      );
      if ("err" in r) throw new Error(r.err);
      toast.success("Performance evaluation recorded");
      qc.invalidateQueries({
        queryKey: ["contractor", contractor.contractorId],
      });
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSavingPerf(false);
    }
  };

  const docAlerts = contractor.documents.filter(
    (d) => d.status !== ContractorDocStatus.Valid,
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      {/* Header */}
      <div className="p-5 border-b border-white/10 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {contractor.companyName}
            </h2>
            {contractorStatusBadge(contractor.status)}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {contractor.contractorId} · {contractor.typeOfWork}
          </p>
        </div>
        {docAlerts.length > 0 && (
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-amber-400 text-xs">
            <AlertTriangle className="h-3.5 w-3.5" />
            {docAlerts.length} document alert{docAlerts.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <Tabs defaultValue="info" className="p-5">
        <TabsList className="bg-white/5 border border-white/10 mb-5">
          <TabsTrigger value="info" data-ocid="contractor.tab.info">
            Company Info
          </TabsTrigger>
          <TabsTrigger value="docs" data-ocid="contractor.tab.docs">
            Documents{" "}
            {docAlerts.length > 0 && (
              <span className="ml-1 bg-amber-500/20 text-amber-400 rounded-full px-1.5 text-xs">
                {docAlerts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="employees" data-ocid="contractor.tab.employees">
            Employees
          </TabsTrigger>
          <TabsTrigger value="ptw" data-ocid="contractor.tab.ptw">
            Linked PTWs
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            data-ocid="contractor.tab.performance"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        {/* TAB A — COMPANY INFO */}
        <TabsContent value="info">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["Registration No.", contractor.registrationNumber],
              ["Contact Person", contractor.contactPerson],
              ["Email", contractor.email],
              ["Phone", contractor.phone],
              ["Type of Work", contractor.typeOfWork],
              ["Contract Start", contractor.contractStartDate],
              ["Contract End", contractor.contractEndDate],
              ["Created", fmtDate(contractor.createdAt)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg bg-white/5 p-3">
                <p className="text-xs text-muted-foreground mb-1">{k}</p>
                <p className="text-foreground font-medium">{v}</p>
              </div>
            ))}
          </div>
          {canEdit && (
            <div className="mt-5">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Update Status
              </Label>
              <div className="flex gap-2">
                {[
                  ContractorStatus.Active,
                  ContractorStatus.Expired,
                  ContractorStatus.Blacklisted,
                ].map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    disabled={savingStatus || contractor.status === s}
                    onClick={() => updateStatus(s)}
                    data-ocid={`contractor.status_${s.toLowerCase()}_button`}
                    className={
                      s === ContractorStatus.Active
                        ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/50"
                        : s === ContractorStatus.Expired
                          ? "bg-amber-600/30 text-amber-400 border border-amber-500/30 hover:bg-amber-600/50"
                          : "bg-red-600/30 text-red-400 border border-red-500/30 hover:bg-red-600/50"
                    }
                  >
                    {s === contractor.status && "✓ "}
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* TAB B — DOCUMENTS */}
        <TabsContent value="docs">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-foreground">
              Compliance Documents
            </h3>
            {canEdit && (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowAddDoc(true)}
                className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/40"
                data-ocid="contractor.add_doc_button"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Document
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {DOC_TYPES.map((dt) => {
              const doc = contractor.documents.find((d) => d.docType === dt);
              return (
                <div
                  key={dt}
                  className={`flex items-center justify-between rounded-lg border p-3 ${
                    !doc
                      ? "border-white/10 bg-white/5"
                      : doc.status === ContractorDocStatus.Expired
                        ? "border-red-500/30 bg-red-500/5"
                        : doc.status === ContractorDocStatus.Expiring
                          ? "border-amber-500/30 bg-amber-500/5"
                          : "border-emerald-500/20 bg-emerald-500/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText
                      className={`h-4 w-4 ${doc ? docStatusColor(doc.status) : "text-muted-foreground"}`}
                    />
                    <div>
                      <p className="text-sm text-foreground">{dt}</p>
                      {doc ? (
                        <p className="text-xs text-muted-foreground">
                          Expires: {doc.expiryDate}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Not uploaded
                        </p>
                      )}
                    </div>
                  </div>
                  {doc ? (
                    <Badge
                      className={
                        doc.status === ContractorDocStatus.Valid
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : doc.status === ContractorDocStatus.Expiring
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {doc.status}
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                      Missing
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          <AddDocumentDialog
            open={showAddDoc}
            contractorId={contractor.contractorId}
            onClose={() => setShowAddDoc(false)}
            onSuccess={onRefresh}
          />
        </TabsContent>

        {/* TAB C — EMPLOYEES */}
        <TabsContent value="employees">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-foreground">
              Registered Employees
            </h3>
            {canEdit && (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowAddEmp(true)}
                className="bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/40"
                data-ocid="contractor.add_employee_button"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Employee
              </Button>
            )}
          </div>
          {contractor.employees.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="contractor.employees.empty_state"
            >
              <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No employees registered</p>
            </div>
          ) : (
            <div className="space-y-2">
              {contractor.employees.map((emp, i) => (
                <div
                  key={emp.idNumber}
                  data-ocid={`contractor.employee.item.${i + 1}`}
                  className={`rounded-lg border p-3 ${
                    emp.inductionStatus === InductionStatus.Fail
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {emp.empName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {emp.idNumber} · {emp.trade}
                      </p>
                      {emp.inductionDate && (
                        <p className="text-xs text-muted-foreground">
                          Inducted: {emp.inductionDate}
                        </p>
                      )}
                      {emp.certificateNumber && (
                        <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                          <Award className="h-3 w-3" /> {emp.certificateNumber}
                        </p>
                      )}
                      {inductResult[emp.idNumber] && (
                        <p
                          className={`text-xs mt-1 font-medium ${
                            inductResult[emp.idNumber] === "FAIL"
                              ? "text-red-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {inductResult[emp.idNumber] === "FAIL"
                            ? "✗ Induction Failed"
                            : `✓ Cert: ${inductResult[emp.idNumber]}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {inductionBadge(emp.inductionStatus)}
                      {canEdit &&
                        emp.inductionStatus === InductionStatus.Pending &&
                        (inductingEmp === emp.idNumber ? (
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                recordInduction(emp.idNumber, true)
                              }
                              data-ocid={`contractor.induction_pass_button.${i + 1}`}
                              className="bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/50 h-7 text-xs"
                            >
                              Pass
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                recordInduction(emp.idNumber, false)
                              }
                              data-ocid={`contractor.induction_fail_button.${i + 1}`}
                              className="bg-red-600/30 text-red-400 border border-red-500/30 hover:bg-red-600/50 h-7 text-xs"
                            >
                              Fail
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setInductingEmp(null)}
                              className="h-7 text-xs text-muted-foreground"
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => setInductingEmp(emp.idNumber)}
                            data-ocid={`contractor.record_induction_button.${i + 1}`}
                            className="bg-white/10 text-foreground border border-white/20 hover:bg-white/20 h-7 text-xs"
                          >
                            Record Induction
                          </Button>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <AddEmployeeDialog
            open={showAddEmp}
            contractorId={contractor.contractorId}
            onClose={() => setShowAddEmp(false)}
            onSuccess={onRefresh}
          />
        </TabsContent>

        {/* TAB D — LINKED PTWs */}
        <TabsContent value="ptw">
          {linkedPtws.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground"
              data-ocid="contractor.ptw.empty_state"
            >
              <Link2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No linked permits</p>
            </div>
          ) : (
            <div className="space-y-2">
              {linkedPtws.map((ptw, i) => (
                <div
                  key={ptw.id}
                  data-ocid={`contractor.ptw.item.${i + 1}`}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {ptw.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ptw.permitType} · {ptw.jobLocation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {ptw.timeStart} → {ptw.timeEnd}
                    </p>
                  </div>
                  <Badge className="text-xs">{ptw.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB E — PERFORMANCE */}
        <TabsContent value="performance">
          {contractor.performance && (
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 mb-5">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                Latest Evaluation —{" "}
                {fmtDate(contractor.performance.evaluatedAt)}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Safety Score", `${contractor.performance.safetyScore}/100`],
                  ["Incidents", String(contractor.performance.incidentCount)],
                  ["Near Misses", String(contractor.performance.nearMissCount)],
                  [
                    "PTW Compliance",
                    `${contractor.performance.ptwCompliance}%`,
                  ],
                  [
                    "Training Compliance",
                    `${contractor.performance.trainingCompliance}%`,
                  ],
                  ["Overall Rating", contractor.performance.overallRating],
                ].map(([k, v]) => (
                  <div key={k} className="rounded bg-white/5 p-2">
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p
                      className={`text-sm font-semibold ${
                        k === "Overall Rating"
                          ? contractor.performance!.overallRating ===
                            PerformanceRating.Excellent
                            ? "text-emerald-400"
                            : contractor.performance!.overallRating ===
                                PerformanceRating.Good
                              ? "text-cyan-400"
                              : contractor.performance!.overallRating ===
                                  PerformanceRating.Fair
                                ? "text-amber-400"
                                : "text-red-400"
                          : "text-foreground"
                      }`}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {canEdit && (
            <form onSubmit={submitPerf} className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Submit New Evaluation
              </h3>
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-xs text-muted-foreground">
                    Safety Compliance Score
                  </Label>
                  <span className="text-sm font-bold text-cyan-400">
                    {perfForm.safetyScore}/100
                  </span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[perfForm.safetyScore]}
                  onValueChange={([v]) =>
                    setPerfForm((f) => ({ ...f, safetyScore: v }))
                  }
                  className="accent-cyan-500"
                  data-ocid="contractor.performance.safety_score_slider"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["incidentCount", "Incidents this period"],
                    ["nearMissCount", "Near Misses"],
                  ] as const
                ).map(([k, lbl]) => (
                  <div key={k}>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      {lbl}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={perfForm[k]}
                      onChange={(e) =>
                        setPerfForm((f) => ({
                          ...f,
                          [k]: Number(e.target.value),
                        }))
                      }
                      className="bg-white/5 border-white/10 text-foreground"
                    />
                  </div>
                ))}
                {(
                  [
                    ["ptwCompliance", "PTW Compliance %"],
                    ["trainingCompliance", "Training Compliance %"],
                  ] as const
                ).map(([k, lbl]) => (
                  <div key={k}>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      {lbl}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={perfForm[k]}
                      onChange={(e) =>
                        setPerfForm((f) => ({
                          ...f,
                          [k]: Number(e.target.value),
                        }))
                      }
                      className="bg-white/5 border-white/10 text-foreground"
                    />
                  </div>
                ))}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Overall Rating
                </Label>
                <div className="flex gap-2">
                  {[
                    PerformanceRating.Poor,
                    PerformanceRating.Fair,
                    PerformanceRating.Good,
                    PerformanceRating.Excellent,
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() =>
                        setPerfForm((f) => ({ ...f, overallRating: r }))
                      }
                      data-ocid={`contractor.performance.rating_${r.toLowerCase()}`}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        perfForm.overallRating === r
                          ? r === PerformanceRating.Excellent
                            ? "bg-emerald-600/40 text-emerald-300 border-emerald-500/50"
                            : r === PerformanceRating.Good
                              ? "bg-cyan-600/40 text-cyan-300 border-cyan-500/50"
                              : r === PerformanceRating.Fair
                                ? "bg-amber-600/40 text-amber-300 border-amber-500/50"
                                : "bg-red-600/40 text-red-300 border-red-500/50"
                          : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                disabled={savingPerf}
                className="bg-cyan-600 hover:bg-cyan-500 text-white w-full"
                data-ocid="contractor.performance.submit_button"
              >
                {savingPerf ? "Saving…" : "Submit Evaluation"}
              </Button>
            </form>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function ContractorPage() {
  const { call } = useBackendCall();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ContractorView | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const canManageRole = user ? canManage(user.role) : false;

  // Stats
  const statsQuery = useQuery({
    queryKey: ["contractor-stats"],
    queryFn: async () => {
      const r = await call((a, t) => a.getContractorStats(t));
      if ("err" in r) throw new Error(r.err);
      return r.ok;
    },
  });

  // List
  const listQuery = useQuery({
    queryKey: ["contractors"],
    queryFn: async () => {
      const r = await call((a, t) => a.listContractors(t));
      if ("err" in r) throw new Error(r.err);
      return r.ok;
    },
  });

  const refreshSelected = useCallback(async () => {
    if (!selected) return;
    try {
      const r = await call((a, t) => a.getContractor(t, selected.contractorId));
      if ("ok" in r) setSelected(r.ok);
    } catch {
      /* ignore */
    }
    qc.invalidateQueries({ queryKey: ["contractors"] });
    qc.invalidateQueries({ queryKey: ["contractor-stats"] });
  }, [selected, call, qc]);

  const contractors = listQuery.data ?? [];
  const filtered = contractors.filter(
    (c) =>
      !search ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.typeOfWork.toLowerCase().includes(search.toLowerCase()) ||
      c.contractorId.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = statsQuery.data;

  function inductionPct(c: ContractorView) {
    if (c.employees.length === 0) return 100;
    const passed = c.employees.filter(
      (e) => e.inductionStatus === InductionStatus.Pass,
    ).length;
    return Math.round((passed / c.employees.length) * 100);
  }

  function docStatus(c: ContractorView): ContractorDocStatus | null {
    if (c.documents.some((d) => d.status === ContractorDocStatus.Expired))
      return ContractorDocStatus.Expired;
    if (c.documents.some((d) => d.status === ContractorDocStatus.Expiring))
      return ContractorDocStatus.Expiring;
    if (c.documents.length > 0) return ContractorDocStatus.Valid;
    return null;
  }

  return (
    <div className="min-h-screen bg-background" data-ocid="contractor.page">
      <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Contractor Safety Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage contractor companies, documents, and compliance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                qc.invalidateQueries({ queryKey: ["contractors"] });
                qc.invalidateQueries({ queryKey: ["contractor-stats"] });
              }}
              className="border-white/10 text-muted-foreground hover:text-foreground"
              data-ocid="contractor.refresh_button"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            {canManageRole && (
              <Button
                type="button"
                onClick={() => setShowRegister(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-white"
                data-ocid="contractor.register_button"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Register New Contractor
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Building2}
            label="Active Contractors"
            value={stats ? Number(stats.activeCount) : "—"}
            accent="cyan"
          />
          <StatCard
            icon={AlertTriangle}
            label="Document Alerts"
            value={stats ? Number(stats.expiringDocs) : "—"}
            accent="red"
          />
          <StatCard
            icon={CheckCircle2}
            label="Induction Compliance"
            value={stats ? `${stats.inductionCompliance}%` : "—"}
            accent="emerald"
          />
          <StatCard
            icon={ShieldAlert}
            label="Incidents (All Time)"
            value={stats ? Number(stats.incidentCount) : "—"}
            accent="amber"
          />
        </div>

        {/* Two-column: list + detail */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Contractor List */}
          <div className="lg:col-span-2 space-y-3">
            <Input
              placeholder="Search contractors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground"
              data-ocid="contractor.search_input"
            />

            {listQuery.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-xl bg-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="text-center py-12 text-muted-foreground"
                data-ocid="contractor.list.empty_state"
              >
                <Building2 className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No contractors found</p>
                {canManageRole && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowRegister(true)}
                    className="mt-3 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30"
                    data-ocid="contractor.list.register_cta"
                  >
                    Register First Contractor
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((c, i) => {
                  const ds = docStatus(c);
                  const ipc = inductionPct(c);
                  const isActive = selected?.contractorId === c.contractorId;
                  return (
                    <button
                      key={c.contractorId}
                      type="button"
                      onClick={() => setSelected(c)}
                      data-ocid={`contractor.list.item.${i + 1}`}
                      className={`w-full text-left rounded-xl border p-3 transition-colors ${
                        isActive
                          ? "border-cyan-500/50 bg-cyan-500/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {c.companyName}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.typeOfWork}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {c.contractorId}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          {contractorStatusBadge(c.status)}
                          {ds && ds !== ContractorDocStatus.Valid && (
                            <Badge
                              className={`text-xs ${
                                ds === ContractorDocStatus.Expired
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              Doc {ds}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span
                          className={
                            ipc < 80 ? "text-amber-400" : "text-emerald-400"
                          }
                        >
                          Induction {ipc}%
                        </span>
                        <span>·</span>
                        <span>{c.employees.length} emp</span>
                        <span>·</span>
                        <span>Ends {c.contractEndDate}</span>
                        <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-3">
            {selected ? (
              <ContractorDetail
                contractor={selected}
                onRefresh={refreshSelected}
              />
            ) : (
              <div
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground"
                data-ocid="contractor.detail.empty_state"
              >
                <Building2 className="h-12 w-12 mb-3 opacity-20" />
                <p className="text-sm font-medium">Select a contractor</p>
                <p className="text-xs mt-1">Click any row to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Register dialog */}
      <RegisterContractorDialog
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onSuccess={() => {
          qc.invalidateQueries({ queryKey: ["contractors"] });
          qc.invalidateQueries({ queryKey: ["contractor-stats"] });
        }}
      />
    </div>
  );
}
