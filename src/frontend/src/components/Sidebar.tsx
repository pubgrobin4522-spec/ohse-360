import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  BookOpen,
  Brain,
  Building2,
  CheckSquare,
  ClipboardList,
  Eye,
  FileCheck,
  LayoutDashboard,
  Leaf,
  Shield,
  Users,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Role } from "../types";

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
  section?: string;
}

const ALL_ROLES: Role[] = [
  Role.SystemAdmin,
  Role.Employee,
  Role.SafetyOfficer,
  Role.HOD,
  Role.AreaInCharge,
  Role.ContractorAdmin,
];

const NAV_ITEMS: NavItem[] = [
  // ── Phase 1 ──────────────────────────────────────────────
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    section: "Phase 1",
    roles: [
      Role.Employee,
      Role.SafetyOfficer,
      Role.HOD,
      Role.AreaInCharge,
      Role.ContractorAdmin,
      Role.SystemAdmin,
    ],
  },
  {
    to: "/users",
    label: "User Management",
    icon: Users,
    section: "Phase 1",
    roles: [Role.SystemAdmin],
  },
  {
    to: "/employees",
    label: "Employee Master",
    icon: Users,
    section: "Phase 1",
    roles: [Role.SystemAdmin, Role.SafetyOfficer, Role.HOD],
  },
  {
    to: "/incidents",
    label: "Incident Reporting",
    icon: AlertTriangle,
    section: "Phase 1",
    roles: [Role.Employee, Role.SafetyOfficer, Role.HOD, Role.SystemAdmin],
  },
  {
    to: "/training",
    label: "Training & Compliance",
    icon: BookOpen,
    section: "Phase 1",
    roles: [
      Role.SafetyOfficer,
      Role.HOD,
      Role.ContractorAdmin,
      Role.Employee,
      Role.SystemAdmin,
    ],
  },
  {
    to: "/ptw",
    label: "Work Permits (PTW)",
    icon: FileCheck,
    section: "Phase 1",
    roles: [
      Role.Employee,
      Role.SafetyOfficer,
      Role.HOD,
      Role.AreaInCharge,
      Role.ContractorAdmin,
      Role.SystemAdmin,
    ],
  },
  {
    to: "/audit",
    label: "Audit Trail",
    icon: ClipboardList,
    section: "Phase 1",
    roles: [Role.SystemAdmin, Role.SafetyOfficer],
  },
  {
    to: "/notifications",
    label: "Notifications",
    icon: Bell,
    section: "Phase 1",
    roles: ALL_ROLES,
  },
  // ── Phase 2 ──────────────────────────────────────────────
  {
    to: "/observations",
    label: "Safety Observations",
    icon: Eye,
    section: "Phase 2",
    roles: ALL_ROLES,
  },
  {
    to: "/hira",
    label: "HIRA",
    icon: AlertTriangle,
    section: "Phase 2",
    roles: [Role.SystemAdmin, Role.SafetyOfficer, Role.HOD, Role.AreaInCharge],
  },
  {
    to: "/jsa",
    label: "Job Safety Analysis",
    icon: ClipboardList,
    section: "Phase 2",
    roles: [Role.SystemAdmin, Role.SafetyOfficer, Role.HOD],
  },
  {
    to: "/capa",
    label: "CAPA Tracking",
    icon: CheckSquare,
    section: "Phase 2",
    roles: ALL_ROLES,
  },
  {
    to: "/esg",
    label: "ESG / Environment",
    icon: Leaf,
    section: "Phase 2",
    roles: [Role.SystemAdmin, Role.SafetyOfficer],
  },
  {
    to: "/ai-risk",
    label: "AI Risk Scoring",
    icon: Brain,
    section: "Phase 2",
    roles: [Role.SystemAdmin, Role.SafetyOfficer],
  },
  {
    to: "/ppe-loto",
    label: "PPE & LOTO",
    icon: Shield,
    section: "Phase 2",
    roles: [
      Role.SystemAdmin,
      Role.SafetyOfficer,
      Role.Employee,
      Role.HOD,
      Role.AreaInCharge,
    ],
  },
  {
    to: "/contractor",
    label: "Contractor Safety",
    icon: Building2,
    section: "Phase 2",
    roles: [Role.SystemAdmin, Role.SafetyOfficer, Role.ContractorAdmin],
  },
];

const SECTIONS = ["Phase 1", "Phase 2"] as const;
type Section = (typeof SECTIONS)[number];

const SECTION_LABELS: Record<Section, string> = {
  "Phase 1": "Core Modules",
  "Phase 2": "Advanced Modules",
};

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user } = useAuth();
  const role = user?.role;
  const state = useRouterState();
  const isActive = (path: string) => state.location.pathname.startsWith(path);

  const visible = role
    ? NAV_ITEMS.filter((item) => item.roles.includes(role))
    : [];

  const bySection = SECTIONS.reduce<Record<Section, NavItem[]>>(
    (acc, s) => {
      acc[s] = visible.filter((i) => i.section === s);
      return acc;
    },
    { "Phase 1": [], "Phase 2": [] },
  );

  return (
    <aside className="flex flex-col h-full w-64 bg-card border-r border-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-xl font-bold tracking-widest text-foreground font-display">
            RKTR
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-medium tracking-wide">
          OHSE 360
        </span>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 px-3 py-4 overflow-y-auto space-y-4"
        aria-label="Main navigation"
      >
        {SECTIONS.map((section) => {
          const items = bySection[section];
          if (items.length === 0) return null;
          return (
            <div key={section}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {SECTION_LABELS[section]}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-ocid={`sidebar.${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.link`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                      isActive(item.to)
                        ? "bg-primary/15 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Role badge */}
      {user && (
        <div className="px-4 py-3 border-t border-border shrink-0">
          <p className="text-xs text-muted-foreground truncate">{user.name}</p>
          <p className="text-xs text-primary font-medium mt-0.5">{user.role}</p>
        </div>
      )}
    </aside>
  );
}
