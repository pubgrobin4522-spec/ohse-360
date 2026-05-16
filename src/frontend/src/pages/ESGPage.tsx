import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  CloudRain,
  Flame,
  Leaf,
  Plus,
  RefreshCw,
  Wind,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  AddAirEmissionInput,
  AddCarbonInput,
  AddEffluentInput,
  AddEnergyInput,
  AddWasteInput,
  AddWaterInput,
  AirEmissionEntry,
  CarbonEntry,
  EffluentEntry,
  EnergyEntry,
  WasteEntry,
  WaterEntry,
} from "../backend";
import {
  AirEmissionSource,
  AirPollutant,
  CarbonScope,
  EffluentParameter,
  EffluentType,
  EnergyType,
  WasteType,
  WaterSource,
} from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import { Role } from "../types";

// ─── helpers ─────────────────────────────────────────────────────────────────

const CARBON_FACTORS: Record<EnergyType, number> = {
  [EnergyType.Electricity]: 0.4,
  [EnergyType.Gas]: 2.0,
  [EnergyType.Diesel]: 2.68,
  [EnergyType.LPG]: 1.51,
  [EnergyType.Renewable]: 0.0,
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 4 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function fmtNum(n: number, d = 2) {
  if (!Number.isFinite(n)) return "—";
  return n.toFixed(d);
}

function tsToDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString();
}

// ─── gauge widget ─────────────────────────────────────────────────────────────

