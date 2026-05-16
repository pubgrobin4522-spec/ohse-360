import {
  Atom,
  Flame,
  HardHat,
  Mountain,
  Settings,
  Shield,
  Shovel,
  Snowflake,
  Wind,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";
import type {
  PTWStatus,
  PermitToWorkView,
  PermitType,
  RiskLevel,
} from "../../backend";
import {
  PERMIT_TYPE_LABELS,
  RISK_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
} from "./ptwConstants";

export function getPermitTypeIcon(t: PermitType): ReactNode {
  const map: Partial<Record<PermitType, ReactNode>> = {
    HotWork: <Flame className="w-4 h-4" />,
    ColdWork: <Snowflake className="w-4 h-4" />,
    ConfinedSpace: <Mountain className="w-4 h-4" />,
    HeightWork: <Shield className="w-4 h-4" />,
    ElectricalWork: <Zap className="w-4 h-4" />,
    Excavation: <Shovel className="w-4 h-4" />,
    Lifting: <HardHat className="w-4 h-4" />,
    Shutdown: <Settings className="w-4 h-4" />,
    ChemicalHandling: <Atom className="w-4 h-4" />,
    GeneralWork: <Wind className="w-4 h-4" />,
  };
  return map[t] ?? <Shield className="w-4 h-4" />;
}

export function StatusBadge({ status }: { status: PTWStatus }) {
  const isPulsing = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[status]}`}
    >
      {isPulsing && (
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${RISK_COLORS[level]}`}
    >
      {level}
    </span>
  );
}

export function PermitTypeBadge({ type }: { type: PermitType }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/60 text-slate-200 border border-slate-600">
      {getPermitTypeIcon(type)}
      {PERMIT_TYPE_LABELS[type] ?? type}
    </span>
  );
}

export function WorkflowTimeline({ ptw }: { ptw: PermitToWorkView }) {
  const steps = [
    {
      key: "requestor",
      label: "Requestor",
      sig: ptw.requestorSignature,
      show: true,
    },
    { key: "hod", label: "HOD Review", sig: ptw.hodSignature, show: true },
    {
      key: "area",
      label: "Area Review",
      sig: ptw.areaInChargeSignature,
      show: true,
    },
    {
      key: "isolation",
      label: "Isolation Auth",
      sig: ptw.isolationAuthoritySignature,
      show: ptw.isolation?.isolationRequired ?? false,
    },
    {
      key: "safety",
      label: "Safety Officer",
      sig: ptw.safetyOfficerSignature,
      show: true,
    },
    {
      key: "final",
      label: "Final Issuer",
      sig: ptw.finalIssuerSignature,
      show: true,
    },
  ];

  const visible = steps.filter((s) => s.show);

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-start gap-0 min-w-max">
        {visible.map((step, i) => {
          const approved = step.sig?.approvalStatus === "Approved";
          const rejected = step.sig?.approvalStatus === "Rejected";
          const signed = !!step.sig?.signedAt;
          return (
            <div key={step.key} className="flex items-start">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    approved
                      ? "bg-green-800 border-green-500 text-green-200"
                      : rejected
                        ? "bg-red-800 border-red-500 text-red-200"
                        : signed
                          ? "bg-blue-800 border-blue-500 text-blue-200"
                          : "bg-slate-800 border-slate-600 text-slate-400"
                  }`}
                >
                  {approved ? "\u2713" : rejected ? "\u2717" : i + 1}
                </div>
                <p className="text-xs text-center text-slate-400 mt-1 w-16 leading-tight">
                  {step.label}
                </p>
                {step.sig && (
                  <p
                    className="text-xs text-slate-500 text-center w-16 truncate"
                    title={step.sig.name}
                  >
                    {step.sig.name}
                  </p>
                )}
              </div>
              {i < visible.length - 1 && (
                <div
                  className={`h-0.5 w-6 mt-4 self-start ${approved ? "bg-green-600" : "bg-slate-700"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
