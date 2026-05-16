import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  HardHat,
  Loader2,
  Shield,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { CreatePermitInput, PTWMasterData } from "../../backend";
import { InsuranceType, PermitType, RiskLevel } from "../../backend";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import {
  CHECKLIST_BY_TYPE,
  DEPARTMENTS,
  ELECTRICAL_ISOLATION_OPTIONS,
  HAZARDS,
  LOCATIONS,
  PERMIT_TYPE_LABELS,
  PPE_LIST,
  SERVICE_ISOLATION_OPTIONS,
} from "./ptwConstants";

const SECTIONS = [
  "Permit Header",
  "Insurance Details",
  "Hazard Identification",
  "PPE Selection",
  "Isolation Management",
  "Precaution Checklist",
  "Approval Chain",
  "Additional Fields",
];

interface Props {
  onCancel: () => void;
  onCreated: () => void;
}

export default function PTWCreateForm({ onCancel, onCreated }: Props) {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeSection, setActiveSection] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Section 1 — Header
  const [permitType, setPermitType] = useState<PermitType>(
    PermitType.GeneralWork,
  );
  const [validityDate, setValidityDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [issuingDept, setIssuingDept] = useState("");
  const [issuedTo, setIssuedTo] = useState("");
  const [crossRef, setCrossRef] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [contractorName, setContractorName] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [department, setDepartment] = useState("");
  const [area, setArea] = useState("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>(RiskLevel.Low);

  // Section 2 — Insurance
  const [insuranceType, setInsuranceType] = useState("");
  const [insValidFrom, setInsValidFrom] = useState("");
  const [insValidTill, setInsValidTill] = useState("");
  const [insPolicyNum, setInsPolicyNum] = useState("");
  const [insVerification, setInsVerification] = useState("Pending");

  // Section 3 — Hazards
  const [selectedHazards, setSelectedHazards] = useState<string[]>([]);
  const [customHazard, setCustomHazard] = useState("");

  // Section 4 — PPE
  const [selectedPPE, setSelectedPPE] = useState<string[]>([]);

  // Section 5 — Isolation
  const [isolationRequired, setIsolationRequired] = useState(false);
  const [elecOptions, setElecOptions] = useState<string[]>([]);
  const [svcOptions, setSvcOptions] = useState<string[]>([]);
  const [isolationDesc, setIsolationDesc] = useState("");
  const [lotoLock, setLotoLock] = useState("");
  const [isolationBy, setIsolationBy] = useState("");
  const [isolationDT, setIsolationDT] = useState("");
  const [isolationVerify, setIsolationVerify] = useState("");

  // Section 6 — Checklist (dynamic)
  const checklistItems =
    CHECKLIST_BY_TYPE[permitType] ?? CHECKLIST_BY_TYPE.default;
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  // Section 7 — HOD Employee Number
  const [hodEmpNum, setHodEmpNum] = useState("");

  // Section 8 — Additional
  const [o2Pct, setO2Pct] = useState("");
  const [lelPct, setLelPct] = useState("");
  const [h2sPpm, setH2sPpm] = useState("");
  const [coPpm, setCoPpm] = useState("");
  const [emergencyRescuePlan, setEmergencyRescuePlan] = useState(false);
  const [emergencyDesc, setEmergencyDesc] = useState("");
  const [toolboxDone, setToolboxDone] = useState(false);
  const [toolboxAttendees, setToolboxAttendees] = useState("");
  const [hiraRef, setHiraRef] = useState("");
  const [jsaRef, setJsaRef] = useState("");

  const { data: masterData } = useQuery<PTWMasterData | null>({
    queryKey: ["ptwMaster"],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getPTWMasterData(token);
      return res.__kind__ === "ok" ? res.ok : null;
    },
    enabled: isReady,
  });

  const insNearExpiry = insValidTill
    ? new Date(insValidTill).getTime() - Date.now() < 30 * 86400_000
    : false;
  const insExpired = insValidTill
    ? new Date(insValidTill).getTime() < Date.now()
    : false;
  const isESI = insuranceType === InsuranceType.ESI;

  function toggleArr<T>(arr: T[], setArr: (v: T[]) => void, item: T) {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!validityDate) e.validityDate = "Required";
    if (!timeStart) e.timeStart = "Required";
    if (!timeEnd) e.timeEnd = "Required";
    if (timeStart && timeEnd && timeEnd <= timeStart)
      e.timeEnd = "End must be after start";
    if (!issuingDept) e.issuingDept = "Required";
    if (!jobLocation) e.jobLocation = "Required";
    if (!jobDesc.trim()) e.jobDesc = "Required";
    if (!department) e.department = "Required";
    if (selectedHazards.length === 0 && !customHazard.trim())
      e.hazards = "Select at least one hazard";
    if (selectedPPE.length === 0) e.ppe = "Select at least one PPE item";
    const allChecked = checklistItems.every((item) => checklist[item]);
    if (!allChecked) e.checklist = "All checklist items must be checked";
    if (!hodEmpNum.trim()) e.hodEmpNum = "HOD Employee Number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const mutation = useMutation({
    mutationFn: async (isDraft: boolean) => {
      if (!actor || !token) throw new Error("Not authenticated");
      if (!isDraft && !validate()) throw new Error("Please fix form errors");
      const input: CreatePermitInput = {
        permitType,
        validityDate,
        timeStart,
        timeEnd,
        issuingDepartment: issuingDept,
        issuedTo,
        crossReference: crossRef,
        jobLocation,
        jobDescription: jobDesc,
        contractorName,
        supervisorName,
        department,
        area,
        riskLevel,
        selectedHazards,
        customHazard,
        selectedPPE,
        checklist: checklistItems.map(
          (item) => [item, checklist[item] ?? false] as [string, boolean],
        ),
        insurance: insuranceType
          ? {
              insuranceType: insuranceType as InsuranceType,
              validFrom: isESI ? "" : insValidFrom,
              validTill: isESI ? "" : insValidTill,
              policyNumber: insPolicyNum,
              verificationStatus: insVerification,
              documentUrls: [],
            }
          : undefined,
        isolation: isolationRequired
          ? {
              isolationRequired: true,
              electricalOptions: elecOptions,
              serviceOptions: svcOptions,
              description: isolationDesc,
              lotoLockNumber: lotoLock,
              isolationBy: BigInt(isolationBy || "0"),
              isolationDateTime: isolationDT
                ? BigInt(new Date(isolationDT).getTime()) * 1_000_000n
                : undefined,
              verificationStatus: isolationVerify,
            }
          : undefined,
        nominatedHodEmployeeId: isDraft ? undefined : BigInt(hodEmpNum),
      };
      const res = await actor.createPTW(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      if (!isDraft) {
        const submitRes = await actor.submitPTW(
          token,
          res.ok,
          BigInt(hodEmpNum),
        );
        if (submitRes.__kind__ === "err") throw new Error(submitRes.err);
      }
      return res.ok;
    },
    onSuccess: (permitId, isDraft) => {
      toast.success(
        isDraft ? `Draft saved: ${permitId}` : `Permit submitted: ${permitId}`,
      );
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onCreated();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const allChecklistDone = checklistItems.every((item) => checklist[item]);
  const sectionDone = [
    !!(
      validityDate &&
      timeStart &&
      timeEnd &&
      issuingDept &&
      jobLocation &&
      jobDesc &&
      department
    ),
    true,
    selectedHazards.length > 0 || !!customHazard.trim(),
    selectedPPE.length > 0,
    true,
    allChecklistDone,
    !!hodEmpNum.trim(),
    true,
  ];

  return (
    <div className="space-y-4" data-ocid="ptw.create_form">
      {/* Step Progress */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {SECTIONS.map((sec, i) => (
          <button
            key={sec}
            type="button"
            onClick={() => setActiveSection(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              i === activeSection
                ? "bg-cyan-700/60 border-cyan-500 text-cyan-200"
                : sectionDone[i]
                  ? "bg-green-900/40 border-green-700/50 text-green-300"
                  : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            data-ocid={`ptw.create.section_tab.${i + 1}`}
          >
            {sectionDone[i] && i !== activeSection ? "\u2713 " : ""}
            {i + 1}. {sec}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/60 border border-white/10 backdrop-blur-md rounded-xl p-4 space-y-4">
        {/* SECTION 1 */}
        {activeSection === 0 && (
          <div className="space-y-4">
            <SectionHeader
              icon={<FileText className="w-4 h-4 text-cyan-400" />}
              title="Permit Header"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Permit Number">
                <Input
                  value="Auto-generated on save"
                  readOnly
                  className="bg-slate-800/60 border-slate-700 text-slate-500 cursor-not-allowed"
                />
              </FormField>
              <FormField label="Permit Type *">
                <Select
                  value={permitType}
                  onValueChange={(v) => setPermitType(v as PermitType)}
                >
                  <SelectTrigger
                    className="bg-slate-800/60 border-slate-700 text-slate-100"
                    data-ocid="ptw.create.type.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {Object.entries(PERMIT_TYPE_LABELS).map(([k, v]) => (
                      <SelectItem
                        key={k}
                        value={k}
                        className="text-slate-100 focus:bg-slate-700"
                      >
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Validity Date *" error={errors.validityDate}>
                <Input
                  type="date"
                  value={validityDate}
                  onChange={(e) => setValidityDate(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.validity_date.input"
                />
              </FormField>
              <FormField label="Time Start *" error={errors.timeStart}>
                <Input
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.time_start.input"
                />
              </FormField>
              <FormField label="Time End *" error={errors.timeEnd}>
                <Input
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.time_end.input"
                />
              </FormField>
              <DeptSelect
                label="Issuing Department *"
                value={issuingDept}
                onChange={setIssuingDept}
                error={errors.issuingDept}
                ocid="ptw.create.issuing_dept.select"
              />
              <FormField label="Issued To">
                <Input
                  value={issuedTo}
                  onChange={(e) => setIssuedTo(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.issued_to.input"
                />
              </FormField>
              <FormField label="Cross Reference">
                <Input
                  value={crossRef}
                  onChange={(e) => setCrossRef(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.cross_ref.input"
                />
              </FormField>
              <LocationSelect
                label="Job Location *"
                value={jobLocation}
                onChange={setJobLocation}
                error={errors.jobLocation}
                ocid="ptw.create.job_location.select"
              />
              <FormField label="Contractor Name">
                <Input
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.contractor.input"
                />
              </FormField>
              <FormField label="Supervisor Name">
                <Input
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.supervisor.input"
                />
              </FormField>
              <DeptSelect
                label="Department *"
                value={department}
                onChange={setDepartment}
                error={errors.department}
                ocid="ptw.create.department.select"
              />
              <LocationSelect
                label="Area"
                value={area}
                onChange={setArea}
                ocid="ptw.create.area.select"
              />
              <FormField label="Risk Level *">
                <Select
                  value={riskLevel}
                  onValueChange={(v) => setRiskLevel(v as RiskLevel)}
                >
                  <SelectTrigger
                    className="bg-slate-800/60 border-slate-700 text-slate-100"
                    data-ocid="ptw.create.risk_level.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {(["Low", "Medium", "High", "Critical"] as RiskLevel[]).map(
                      (r) => (
                        <SelectItem
                          key={r}
                          value={r}
                          className="text-slate-100 focus:bg-slate-700"
                        >
                          {r}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField
              label="Job Description in Detail *"
              error={errors.jobDesc}
            >
              <Textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={3}
                placeholder="Describe the work to be carried out in detail\u2026"
                className="bg-slate-800/60 border-slate-700 text-slate-100 resize-none"
                data-ocid="ptw.create.job_desc.textarea"
              />
            </FormField>
          </div>
        )}

        {/* SECTION 2 — Insurance */}
        {activeSection === 1 && (
          <div className="space-y-4">
            <SectionHeader
              icon={<Shield className="w-4 h-4 text-amber-400" />}
              title="Insurance Details"
            />
            {(insNearExpiry || insExpired) && (
              <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                  insExpired
                    ? "border-red-700 bg-red-900/30 text-red-300"
                    : "border-amber-700 bg-amber-900/30 text-amber-300"
                }`}
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p className="text-xs font-medium">
                  {insExpired
                    ? "Insurance has expired — permit cannot be approved."
                    : "Insurance expires within 30 days."}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Insurance Type">
                <Select value={insuranceType} onValueChange={setInsuranceType}>
                  <SelectTrigger
                    className="bg-slate-800/60 border-slate-700 text-slate-100"
                    data-ocid="ptw.create.insurance_type.select"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem
                      value={InsuranceType.ESI}
                      className="text-slate-100 focus:bg-slate-700"
                    >
                      Employees State Insurance (ESI)
                    </SelectItem>
                    <SelectItem
                      value={InsuranceType.GroupAccident}
                      className="text-slate-100 focus:bg-slate-700"
                    >
                      Group Accident Insurance
                    </SelectItem>
                    <SelectItem
                      value={InsuranceType.WorkerCompensation}
                      className="text-slate-100 focus:bg-slate-700"
                    >
                      Worker Compensation Policy
                    </SelectItem>
                    <SelectItem
                      value={InsuranceType.EmployeeCompensation}
                      className="text-slate-100 focus:bg-slate-700"
                    >
                      Employee Compensation Policy
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Policy Number">
                <Input
                  value={insPolicyNum}
                  onChange={(e) => setInsPolicyNum(e.target.value)}
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.policy_number.input"
                />
              </FormField>
              <FormField label={`Valid From ${isESI ? "(ESI — N/A)" : ""}`}>
                <Input
                  type="date"
                  value={insValidFrom}
                  onChange={(e) => setInsValidFrom(e.target.value)}
                  readOnly={isESI}
                  className={`bg-slate-800/60 border-slate-700 text-slate-100 ${isESI ? "opacity-50 cursor-not-allowed" : ""}`}
                  data-ocid="ptw.create.ins_valid_from.input"
                />
              </FormField>
              <FormField label={`Valid Till ${isESI ? "(ESI — N/A)" : ""}`}>
                <Input
                  type="date"
                  value={insValidTill}
                  onChange={(e) => setInsValidTill(e.target.value)}
                  readOnly={isESI}
                  className={`bg-slate-800/60 border-slate-700 text-slate-100 ${isESI ? "opacity-50 cursor-not-allowed" : ""}`}
                  data-ocid="ptw.create.ins_valid_till.input"
                />
              </FormField>
              <FormField label="Verification Status">
                <Select
                  value={insVerification}
                  onValueChange={setInsVerification}
                >
                  <SelectTrigger
                    className="bg-slate-800/60 border-slate-700 text-slate-100"
                    data-ocid="ptw.create.ins_verification.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    {["Pending", "Verified", "Expired"].map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className="text-slate-100 focus:bg-slate-700"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>
        )}

        {/* SECTION 3 — Hazards */}
        {activeSection === 2 && (
          <div className="space-y-4">
            <SectionHeader
              icon={<AlertTriangle className="w-4 h-4 text-red-400" />}
              title="Hazard Identification"
            />
            {errors.hazards && (
              <p
                className="text-xs text-red-400"
                data-ocid="ptw.create.hazards.field_error"
              >
                {errors.hazards}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(masterData?.hazards?.length ? masterData.hazards : HAZARDS).map(
                (h) => (
                  <CheckItem
                    key={h}
                    id={`hz-${h}`}
                    checked={selectedHazards.includes(h)}
                    onChange={() =>
                      toggleArr(selectedHazards, setSelectedHazards, h)
                    }
                    label={h}
                    ocid={`ptw.create.hazard.${h.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                  />
                ),
              )}
            </div>
            <FormField label="Custom Hazard (if not listed)">
              <Input
                value={customHazard}
                onChange={(e) => setCustomHazard(e.target.value)}
                placeholder="Describe any additional hazard\u2026"
                className="bg-slate-800/60 border-slate-700 text-slate-100"
                data-ocid="ptw.create.custom_hazard.input"
              />
            </FormField>
          </div>
        )}

        {/* SECTION 4 — PPE */}
        {activeSection === 3 && (
          <div className="space-y-4">
            <SectionHeader
              icon={<HardHat className="w-4 h-4 text-green-400" />}
              title="PPE Selection"
            />
            {errors.ppe && (
              <p
                className="text-xs text-red-400"
                data-ocid="ptw.create.ppe.field_error"
              >
                {errors.ppe}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(masterData?.ppeList?.length
                ? masterData.ppeList
                : PPE_LIST
              ).map((p) => (
                <CheckItem
                  key={p}
                  id={`ppe-${p}`}
                  checked={selectedPPE.includes(p)}
                  onChange={() => toggleArr(selectedPPE, setSelectedPPE, p)}
                  label={p}
                  ocid={`ptw.create.ppe.${p.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5 — Isolation */}
        {activeSection === 4 && (
          <div className="space-y-4">
            <SectionHeader
              icon={<Shield className="w-4 h-4 text-orange-400" />}
              title="Isolation Management"
            />
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-700">
              <Checkbox
                id="iso-req"
                checked={isolationRequired}
                onCheckedChange={(v) => setIsolationRequired(!!v)}
                data-ocid="ptw.create.isolation_required.checkbox"
              />
              <Label
                htmlFor="iso-req"
                className="text-slate-100 cursor-pointer"
              >
                Isolation Required
              </Label>
            </div>
            {isolationRequired && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                    Electrical Isolation
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {ELECTRICAL_ISOLATION_OPTIONS.map((opt) => (
                      <CheckItem
                        key={opt}
                        id={`ei-${opt}`}
                        checked={elecOptions.includes(opt)}
                        onChange={() =>
                          toggleArr(elecOptions, setElecOptions, opt)
                        }
                        label={opt}
                        ocid={`ptw.create.elec_iso.${opt.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                    Service / Process Isolation
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICE_ISOLATION_OPTIONS.map((opt) => (
                      <CheckItem
                        key={opt}
                        id={`si-${opt}`}
                        checked={svcOptions.includes(opt)}
                        onChange={() =>
                          toggleArr(svcOptions, setSvcOptions, opt)
                        }
                        label={opt}
                        ocid={`ptw.create.svc_iso.${opt.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="LOTO Lock Number">
                    <Input
                      value={lotoLock}
                      onChange={(e) => setLotoLock(e.target.value)}
                      className="bg-slate-800/60 border-slate-700 text-slate-100"
                      data-ocid="ptw.create.loto_lock.input"
                    />
                  </FormField>
                  <FormField label="Isolation By (Employee ID)">
                    <Input
                      value={isolationBy}
                      onChange={(e) => setIsolationBy(e.target.value)}
                      className="bg-slate-800/60 border-slate-700 text-slate-100"
                      data-ocid="ptw.create.isolation_by.input"
                    />
                  </FormField>
                  <FormField label="Isolation Date/Time">
                    <Input
                      type="datetime-local"
                      value={isolationDT}
                      onChange={(e) => setIsolationDT(e.target.value)}
                      className="bg-slate-800/60 border-slate-700 text-slate-100"
                      data-ocid="ptw.create.isolation_dt.input"
                    />
                  </FormField>
                  <FormField label="Isolation Verification">
                    <Input
                      value={isolationVerify}
                      onChange={(e) => setIsolationVerify(e.target.value)}
                      className="bg-slate-800/60 border-slate-700 text-slate-100"
                      data-ocid="ptw.create.isolation_verify.input"
                    />
                  </FormField>
                </div>
                <FormField label="Isolation Description">
                  <Textarea
                    value={isolationDesc}
                    onChange={(e) => setIsolationDesc(e.target.value)}
                    rows={2}
                    className="bg-slate-800/60 border-slate-700 text-slate-100 resize-none"
                    data-ocid="ptw.create.isolation_desc.textarea"
                  />
                </FormField>
              </div>
            )}
          </div>
        )}

        {/* SECTION 6 — Checklist */}
        {activeSection === 5 && (
          <div className="space-y-4">
            <SectionHeader
              icon={<CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              title={`Precaution Checklist — ${PERMIT_TYPE_LABELS[permitType] ?? permitType}`}
            />
            {errors.checklist && (
              <p
                className="text-xs text-red-400"
                data-ocid="ptw.create.checklist.field_error"
              >
                {errors.checklist}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {checklistItems.map((item) => (
                <CheckItem
                  key={item}
                  id={`cl-${item}`}
                  checked={checklist[item] ?? false}
                  onChange={() =>
                    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }))
                  }
                  label={item}
                  ocid={`ptw.create.checklist.${item.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                />
              ))}
            </div>
            {allChecklistDone && (
              <p className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> All checklist items
                confirmed
              </p>
            )}
          </div>
        )}

        {/* SECTION 7 — Approval Chain */}
        {activeSection === 6 && (
          <div className="space-y-4">
            <SectionHeader
              icon={<User className="w-4 h-4 text-purple-400" />}
              title="Approval Chain Nomination"
            />
            <div className="space-y-3">
              <SignatureSlot
                n={1}
                label="Employee / Requestor"
                desc={`Auto-filled: ${user?.employeeId ? String(user.employeeId) : ""} — ${user?.name ?? ""}`}
                fixed
              />
              <SignatureSlot n={2} label="HOD" desc="Enter HOD Employee Number">
                <Input
                  value={hodEmpNum}
                  onChange={(e) => setHodEmpNum(e.target.value)}
                  placeholder="e.g. 100042"
                  className="bg-slate-800/60 border-slate-700 text-slate-100 mt-1 h-8 text-sm"
                  data-ocid="ptw.create.hod_emp_num.input"
                />
                {errors.hodEmpNum && (
                  <p
                    className="text-xs text-red-400 mt-0.5"
                    data-ocid="ptw.create.hod_emp_num.field_error"
                  >
                    {errors.hodEmpNum}
                  </p>
                )}
              </SignatureSlot>
              <SignatureSlot
                n={3}
                label="Area In-Charge"
                desc="Will be nominated by HOD at approval stage"
                pending
              />
              <SignatureSlot
                n={4}
                label="Isolation Authority"
                desc="Activated only if isolation is required"
                pending
              />
              <SignatureSlot
                n={5}
                label="Safety Officer"
                desc="Will be nominated by Area In-Charge"
                pending
              />
              <SignatureSlot
                n={6}
                label="Final Permit Issuer"
                desc="Will be nominated by Safety Officer"
                pending
              />
            </div>
          </div>
        )}

        {/* SECTION 8 — Additional Fields */}
        {activeSection === 7 && (
          <div className="space-y-4">
            <SectionHeader
              icon={<AlertTriangle className="w-4 h-4 text-yellow-400" />}
              title="Additional Fields"
            />
            {permitType === PermitType.ConfinedSpace && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  Gas Test Readings (Confined Space)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        label: "O\u2082 %",
                        val: o2Pct,
                        set: setO2Pct,
                        ocid: "ptw.create.gas_o2.input",
                        hint: "Safe: 19.5\u201323%",
                      },
                      {
                        label: "LEL %",
                        val: lelPct,
                        set: setLelPct,
                        ocid: "ptw.create.gas_lel.input",
                        hint: "Safe: <10%",
                      },
                      {
                        label: "H\u2082S ppm",
                        val: h2sPpm,
                        set: setH2sPpm,
                        ocid: "ptw.create.gas_h2s.input",
                        hint: "Safe: <1 ppm",
                      },
                      {
                        label: "CO ppm",
                        val: coPpm,
                        set: setCoPpm,
                        ocid: "ptw.create.gas_co.input",
                        hint: "Safe: <25 ppm",
                      },
                    ] as const
                  ).map(({ label, val, set, ocid, hint }) => (
                    <div key={label}>
                      <Label className="text-xs text-slate-300">{label}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        className="bg-slate-800/60 border-slate-700 text-slate-100 mt-0.5 h-8"
                        data-ocid={ocid}
                      />
                      <p className="text-xs text-slate-500 mt-0.5">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <Checkbox
                  id="emergency-plan"
                  checked={emergencyRescuePlan}
                  onCheckedChange={(v) => setEmergencyRescuePlan(!!v)}
                  data-ocid="ptw.create.emergency_plan.checkbox"
                />
                <Label
                  htmlFor="emergency-plan"
                  className="text-slate-100 cursor-pointer"
                >
                  Emergency Rescue Plan in Place
                </Label>
              </div>
              {emergencyRescuePlan && (
                <Textarea
                  value={emergencyDesc}
                  onChange={(e) => setEmergencyDesc(e.target.value)}
                  rows={2}
                  placeholder="Describe emergency rescue plan\u2026"
                  className="bg-slate-800/60 border-slate-700 text-slate-100 resize-none"
                  data-ocid="ptw.create.emergency_desc.textarea"
                />
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700">
                <Checkbox
                  id="toolbox"
                  checked={toolboxDone}
                  onCheckedChange={(v) => setToolboxDone(!!v)}
                  data-ocid="ptw.create.toolbox.checkbox"
                />
                <Label
                  htmlFor="toolbox"
                  className="text-slate-100 cursor-pointer"
                >
                  Toolbox Talk Completed
                </Label>
              </div>
              {toolboxDone && (
                <FormField label="Toolbox Talk Attendees">
                  <Textarea
                    value={toolboxAttendees}
                    onChange={(e) => setToolboxAttendees(e.target.value)}
                    rows={2}
                    placeholder="List attendees (names or IDs)\u2026"
                    className="bg-slate-800/60 border-slate-700 text-slate-100 resize-none"
                    data-ocid="ptw.create.toolbox_attendees.textarea"
                  />
                </FormField>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="HIRA Reference">
                <Input
                  value={hiraRef}
                  onChange={(e) => setHiraRef(e.target.value)}
                  placeholder="HIRA-2026-0001"
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.hira_ref.input"
                />
              </FormField>
              <FormField label="JSA Reference">
                <Input
                  value={jsaRef}
                  onChange={(e) => setJsaRef(e.target.value)}
                  placeholder="JSA-2026-0001"
                  className="bg-slate-800/60 border-slate-700 text-slate-100"
                  data-ocid="ptw.create.jsa_ref.input"
                />
              </FormField>
            </div>
          </div>
        )}
      </div>

      {/* Form Navigation & Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2">
          {activeSection > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:text-slate-100"
              onClick={() => setActiveSection((s) => s - 1)}
            >
              <ChevronUp className="w-4 h-4 rotate-90" /> Previous
            </Button>
          )}
          {activeSection < SECTIONS.length - 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:text-slate-100"
              onClick={() => setActiveSection((s) => s + 1)}
              data-ocid="ptw.create.next_section_button"
            >
              Next <ChevronDown className="w-4 h-4 -rotate-90" />
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-slate-100"
            onClick={onCancel}
            data-ocid="ptw.create.cancel_button"
          >
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:text-slate-100"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(true)}
            data-ocid="ptw.create.save_draft_button"
          >
            {mutation.isPending && (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            )}
            Save as Draft
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-cyan-700 hover:bg-cyan-600 text-white"
            disabled={!isReady || mutation.isPending}
            onClick={() => mutation.mutate(false)}
            data-ocid="ptw.create.submit_button"
          >
            {mutation.isPending && (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            )}
            Submit Permit
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function SectionHeader({
  icon,
  title,
}: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
    </div>
  );
}

function FormField({
  label,
  error,
  children,
}: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-slate-300">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function DeptSelect({
  label,
  value,
  onChange,
  error,
  ocid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  ocid: string;
}) {
  return (
    <FormField label={label} error={error}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="bg-slate-800/60 border-slate-700 text-slate-100"
          data-ocid={ocid}
        >
          <SelectValue placeholder="Select department" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 max-h-48">
          {DEPARTMENTS.map((d) => (
            <SelectItem
              key={d}
              value={d}
              className="text-slate-100 focus:bg-slate-700"
            >
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

function LocationSelect({
  label,
  value,
  onChange,
  error,
  ocid,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  ocid: string;
}) {
  return (
    <FormField label={label} error={error}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className="bg-slate-800/60 border-slate-700 text-slate-100"
          data-ocid={ocid}
        >
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-slate-700 max-h-48">
          {LOCATIONS.map((l) => (
            <SelectItem
              key={l}
              value={l}
              className="text-slate-100 focus:bg-slate-700"
            >
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

function CheckItem({
  id,
  checked,
  onChange,
  label,
  ocid,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  ocid: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 p-2 rounded-lg border border-slate-700 bg-slate-800/40 cursor-pointer hover:bg-slate-700/50 transition-colors"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        data-ocid={ocid}
      />
      <span className="text-xs text-slate-200 leading-tight">{label}</span>
    </label>
  );
}

function SignatureSlot({
  n,
  label,
  desc,
  fixed,
  pending,
  children,
}: {
  n: number;
  label: string;
  desc: string;
  fixed?: boolean;
  pending?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border p-3 flex gap-3 ${
        fixed
          ? "border-green-700/40 bg-green-900/20"
          : pending
            ? "border-slate-700/50 bg-slate-800/30"
            : "border-cyan-700/40 bg-cyan-900/20"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          fixed
            ? "bg-green-800 text-green-200"
            : pending
              ? "bg-slate-700 text-slate-400"
              : "bg-cyan-800 text-cyan-200"
        }`}
      >
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
        {children}
      </div>
    </div>
  );
}
