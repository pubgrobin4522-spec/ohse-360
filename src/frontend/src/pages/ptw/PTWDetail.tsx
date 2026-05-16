import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  HardHat,
  Info,
  Loader2,
  MapPin,
  Printer,
  Shield,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { EnergisationRecord, PermitToWorkView } from "../../backend";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import {
  PermitTypeBadge,
  RiskBadge,
  StatusBadge,
  WorkflowTimeline,
  getPermitTypeIcon,
} from "./PTWBadges";
import { DEPARTMENTS, PERMIT_TYPE_LABELS } from "./ptwConstants";

interface Props {
  ptw: PermitToWorkView;
  onBack: () => void;
  onRefresh: () => void;
}

export default function PTWDetail({ ptw, onBack, onRefresh }: Props) {
  const { actor, token } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const userRole = user?.role ?? "Employee";
  const printRef = useRef<HTMLDivElement>(null);

  const [remarks, setRemarks] = useState("");
  const [remarkErr, setRemarkErr] = useState("");
  const [nomineeId, setNomineeId] = useState("");
  const [nomineeErr, setNomineeErr] = useState("");

  // Energisation
  const [elecChecklist, setElecChecklist] = useState<Record<string, boolean>>(
    {},
  );
  const [svcChecklist, setSvcChecklist] = useState<Record<string, boolean>>({});
  const [elecLoto, setElecLoto] = useState("");
  const [svcLoto, setSvcLoto] = useState("");

  const isActive = ptw.status === "Active" || ptw.status === "Approved";
  const isClosed = ptw.status === "Closed";

  // Role-based action flags
  const isAdmin = userRole === "SystemAdmin";
  const canHOD = (userRole === "HOD" || isAdmin) && ptw.status === "HODReview";
  const canArea =
    (userRole === "AreaInCharge" || isAdmin) && ptw.status === "AreaReview";
  const canSafety =
    (userRole === "SafetyOfficer" || isAdmin) && ptw.status === "SafetyReview";
  const canFinal =
    (userRole === "SafetyOfficer" || isAdmin) && ptw.status === "FinalApproval";
  const canIsolation = isAdmin && ptw.status === "IsolationReview";
  const canAct = canHOD || canArea || canSafety || canFinal || canIsolation;
  const needsNominee = canHOD || canArea || canSafety || canIsolation;

  const canClose =
    (userRole === "SafetyOfficer" ||
      userRole === "SystemAdmin" ||
      userRole === "Employee") &&
    (ptw.status === "Active" || ptw.status === "Approved");

  const canSuspend =
    (userRole === "SafetyOfficer" || isAdmin) && ptw.status === "Active";

  function getNomineeLabel() {
    if (canHOD) return "Nominate Area In-Charge Employee Number";
    if (canArea)
      return "Nominate Isolation Authority / Safety Officer Employee Number";
    if (canIsolation) return "Nominate Safety Officer Employee Number";
    if (canSafety) return "Nominate Final Issuer Employee Number";
    return "";
  }

  const approveMutation = useMutation({
    mutationFn: async ({ approve }: { approve: boolean }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      if (!approve && !remarks.trim()) {
        setRemarkErr("Rejection remarks are required.");
        throw new Error("");
      }
      setRemarkErr("");
      if (approve && needsNominee && !nomineeId.trim()) {
        setNomineeErr("Nominee Employee Number is required.");
        throw new Error("");
      }
      setNomineeErr("");
      const nom = BigInt(nomineeId.trim() || "0");
      const rem = remarks.trim();

      if (!approve) {
        const res = await actor.rejectPTW(token, ptw.id, rem);
        if (res.__kind__ === "err") throw new Error(res.err);
        return;
      }

      let res: { __kind__: string; ok?: null; err?: string } | undefined;
      if (canHOD) res = await actor.approvePTWHOD(token, ptw.id, rem, nom);
      else if (canArea)
        res = await actor.approvePTWAreaInCharge(token, ptw.id, rem, nom);
      else if (canIsolation)
        res = await actor.approvePTWIsolationAuthority(token, ptw.id, rem, nom);
      else if (canSafety)
        res = await actor.approvePTWSafetyOfficer(token, ptw.id, rem, nom);
      else if (canFinal)
        res = await actor.approvePTWFinalIssuer(token, ptw.id, rem);
      else throw new Error("No approval action available");

      if (res?.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_d, { approve }) => {
      toast.success(approve ? "Permit approved." : "Permit rejected.");
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onRefresh();
      setRemarks("");
      setNomineeId("");
    },
    onError: (e: Error) => {
      if (e.message) toast.error(e.message);
    },
  });

  const closeMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.closePTW(token, ptw.id);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Permit closed.");
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onRefresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const suspendMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      if (!remarks.trim()) {
        setRemarkErr("Reason required.");
        throw new Error("");
      }
      const res = await actor.suspendPTW(token, ptw.id, remarks.trim());
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Permit suspended.");
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onRefresh();
    },
    onError: (e: Error) => {
      if (e.message) toast.error(e.message);
    },
  });

  const energiseMutation = useMutation({
    mutationFn: async (type: "Electrical" | "ServiceProcess") => {
      if (!actor || !token) throw new Error("Not authenticated");
      const checklist = type === "Electrical" ? elecChecklist : svcChecklist;
      const loto = type === "Electrical" ? elecLoto : svcLoto;
      const record: EnergisationRecord = {
        energisationType: type,
        approverEmployeeId: user?.employeeId ?? BigInt(0),
        approverName: user?.name ?? "",
        checklistItems: Object.entries(checklist).map(
          ([k, v]) => [k, v] as [string, boolean],
        ),
        lotoLockNumber: loto,
        signature: `Signed by ${user?.name ?? ""} at ${new Date().toISOString()}`,
      };
      const res = await actor.recordEnergisation(token, ptw.id, record);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_d, type) => {
      toast.success(`${type} energisation recorded.`);
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onRefresh();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handlePrint() {
    window.print();
  }

  const isBusy =
    approveMutation.isPending ||
    closeMutation.isPending ||
    suspendMutation.isPending ||
    energiseMutation.isPending;

  return (
    <div className="space-y-5" data-ocid="ptw.detail_view" ref={printRef}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between print:hidden">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-slate-400 hover:text-slate-100 self-start"
          data-ocid="ptw.detail.back_button"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
        </Button>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:text-slate-100 gap-1"
            onClick={handlePrint}
            data-ocid="ptw.detail.print_button"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </Button>
        </div>
      </div>

      {/* Permit identity */}
      <div className="bg-slate-900/80 border border-white/10 backdrop-blur-md rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap gap-3 items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getPermitTypeIcon(ptw.permitType)}
              <span className="font-mono text-lg font-bold text-cyan-300">
                {ptw.id}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <PermitTypeBadge type={ptw.permitType} />
              <RiskBadge level={ptw.riskLevel} />
              <StatusBadge status={ptw.status} />
            </div>
          </div>
          {/* QR code placeholder — textual representation */}
          <div className="text-center">
            <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded flex items-center justify-center">
                <span className="text-white text-xs font-mono leading-none text-center">
                  QR\n{ptw.id.slice(-6)}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Scan to verify</p>
          </div>
        </div>

        {ptw.status === "Rejected" && (
          <div
            className="flex gap-2 rounded-lg border border-red-700 bg-red-900/30 px-4 py-3"
            data-ocid="ptw.detail.rejection_banner"
          >
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300">
                Permit Rejected
              </p>
              {ptw.requestorSignature?.remarks && (
                <p className="text-xs text-slate-300 mt-0.5">
                  {ptw.requestorSignature.remarks}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Workflow Timeline */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Approval Workflow
          </p>
          <WorkflowTimeline ptw={ptw} />
        </div>
      </div>

      {/* Permit Details Grid */}
      <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" /> Permit Details
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <InfoItem
            label="Permit Type"
            value={PERMIT_TYPE_LABELS[ptw.permitType] ?? ptw.permitType}
          />
          <InfoItem label="Validity Date" value={ptw.validityDate} />
          <InfoItem label="Time Start" value={ptw.timeStart} />
          <InfoItem label="Time End" value={ptw.timeEnd} />
          <InfoItem
            label="Job Location"
            value={ptw.jobLocation}
            icon={<MapPin className="w-3 h-3" />}
          />
          <InfoItem label="Area" value={ptw.area} />
          <InfoItem label="Department" value={ptw.department} />
          <InfoItem label="Issuing Dept" value={ptw.issuingDepartment} />
          <InfoItem label="Issued To" value={ptw.issuedTo} />
          <InfoItem label="Contractor" value={ptw.contractorName} />
          <InfoItem label="Supervisor" value={ptw.supervisorName} />
          <InfoItem label="Cross Reference" value={ptw.crossReference} />
        </div>
        <div className="mt-3 rounded-lg bg-slate-800/60 border border-slate-700 p-3">
          <p className="text-xs text-slate-400 mb-1">Job Description</p>
          <p className="text-sm text-slate-100 whitespace-pre-wrap">
            {ptw.jobDescription}
          </p>
        </div>
      </div>

      {/* Hazards & PPE */}
      {(ptw.selectedHazards.length > 0 || ptw.selectedPPE.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ptw.selectedHazards.length > 0 && (
            <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />{" "}
                Identified Hazards
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ptw.selectedHazards.map((h) => (
                  <span
                    key={h}
                    className="px-2 py-0.5 rounded-full text-xs bg-red-900/40 text-red-300 border border-red-700/50"
                  >
                    {h}
                  </span>
                ))}
                {ptw.customHazard && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-orange-900/40 text-orange-300 border border-orange-700/50">
                    {ptw.customHazard}
                  </span>
                )}
              </div>
            </div>
          )}
          {ptw.selectedPPE.length > 0 && (
            <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                <HardHat className="w-3.5 h-3.5 text-green-400" /> Required PPE
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {ptw.selectedPPE.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-0.5 rounded-full text-xs bg-green-900/40 text-green-300 border border-green-700/50"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Checklist */}
      {ptw.checklist.length > 0 && (
        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Precaution
            Checklist
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ptw.checklist.map(([item, done]) => (
              <div
                key={item}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs ${
                  done
                    ? "border-green-700/50 bg-green-900/30 text-green-300"
                    : "border-slate-700 bg-slate-800/40 text-slate-400"
                }`}
              >
                <span className="text-base">{done ? "\u2713" : "\u25cb"}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insurance */}
      {ptw.insurance && (
        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-400" /> Insurance Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoItem label="Type" value={ptw.insurance.insuranceType} />
            <InfoItem label="Policy No." value={ptw.insurance.policyNumber} />
            <InfoItem label="Valid From" value={ptw.insurance.validFrom} />
            <InfoItem label="Valid Till" value={ptw.insurance.validTill} />
            <InfoItem label="Status" value={ptw.insurance.verificationStatus} />
          </div>
        </div>
      )}

      {/* Isolation */}
      {ptw.isolation?.isolationRequired && (
        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-orange-400" /> Isolation Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoItem
              label="LOTO Lock No."
              value={ptw.isolation.lotoLockNumber}
            />
            <InfoItem
              label="Verification"
              value={ptw.isolation.verificationStatus}
            />
            <InfoItem label="Description" value={ptw.isolation.description} />
          </div>
          {ptw.isolation.electricalOptions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-slate-400 mb-1">
                Electrical Isolation
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ptw.isolation.electricalOptions.map((o) => (
                  <span
                    key={o}
                    className="px-2 py-0.5 rounded text-xs bg-orange-900/30 text-orange-300 border border-orange-700/50"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gas Test (Confined Space) */}
      {(ptw.o2Percent !== undefined || ptw.lelPercent !== undefined) && (
        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Gas Test Readings
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoItem
              label="O\u2082 %"
              value={ptw.o2Percent !== undefined ? String(ptw.o2Percent) : "—"}
            />
            <InfoItem
              label="LEL %"
              value={
                ptw.lelPercent !== undefined ? String(ptw.lelPercent) : "—"
              }
            />
            <InfoItem
              label="H\u2082S ppm"
              value={ptw.h2sPpm !== undefined ? String(ptw.h2sPpm) : "—"}
            />
            <InfoItem
              label="CO ppm"
              value={ptw.coPpm !== undefined ? String(ptw.coPpm) : "—"}
            />
          </div>
        </div>
      )}

      {/* Signature Details */}
      <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-purple-400" /> Approval Signatures
        </h3>
        <div className="space-y-2">
          {(
            [
              { label: "Requestor", sig: ptw.requestorSignature },
              { label: "HOD", sig: ptw.hodSignature },
              { label: "Area In-Charge", sig: ptw.areaInChargeSignature },
              {
                label: "Isolation Authority",
                sig: ptw.isolationAuthoritySignature,
              },
              { label: "Safety Officer", sig: ptw.safetyOfficerSignature },
              { label: "Final Issuer", sig: ptw.finalIssuerSignature },
            ] as const
          )
            .filter((s) => s.sig)
            .map(({ label, sig }) => (
              <div
                key={label}
                className="flex flex-wrap items-start gap-3 p-2.5 rounded-lg bg-slate-800/40 border border-slate-700"
              >
                <span className="text-xs font-semibold text-slate-300 w-32 shrink-0">
                  {label}
                </span>
                <div className="flex flex-wrap gap-3 text-xs text-slate-400 min-w-0">
                  <span className="text-slate-200">
                    {sig?.name} ({sig?.employeeId ? String(sig.employeeId) : ""}
                    )
                  </span>
                  <span>{sig?.designation}</span>
                  <span
                    className={`font-medium ${
                      sig?.approvalStatus === "Approved"
                        ? "text-green-400"
                        : sig?.approvalStatus === "Rejected"
                          ? "text-red-400"
                          : "text-slate-400"
                    }`}
                  >
                    {sig?.approvalStatus}
                  </span>
                  {sig?.signedAt && (
                    <span>
                      {new Date(
                        Number(sig.signedAt / 1_000_000n),
                      ).toLocaleString()}
                    </span>
                  )}
                  {sig?.remarks && (
                    <span className="italic text-slate-500">
                      &ldquo;{sig.remarks}&rdquo;
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Energisation (Active/Closed) */}
      {(isActive || isClosed) && (userRole === "SafetyOfficer" || isAdmin) && (
        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4 space-y-4">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-cyan-400" /> Energisation Records
          </h3>
          {/* Electrical */}
          <div className="space-y-2">
            <p className="text-xs text-slate-300 font-medium">
              Electrical Energisation
            </p>
            {(["Earthing Checked", "System Put Back in Place"] as const).map(
              (item) => (
                <label
                  key={item}
                  htmlFor={`elec-${item}`}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-700 bg-slate-800/40 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id={`elec-${item}`}
                    checked={elecChecklist[item] ?? false}
                    onChange={(e) =>
                      setElecChecklist((p) => ({
                        ...p,
                        [item]: e.target.checked,
                      }))
                    }
                    className="accent-cyan-500"
                  />
                  <span className="text-xs text-slate-200">{item}</span>
                </label>
              ),
            )}
            <Input
              value={elecLoto}
              onChange={(e) => setElecLoto(e.target.value)}
              placeholder="LOTO Lock Number"
              className="bg-slate-800/60 border-slate-700 text-slate-100 h-8 text-xs"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-cyan-700/50 text-cyan-300 hover:bg-cyan-900/30"
              disabled={energiseMutation.isPending}
              onClick={() => energiseMutation.mutate("Electrical")}
              data-ocid="ptw.detail.elec_energise_button"
            >
              {energiseMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Record Electrical Energisation"
              )}
            </Button>
          </div>
          <Separator className="bg-slate-700" />
          {/* Service/Process */}
          <div className="space-y-2">
            <p className="text-xs text-slate-300 font-medium">
              Service / Process Energisation
            </p>
            {(
              [
                "System Put Back in Place",
                "Process Ready for Energisation",
              ] as const
            ).map((item) => (
              <label
                key={item}
                htmlFor={`svc-${item}`}
                className="flex items-center gap-2 p-2 rounded-lg border border-slate-700 bg-slate-800/40 cursor-pointer"
              >
                <input
                  type="checkbox"
                  id={`svc-${item}`}
                  checked={svcChecklist[item] ?? false}
                  onChange={(e) =>
                    setSvcChecklist((p) => ({ ...p, [item]: e.target.checked }))
                  }
                  className="accent-cyan-500"
                />
                <span className="text-xs text-slate-200">{item}</span>
              </label>
            ))}
            <Input
              value={svcLoto}
              onChange={(e) => setSvcLoto(e.target.value)}
              placeholder="LOTO Lock Number"
              className="bg-slate-800/60 border-slate-700 text-slate-100 h-8 text-xs"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-cyan-700/50 text-cyan-300 hover:bg-cyan-900/30"
              disabled={energiseMutation.isPending}
              onClick={() => energiseMutation.mutate("ServiceProcess")}
              data-ocid="ptw.detail.svc_energise_button"
            >
              {energiseMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Record Service Energisation"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Approval Action Panel */}
      {canAct && (
        <div
          className="bg-slate-900/80 border border-cyan-700/40 backdrop-blur-md rounded-xl p-5 space-y-3"
          data-ocid="ptw.detail.approval_panel"
        >
          <p className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Your Approval Action Required
          </p>
          {needsNominee && (
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">
                {getNomineeLabel()} *
              </Label>
              <Input
                value={nomineeId}
                onChange={(e) => setNomineeId(e.target.value)}
                placeholder="Employee Number (e.g. 100042)"
                className="bg-slate-800/60 border-slate-700 text-slate-100"
                data-ocid="ptw.detail.nominee_id.input"
              />
              {nomineeErr && (
                <p
                  className="text-xs text-red-400"
                  data-ocid="ptw.detail.nominee_id.field_error"
                >
                  {nomineeErr}
                </p>
              )}
            </div>
          )}
          <div className="space-y-1">
            <Label className="text-xs text-slate-300">
              Remarks (required for rejection)
            </Label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              placeholder="Enter remarks\u2026"
              className="bg-slate-800/60 border-slate-700 text-slate-100 resize-none"
              data-ocid="ptw.detail.remarks.textarea"
            />
            {remarkErr && (
              <p
                className="text-xs text-red-400"
                data-ocid="ptw.detail.remarks.field_error"
              >
                {remarkErr}
              </p>
            )}
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              className="border-red-700/50 text-red-300 hover:bg-red-900/30"
              onClick={() => approveMutation.mutate({ approve: false })}
              data-ocid="ptw.detail.reject_button"
            >
              {approveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <XCircle className="w-4 h-4 mr-1" />
              )}
              Reject
            </Button>
            <Button
              type="button"
              disabled={isBusy}
              className="bg-green-700 hover:bg-green-600 text-white"
              onClick={() => approveMutation.mutate({ approve: true })}
              data-ocid="ptw.detail.approve_button"
            >
              {approveMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-1" />
              )}
              Approve
            </Button>
          </div>
        </div>
      )}

      {/* Close / Suspend Actions */}
      {(canClose || canSuspend) && (
        <div
          className="flex gap-3 flex-wrap"
          data-ocid="ptw.detail.status_actions"
        >
          {canSuspend && (
            <>
              <div className="flex-1 min-w-48">
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  placeholder="Reason for suspension\u2026"
                  className="bg-slate-800/60 border-slate-700 text-slate-100 resize-none text-sm"
                  data-ocid="ptw.detail.suspend_reason.textarea"
                />
                {remarkErr && (
                  <p className="text-xs text-red-400 mt-0.5">{remarkErr}</p>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                disabled={isBusy}
                className="border-yellow-700/50 text-yellow-300 hover:bg-yellow-900/30"
                onClick={() => suspendMutation.mutate()}
                data-ocid="ptw.detail.suspend_button"
              >
                {suspendMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : null}
                Suspend Permit
              </Button>
            </>
          )}
          {canClose && (
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              className="border-slate-600 text-slate-300 hover:text-slate-100"
              onClick={() => closeMutation.mutate()}
              data-ocid="ptw.detail.close_permit_button"
            >
              {closeMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1" />
              ) : (
                <X className="w-4 h-4 mr-1" />
              )}
              Close Permit
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-slate-800/60 border border-slate-700 p-2.5 min-w-0">
      <p className="text-xs text-slate-400 flex items-center gap-1 mb-0.5">
        {icon}
        {label}
      </p>
      <p className="text-sm font-medium text-slate-100 break-words min-w-0">
        {value || "\u2014"}
      </p>
    </div>
  );
}