function GaugeWidget({
  label,
  value,
  unit = "%",
  loading,
}: {
  label: string;
  value: number;
  unit?: string;
  loading: boolean;
}) {
  const color = value >= 70 ? "#22c55e" : value >= 50 ? "#f59e0b" : "#ef4444";
  const pct = Math.min(100, Math.max(0, value));
  const dashOffset = 220 - (pct / 100) * 220;

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center justify-center p-6">
        {loading ? (
          <Skeleton className="h-24 w-24 rounded-full" />
        ) : (
          <>
            <div className="relative w-28 h-28">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full -rotate-90"
                role="img"
                aria-label="ESG gauge chart"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke={color}
                  strokeWidth="10"
                  strokeDasharray="220"
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold" style={{ color }}>
                  {fmtNum(value, 0)}
                  <span className="text-xs ml-0.5">{unit}</span>
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground text-center">
              {label}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  unit,
  icon,
  loading,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  loading: boolean;
}) {
  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardContent className="p-4 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
        <div className="min-w-0">
          {loading ? (
            <Skeleton className="h-5 w-20 mb-1" />
          ) : (
            <p className="text-lg font-bold text-foreground truncate">
              {value}{" "}
              <span className="text-xs text-muted-foreground font-normal">
                {unit}
              </span>
            </p>
          )}
          <p className="text-xs text-muted-foreground truncate">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── form field ───────────────────────────────────────────────────────────────

function FormRow({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      {children}
    </div>
  );
}

// ─── shared input classes ─────────────────────────────────────────────────────

const INPUT_CLS =
  "bg-white/5 border-white/20 text-foreground placeholder:text-muted-foreground";

// ─── Waste Tab ───────────────────────────────────────────────────────────────

function WasteTab({
  entries,
  canAdd,
  onAdd,
}: {
  entries: WasteEntry[];
  canAdd: boolean;
  onAdd: (data: AddWasteInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddWasteInput>({
    wasteType: WasteType.General,
    quantity: 0,
    unit: "kg",
    disposalMethod: "",
    contractorName: "",
    manifestNumber: "",
    disposalDate: "",
    department: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-2"
            data-ocid="esg.waste.add_button"
          >
            <Plus className="w-4 h-4" /> Add Waste Entry
          </Button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {[
                "Type",
                "Qty",
                "Unit",
                "Disposal Method",
                "Contractor",
                "Manifest #",
                "Date",
                "Dept",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-muted-foreground"
                  data-ocid="esg.waste.empty_state"
                >
                  No waste entries yet.
                </td>
              </tr>
            ) : (
              entries.map((e, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/5"
                  data-ocid={`esg.waste.item.${i + 1}`}
                >
                  <td className="px-3 py-2">{e.wasteType}</td>
                  <td className="px-3 py-2 text-right">
                    {fmtNum(e.quantity, 1)}
                  </td>
                  <td className="px-3 py-2">{e.unit}</td>
                  <td className="px-3 py-2">{e.disposalMethod}</td>
                  <td className="px-3 py-2">{e.contractorName || "—"}</td>
                  <td className="px-3 py-2">{e.manifestNumber || "—"}</td>
                  <td className="px-3 py-2">{e.disposalDate}</td>
                  <td className="px-3 py-2">{e.department}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-slate-900 border-white/10 max-w-lg"
          data-ocid="esg.waste.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Waste Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-2">
            <FormRow label="Waste Type">
              <Select
                value={form.wasteType}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, wasteType: v as WasteType }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WasteType).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Quantity">
              <Input
                type="number"
                min={0}
                step={0.01}
                value={form.quantity}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    quantity: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Unit">
              <Select
                value={form.unit}
                onValueChange={(v) => setForm((p) => ({ ...p, unit: v }))}
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["kg", "tonnes", "litres", "m³"].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Disposal Method">
              <Input
                value={form.disposalMethod}
                onChange={(e) =>
                  setForm((p) => ({ ...p, disposalMethod: e.target.value }))
                }
                className={INPUT_CLS}
                placeholder="e.g. Landfill, Incinerate"
              />
            </FormRow>
            <FormRow label="Contractor Name">
              <Input
                value={form.contractorName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contractorName: e.target.value }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Manifest Number">
              <Input
                value={form.manifestNumber}
                onChange={(e) =>
                  setForm((p) => ({ ...p, manifestNumber: e.target.value }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Disposal Date">
              <Input
                type="date"
                value={form.disposalDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, disposalDate: e.target.value }))
                }
                className={INPUT_CLS}
                required
              />
            </FormRow>
            <FormRow label="Department">
              <Input
                value={form.department}
                onChange={(e) =>
                  setForm((p) => ({ ...p, department: e.target.value }))
                }
                className={INPUT_CLS}
                required
              />
            </FormRow>
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="esg.waste.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                data-ocid="esg.waste.submit_button"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Air Emissions Tab ────────────────────────────────────────────────────────

function AirTab({
  entries,
  canAdd,
  onAdd,
}: {
  entries: AirEmissionEntry[];
  canAdd: boolean;
  onAdd: (data: AddAirEmissionInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddAirEmissionInput>({
    source: AirEmissionSource.Stack,
    pollutant: AirPollutant.CO2,
    value: 0,
    unit: "ppm",
    measurementDate: "",
    regulatoryLimit: 0,
    department: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-2"
            data-ocid="esg.air.add_button"
          >
            <Plus className="w-4 h-4" /> Add Air Emission
          </Button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {[
                "Source",
                "Pollutant",
                "Value",
                "Unit",
                "Reg. Limit",
                "Status",
                "Date",
                "Dept",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-muted-foreground"
                  data-ocid="esg.air.empty_state"
                >
                  No air emission records yet.
                </td>
              </tr>
            ) : (
              entries.map((e, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/5"
                  data-ocid={`esg.air.item.${i + 1}`}
                >
                  <td className="px-3 py-2">{e.source}</td>
                  <td className="px-3 py-2">{e.pollutant}</td>
                  <td className="px-3 py-2 text-right">{fmtNum(e.value, 3)}</td>
                  <td className="px-3 py-2">{e.unit}</td>
                  <td className="px-3 py-2 text-right">
                    {fmtNum(e.regulatoryLimit, 3)}
                  </td>
                  <td className="px-3 py-2">
                    {e.isExceeded ? (
                      <Badge variant="destructive" className="text-xs">
                        Exceeded
                      </Badge>
                    ) : (
                      <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        Within Limit
                      </Badge>
                    )}
                  </td>
                  <td className="px-3 py-2">{e.measurementDate}</td>
                  <td className="px-3 py-2">{e.department}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-slate-900 border-white/10 max-w-lg"
          data-ocid="esg.air.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Air Emission Reading</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-2">
            <FormRow label="Source">
              <Select
                value={form.source}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, source: v as AirEmissionSource }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AirEmissionSource).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Pollutant">
              <Select
                value={form.pollutant}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, pollutant: v as AirPollutant }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AirPollutant).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Measured Value">
              <Input
                type="number"
                step="0.001"
                value={form.value}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    value: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Unit">
              <Select
                value={form.unit}
                onValueChange={(v) => setForm((p) => ({ ...p, unit: v }))}
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["ppm", "mg/m³", "µg/m³", "tonnes", "%"].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Regulatory Limit">
              <Input
                type="number"
                step="0.001"
                value={form.regulatoryLimit}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    regulatoryLimit: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Measurement Date">
              <Input
                type="date"
                value={form.measurementDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, measurementDate: e.target.value }))
                }
                className={INPUT_CLS}
                required
              />
            </FormRow>
            <FormRow label="Department">
              <Input
                value={form.department}
                onChange={(e) =>
                  setForm((p) => ({ ...p, department: e.target.value }))
                }
                className={INPUT_CLS}
                required
              />
            </FormRow>
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="esg.air.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                data-ocid="esg.air.submit_button"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Water Tab ────────────────────────────────────────────────────────────────

function WaterTab({
  entries,
  canAdd,
  onAdd,
}: {
  entries: WaterEntry[];
  canAdd: boolean;
  onAdd: (data: AddWaterInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddWaterInput>({
    source: WaterSource.Municipal,
    consumption: 0,
    target: 0,
    month: BigInt(new Date().getMonth() + 1),
    year: BigInt(CURRENT_YEAR),
    department: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-2"
            data-ocid="esg.water.add_button"
          >
            <Plus className="w-4 h-4" /> Add Water Entry
          </Button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {[
                "Source",
                "Consumption (m³)",
                "Target (m³)",
                "vs Target",
                "Month",
                "Year",
                "Dept",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-muted-foreground"
                  data-ocid="esg.water.empty_state"
                >
                  No water entries yet.
                </td>
              </tr>
            ) : (
              entries.map((e, i) => {
                const overTarget = e.consumption > e.target && e.target > 0;
                return (
                  <tr
                    key={i}
                    className="border-t border-white/5 hover:bg-white/5"
                    data-ocid={`esg.water.item.${i + 1}`}
                  >
                    <td className="px-3 py-2">{e.source}</td>
                    <td className="px-3 py-2 text-right">
                      {fmtNum(e.consumption, 1)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {fmtNum(e.target, 1)}
                    </td>
                    <td className="px-3 py-2">
                      {e.target > 0 &&
                        (overTarget ? (
                          <Badge variant="destructive" className="text-xs">
                            Over Target
                          </Badge>
                        ) : (
                          <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            Within Target
                          </Badge>
                        ))}
                    </td>
                    <td className="px-3 py-2">{MONTHS[Number(e.month) - 1]}</td>
                    <td className="px-3 py-2">{String(e.year)}</td>
                    <td className="px-3 py-2">{e.department}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-slate-900 border-white/10 max-w-md"
          data-ocid="esg.water.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Water Consumption</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-2">
            <FormRow label="Source">
              <Select
                value={form.source}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, source: v as WaterSource }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WaterSource).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Consumption (m³)">
              <Input
                type="number"
                step="0.1"
                value={form.consumption}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    consumption: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Monthly Target (m³)">
              <Input
                type="number"
                step="0.1"
                value={form.target}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    target: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Month">
              <Select
                value={String(form.month)}
                onValueChange={(_v) =>
                  setForm((p) => ({ ...p, month: BigInt(_v) }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Year">
              <Select
                value={String(form.year)}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, year: BigInt(v) }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Department">
              <Input
                value={form.department}
                onChange={(e) =>
                  setForm((p) => ({ ...p, department: e.target.value }))
                }
                className={INPUT_CLS}
                required
              />
            </FormRow>
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="esg.water.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                data-ocid="esg.water.submit_button"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Effluent Tab ─────────────────────────────────────────────────────────────

function EffluentTab({
  entries,
  canAdd,
  onAdd,
}: {
  entries: EffluentEntry[];
  canAdd: boolean;
  onAdd: (data: AddEffluentInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddEffluentInput>({
    effluentType: EffluentType.Process,
    parameter: EffluentParameter.COD,
    value: 0,
    regulatoryLimit: 0,
    samplingDate: "",
    department: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-2"
            data-ocid="esg.effluent.add_button"
          >
            <Plus className="w-4 h-4" /> Add Effluent Entry
          </Button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {[
                "Type",
                "Parameter",
                "Value",
                "Reg. Limit",
                "Compliance",
                "Sampling Date",
                "Dept",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-8 text-center text-muted-foreground"
                  data-ocid="esg.effluent.empty_state"
                >
                  No effluent records yet.
                </td>
              </tr>
            ) : (
              entries.map((e, i) => (
                <tr
                  key={i}
                  className={`border-t border-white/5 hover:bg-white/5 ${!e.isCompliant ? "bg-red-500/5" : ""}`}
                  data-ocid={`esg.effluent.item.${i + 1}`}
                >
                  <td className="px-3 py-2">{e.effluentType}</td>
                  <td className="px-3 py-2">{e.parameter}</td>
                  <td className="px-3 py-2 text-right font-mono">
                    {fmtNum(e.value, 3)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {fmtNum(e.regulatoryLimit, 3)}
                  </td>
                  <td className="px-3 py-2">
                    {e.isCompliant ? (
                      <span className="flex items-center gap-1 text-green-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        Compliant
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Non-Compliant
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{e.samplingDate}</td>
                  <td className="px-3 py-2">{e.department}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-slate-900 border-white/10 max-w-lg"
          data-ocid="esg.effluent.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Effluent Reading</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-2">
            <FormRow label="Effluent Type">
              <Select
                value={form.effluentType}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, effluentType: v as EffluentType }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EffluentType).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Parameter">
              <Select
                value={form.parameter}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, parameter: v as EffluentParameter }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EffluentParameter).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Measured Value">
              <Input
                type="number"
                step="0.001"
                value={form.value}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    value: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Regulatory Limit">
              <Input
                type="number"
                step="0.001"
                value={form.regulatoryLimit}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    regulatoryLimit: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Sampling Date">
              <Input
                type="date"
                value={form.samplingDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, samplingDate: e.target.value }))
                }
                className={INPUT_CLS}
                required
              />
            </FormRow>
            <FormRow label="Department">
              <Input
                value={form.department}
                onChange={(e) =>
                  setForm((p) => ({ ...p, department: e.target.value }))
                }
                className={INPUT_CLS}
                required
              />
            </FormRow>
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="esg.effluent.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                data-ocid="esg.effluent.submit_button"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Energy Tab ───────────────────────────────────────────────────────────────

function EnergyTab({
  entries,
  canAdd,
  onAdd,
}: {
  entries: EnergyEntry[];
  canAdd: boolean;
  onAdd: (data: AddEnergyInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    energyType: EnergyType.Electricity,
    consumption: 0,
    unit: "kWh",
    target: 0,
    month: new Date().getMonth() + 1,
    year: CURRENT_YEAR,
    department: "",
  });
  const [saving, setSaving] = useState(false);

  const carbonEq = form.consumption * CARBON_FACTORS[form.energyType];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const input: AddEnergyInput = {
      energyType: form.energyType,
      consumption: form.consumption,
      unit: form.unit,
      target: form.target,
      month: BigInt(form.month),
      year: BigInt(form.year),
      department: form.department,
      carbonEquivalent: carbonEq,
    };
    try {
      await onAdd(input);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {canAdd && (
        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-2"
            data-ocid="esg.energy.add_button"
          >
            <Plus className="w-4 h-4" /> Add Energy Entry
          </Button>
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {[
                "Type",
                "Consumption",
                "Unit",
                "Target",
                "vs Target",
                "Carbon Eq.",
                "Month",
                "Year",
                "Dept",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-8 text-center text-muted-foreground"
                  data-ocid="esg.energy.empty_state"
                >
                  No energy records yet.
                </td>
              </tr>
            ) : (
              entries.map((e, i) => {
                const over = e.consumption > e.target && e.target > 0;
                return (
                  <tr
                    key={i}
                    className="border-t border-white/5 hover:bg-white/5"
                    data-ocid={`esg.energy.item.${i + 1}`}
                  >
                    <td className="px-3 py-2">{e.energyType}</td>
                    <td className="px-3 py-2 text-right">
                      {fmtNum(e.consumption, 1)}
                    </td>
                    <td className="px-3 py-2">{e.unit}</td>
                    <td className="px-3 py-2 text-right">
                      {fmtNum(e.target, 1)}
                    </td>
                    <td className="px-3 py-2">
                      {e.target > 0 &&
                        (over ? (
                          <Badge variant="destructive" className="text-xs">
                            Over Target
                          </Badge>
                        ) : (
                          <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            OK
                          </Badge>
                        ))}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {fmtNum(e.carbonEquivalent, 2)} kg
                    </td>
                    <td className="px-3 py-2">{MONTHS[Number(e.month) - 1]}</td>
                    <td className="px-3 py-2">{String(e.year)}</td>
                    <td className="px-3 py-2">{e.department}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-slate-900 border-white/10 max-w-lg"
          data-ocid="esg.energy.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Energy Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-2">
            <FormRow label="Energy Type">
              <Select
                value={form.energyType}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    energyType: v as EnergyType,
                    unit:
                      v === EnergyType.Electricity
                        ? "kWh"
                        : v === EnergyType.Gas
                          ? "m³"
                          : "litres",
                  }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EnergyType).map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Unit">
              <Select
                value={form.unit}
                onValueChange={(v) => setForm((p) => ({ ...p, unit: v }))}
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["kWh", "MWh", "m³", "litres", "GJ"].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Consumption">
              <Input
                type="number"
                step="0.1"
                value={form.consumption}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    consumption: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Target">
              <Input
                type="number"
                step="0.1"
                value={form.target}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    target: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Month">
              <Select
                value={String(form.month)}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, month: Number.parseInt(v) }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Year">
              <Select
                value={String(form.year)}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, year: Number.parseInt(v) }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Department">
              <Input
                value={form.department}
                onChange={(e) =>
                  setForm((p) => ({ ...p, department: e.target.value }))
                }
                className={INPUT_CLS}
                required
              />
            </FormRow>
            {/* Carbon equivalent preview */}
            <div className="col-span-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3">
              <p className="text-xs text-muted-foreground">
                Carbon Equivalent (auto-calculated)
              </p>
              <p className="text-lg font-bold text-cyan-400">
                {fmtNum(carbonEq, 3)} kg CO₂e
              </p>
              <p className="text-xs text-muted-foreground">
                Factor: {CARBON_FACTORS[form.energyType]} kg CO₂e / unit
              </p>
            </div>
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="esg.energy.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                data-ocid="esg.energy.submit_button"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Carbon Tab ───────────────────────────────────────────────────────────────

function CarbonTab({
  entries,
  canAdd,
  onAdd,
}: {
  entries: CarbonEntry[];
  canAdd: boolean;
  onAdd: (data: AddCarbonInput) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddCarbonInput>({
    scope: CarbonScope.Scope1,
    co2eTonnes: 0,
    month: BigInt(new Date().getMonth() + 1),
    year: BigInt(CURRENT_YEAR),
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const totalCO2e = entries.reduce((acc, e) => acc + e.co2eTonnes, 0);

  // build monthly trend
  const trendMap = new Map<string, number>();
  for (const e of entries) {
    const key = `${MONTHS[Number(e.month) - 1]} ${e.year}`;
    trendMap.set(key, (trendMap.get(key) || 0) + e.co2eTonnes);
  }
  const trendData = Array.from(trendMap.entries())
    .slice(-12)
    .map(([month, co2e]) => ({ month, co2e }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Total CO2e summary */}
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-4 py-2 flex items-center gap-3">
          <Flame className="w-5 h-5 text-orange-400" />
          <div>
            <p className="text-xs text-muted-foreground">Total CO₂e</p>
            <p className="text-xl font-bold text-orange-400">
              {fmtNum(totalCO2e, 2)}{" "}
              <span className="text-sm font-normal">tonnes</span>
            </p>
          </div>
        </div>
        {canAdd && (
          <Button
            type="button"
            size="sm"
            onClick={() => setOpen(true)}
            className="gap-2"
            data-ocid="esg.carbon.add_button"
          >
            <Plus className="w-4 h-4" /> Add Carbon Entry
          </Button>
        )}
      </div>
      {/* Monthly trend */}
      {trendData.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly CO₂e Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={trendData}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="co2e"
                  stroke="#f97316"
                  fill="url(#carbonGrad)"
                  strokeWidth={2}
                  name="CO₂e (tonnes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {[
                "Scope",
                "CO₂e (tonnes)",
                "Month",
                "Year",
                "Description",
                "Logged",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-2 text-muted-foreground font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-muted-foreground"
                  data-ocid="esg.carbon.empty_state"
                >
                  No carbon records yet.
                </td>
              </tr>
            ) : (
              entries.map((e, i) => (
                <tr
                  key={i}
                  className="border-t border-white/5 hover:bg-white/5"
                  data-ocid={`esg.carbon.item.${i + 1}`}
                >
                  <td className="px-3 py-2">
                    <Badge
                      className={`text-xs ${
                        e.scope === CarbonScope.Scope1
                          ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
                          : e.scope === CarbonScope.Scope2
                            ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            : "bg-purple-500/20 text-purple-400 border-purple-500/30"
                      }`}
                    >
                      {e.scope}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold">
                    {fmtNum(e.co2eTonnes, 3)}
                  </td>
                  <td className="px-3 py-2">{MONTHS[Number(e.month) - 1]}</td>
                  <td className="px-3 py-2">{String(e.year)}</td>
                  <td className="px-3 py-2 max-w-[200px] truncate">
                    {e.description || "—"}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {tsToDate(e.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-slate-900 border-white/10 max-w-md"
          data-ocid="esg.carbon.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Carbon Entry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-2">
            <FormRow label="Scope">
              <Select
                value={form.scope}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, scope: v as CarbonScope }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CarbonScope.Scope1}>
                    Scope 1 (Direct — Fuel, Vehicles)
                  </SelectItem>
                  <SelectItem value={CarbonScope.Scope2}>
                    Scope 2 (Purchased Electricity)
                  </SelectItem>
                  <SelectItem value={CarbonScope.Scope3}>
                    Scope 3 (Value Chain)
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="CO₂e (tonnes)">
              <Input
                type="number"
                step="0.001"
                value={form.co2eTonnes}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    co2eTonnes: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                className={INPUT_CLS}
              />
            </FormRow>
            <FormRow label="Month">
              <Select
                value={String(form.month)}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, month: BigInt(v) }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={String(i + 1)}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Year">
              <Select
                value={String(form.year)}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, year: BigInt(v) }))
                }
              >
                <SelectTrigger className={INPUT_CLS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormRow>
            <div className="col-span-2">
              <FormRow label="Description">
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className={INPUT_CLS}
                  placeholder="e.g. Diesel generator fuel usage"
                />
              </FormRow>
            </div>
            <div className="col-span-2 flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-ocid="esg.carbon.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                data-ocid="esg.carbon.submit_button"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ESGPage() {
  const { user } = useAuth();
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();

  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>(String(CURRENT_YEAR));

  const canAdd =
    user?.role === Role.SafetyOfficer || user?.role === Role.SystemAdmin;

  // ── queries ──
  const statsQ = useQuery({
    queryKey: ["esgStats", filterMonth, filterYear],
    queryFn: async () => {
      if (!actor || !token) return null;
      const month = filterMonth === "all" ? null : BigInt(filterMonth);
      const year = filterYear === "all" ? null : BigInt(filterYear);
      const res = await actor.getEsgStats(token, month, year, null);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  const dataQ = useQuery({
    queryKey: ["esgData"],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getEsgData(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  // ── mutations ──
  function useMut<T>(
    fn: (
      a: typeof actor,
      t: string,
      d: T,
    ) => Promise<{ __kind__: string; err?: string }>,
  ) {
    return useMutation({
      mutationFn: async (data: T) => {
        if (!actor || !token) throw new Error("Not authenticated");
        const res = await fn(actor, token, data);
        if (res.__kind__ === "err") throw new Error(res.err);
      },
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["esgData"] });
        qc.invalidateQueries({ queryKey: ["esgStats"] });
      },
    });
  }

  const addWaste = useMut<AddWasteInput>((a, t, d) => a!.addWasteEntry(t, d));
  const addAir = useMut<AddAirEmissionInput>((a, t, d) =>
    a!.addAirEmission(t, d),
  );
  const addWater = useMut<AddWaterInput>((a, t, d) => a!.addWaterEntry(t, d));
  const addEffluent = useMut<AddEffluentInput>((a, t, d) =>
    a!.addEffluentEntry(t, d),
  );
  const addEnergy = useMut<AddEnergyInput>((a, t, d) =>
    a!.addEnergyEntry(t, d),
  );
  const addCarbon = useMut<AddCarbonInput>((a, t, d) =>
    a!.addCarbonEntry(t, d),
  );

  const stats = statsQ.data;
  const data = dataQ.data;
  const loadingStats = statsQ.isLoading;

  // ── ESG trend data from trendData field ──
  const trendChartData = (stats?.trendData ?? []).map(([label, val]) => ({
    label,
    value: val,
  }));

  // ── YoY comparison from raw data ──
  const yoyData = [2024, 2025, 2026].map((yr) => {
    const energySum = (data?.energy ?? [])
      .filter((e) => Number(e.year) === yr)
      .reduce((s, e) => s + e.consumption, 0);
    const carbonSum = (data?.carbon ?? [])
      .filter((e) => Number(e.year) === yr)
      .reduce((s, e) => s + e.co2eTonnes, 0);
    const wasteSum = (data?.waste ?? [])
      .filter((e) => new Date(e.disposalDate).getFullYear() === yr)
      .reduce((s, e) => s + e.quantity, 0);
    const waterSum = (data?.water ?? [])
      .filter((e) => Number(e.year) === yr)
      .reduce((s, e) => s + e.consumption, 0);
    return {
      year: String(yr),
      energy: energySum,
      carbon: carbonSum,
      waste: wasteSum,
      water: waterSum,
    };
  });

  const compliancePieData = [
    { name: "Compliant", value: Number(stats?.complianceRate ?? 0) },
    {
      name: "Non-Compliant",
      value: Math.max(0, 100 - Number(stats?.complianceRate ?? 0)),
    },
  ];
  const PIE_COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="space-y-6 p-6" data-ocid="esg.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-400" />
            Environmental Monitoring & ESG
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track environmental performance and ESG compliance across all
            parameters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterMonth} onValueChange={setFilterMonth}>
            <SelectTrigger
              className="w-28 bg-white/5 border-white/20"
              data-ocid="esg.month_filter"
            >
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {MONTHS.map((m, i) => (
                <SelectItem key={i} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterYear} onValueChange={setFilterYear}>
            <SelectTrigger
              className="w-24 bg-white/5 border-white/20"
              data-ocid="esg.year_filter"
            >
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {YEARS.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              statsQ.refetch();
              dataQ.refetch();
            }}
            data-ocid="esg.refresh_button"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ESG Dashboard */}
      <section data-ocid="esg.dashboard.section">
        {/* Gauges + stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <GaugeWidget
            label="ESG Score"
            value={Number(stats?.esgScore ?? 0)}
            loading={loadingStats}
          />
          <GaugeWidget
            label="Compliance Rate"
            value={Number(stats?.complianceRate ?? 0)}
            loading={loadingStats}
          />
          <StatCard
            label="Carbon Total"
            value={fmtNum(stats?.carbonTotal ?? 0, 2)}
            unit="t CO₂e"
            icon={<Flame className="w-4 h-4" />}
            loading={loadingStats}
          />
          <StatCard
            label="Energy Total"
            value={fmtNum(stats?.energyTotal ?? 0, 1)}
            unit="kWh"
            icon={<Zap className="w-4 h-4" />}
            loading={loadingStats}
          />
          <StatCard
            label="Water Total"
            value={fmtNum(stats?.waterTotal ?? 0, 1)}
            unit="m³"
            icon={<CloudRain className="w-4 h-4" />}
            loading={loadingStats}
          />
          <StatCard
            label="Waste Total"
            value={fmtNum(stats?.wasteTotal ?? 0, 1)}
            unit="kg"
            icon={<Wind className="w-4 h-4" />}
            loading={loadingStats}
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ESG Trend */}
          <Card
            className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm"
            data-ocid="esg.trend.card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">ESG Trend (12 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={trendChartData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#1e293b",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                      name="ESG Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Compliance Pie */}
          <Card
            className="bg-white/5 border-white/10 backdrop-blur-sm"
            data-ocid="esg.compliance.card"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Environmental Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <Skeleton className="h-48 w-full" />
              ) : (
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={compliancePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {compliancePieData.map((_entry, idx) => (
                          <Cell key={idx} fill={PIE_COLORS[idx]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "#1e293b",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      Compliant {compliancePieData[0].value}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                      Non-Compliant {compliancePieData[1].value}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* YoY Comparison */}
        <Card
          className="bg-white/5 border-white/10 backdrop-blur-sm mt-4"
          data-ocid="esg.yoy.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Year-on-Year ESG Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dataQ.isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={yoyData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
                  <Bar
                    dataKey="carbon"
                    name="Carbon (t)"
                    fill="#f97316"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="energy"
                    name="Energy (kWh)"
                    fill="#06b6d4"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="water"
                    name="Water (m³)"
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="waste"
                    name="Waste (kg)"
                    fill="#a855f7"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Data Tabs */}
      <Tabs defaultValue="waste" data-ocid="esg.data_tabs">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="waste" data-ocid="esg.tab.waste">
            🗑 Waste
          </TabsTrigger>
          <TabsTrigger value="air" data-ocid="esg.tab.air">
            💨 Air
          </TabsTrigger>
          <TabsTrigger value="water" data-ocid="esg.tab.water">
            💧 Water
          </TabsTrigger>
          <TabsTrigger value="effluent" data-ocid="esg.tab.effluent">
            🌊 Effluent
          </TabsTrigger>
          <TabsTrigger value="energy" data-ocid="esg.tab.energy">
            ⚡ Energy
          </TabsTrigger>
          <TabsTrigger value="carbon" data-ocid="esg.tab.carbon">
            🔥 Carbon
          </TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="waste">
            <WasteTab
              entries={data?.waste ?? []}
              canAdd={canAdd}
              onAdd={(d) => addWaste.mutateAsync(d)}
            />
          </TabsContent>
          <TabsContent value="air">
            <AirTab
              entries={data?.air ?? []}
              canAdd={canAdd}
              onAdd={(d) => addAir.mutateAsync(d)}
            />
          </TabsContent>
          <TabsContent value="water">
            <WaterTab
              entries={data?.water ?? []}
              canAdd={canAdd}
              onAdd={(d) => addWater.mutateAsync(d)}
            />
          </TabsContent>
          <TabsContent value="effluent">
            <EffluentTab
              entries={data?.effluent ?? []}
              canAdd={canAdd}
              onAdd={(d) => addEffluent.mutateAsync(d)}
            />
          </TabsContent>
          <TabsContent value="energy">
            <EnergyTab
              entries={data?.energy ?? []}
              canAdd={canAdd}
              onAdd={(d) => addEnergy.mutateAsync(d)}
            />
          </TabsContent>
          <TabsContent value="carbon">
            <CarbonTab
              entries={data?.carbon ?? []}
              canAdd={canAdd}
              onAdd={(d) => addCarbon.mutateAsync(d)}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
