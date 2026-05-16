import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BatteryWarning,
  ChevronLeft,
  HardHat,
  ListChecks,
  Lock,
  LockOpen,
  Package,
  PackageCheck,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  type CreateLOTOInput,
  EnergySourceLOTO,
  type LOTOStatus,
  type LOTOView,
  LockEntryStatus,
  PPEConditionIssue,
  PPEInspectionCondition,
  type PPEInventoryView,
  type PPEIssuance,
  type PPEItem,
} from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// ── helpers ─────────────────────────────────────────────────────────────────

function ts(n: bigint): string {
  if (!n) return "—";
  return new Date(Number(n) / 1_000_000).toLocaleString();
}

function canManage(role: string) {
  return ["SystemAdmin", "SafetyOfficer"].includes(role);
}

// ── LOTO status badge ────────────────────────────────────────────────────────

function LotoBadge({ status }: { status: LOTOStatus }) {
  const map: Record<LOTOStatus, string> = {
    Draft: "bg-muted/50 text-muted-foreground border-border",
    Active: "bg-destructive/20 text-destructive border-destructive/40",
    Completed: "bg-primary/20 text-primary border-primary/40",
    Cancelled: "bg-muted/40 text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status]}`}
    >
      {status === "Active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
      )}
      {status}
    </span>
  );
}

// ── PPE Stats bar ────────────────────────────────────────────────────────────

function PpeStatsBar() {
  const { actor, token } = useBackend();
  const { data } = useQuery({
    queryKey: ["ppeStats"],
    queryFn: async () => {
      const r = await actor!.getPpeStats(token!);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const stats = [
    {
      label: "PPE Compliance",
      value: data ? `${data.complianceRate}%` : "—",
      icon: <ShieldCheck className="w-4 h-4" />,
      color: "text-primary",
    },
    {
      label: "Total Items",
      value: data ? String(data.totalItems) : "—",
      icon: <Package className="w-4 h-4" />,
      color: "text-foreground",
    },
    {
      label: "Low Stock",
      value: data ? String(data.issuanceCount) : "—",
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "text-secondary",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card/60 backdrop-blur border border-border/50 rounded-xl p-4 flex items-center gap-3"
        >
          <span className={s.color}>{s.icon}</span>
          <div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── LOTO Stats bar ───────────────────────────────────────────────────────────

function LotoStatsBar() {
  const { actor, token } = useBackend();
  const { data } = useQuery({
    queryKey: ["lotoStats"],
    queryFn: async () => {
      const r = await actor!.getLotoStats(token!);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const stats = [
    {
      label: "Active LOTOs",
      value: data ? String(data.active) : "—",
      icon: <Lock className="w-4 h-4" />,
      color: data && data.active > 0n ? "text-destructive" : "text-foreground",
    },
    {
      label: "Completed This Month",
      value: data ? String(data.completedThisMonth) : "—",
      icon: <ShieldCheck className="w-4 h-4" />,
      color: "text-primary",
    },
    {
      label: "Overdue",
      value: data ? String(data.overdue) : "—",
      icon: <ShieldAlert className="w-4 h-4" />,
      color:
        data && data.overdue > 0n
          ? "text-destructive"
          : "text-muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card/60 backdrop-blur border border-border/50 rounded-xl p-4 flex items-center gap-3"
        >
          <span className={s.color}>{s.icon}</span>
          <div>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PPE Item Master ──────────────────────────────────────────────────────────

function PpeItemMaster({ canEdit }: { canEdit: boolean }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    itemName: "",
    itemType: "",
    size: "",
    standard: "",
    shelfLifeMonths: "",
  });

  const { data: items = [], isLoading } = useQuery<PPEItem[]>({
    queryKey: ["ppeItems"],
    queryFn: async () => {
      const r = await actor!.listPpeItems(token!);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const addMut = useMutation({
    mutationFn: async () => {
      const r = await actor!.createPpeItem(token!, {
        itemName: form.itemName,
        itemType: form.itemType,
        size: form.size,
        standard: form.standard,
        shelfLifeMonths: BigInt(form.shelfLifeMonths || "0"),
      });
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ppeItems"] });
      qc.invalidateQueries({ queryKey: ["ppeStats"] });
      toast.success("PPE item added");
      setOpen(false);
      setForm({
        itemName: "",
        itemType: "",
        size: "",
        standard: "",
        shelfLifeMonths: "",
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      {canEdit && (
        <div className="flex justify-end mb-3">
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            data-ocid="ppe.item_master.add_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Add PPE Item
          </Button>
        </div>
      )}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="ppe.item_master.empty_state"
        >
          <HardHat className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No PPE items in master. Add one to get started.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-card/80">
              <tr className="text-left text-muted-foreground">
                {[
                  "Item ID",
                  "Name",
                  "Type",
                  "Size",
                  "Standard",
                  "Shelf Life (mo)",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.itemId}
                  className="border-t border-border/30 hover:bg-card/40"
                  data-ocid={`ppe.item_master.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {item.itemId.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 font-medium">{item.itemName}</td>
                  <td className="px-4 py-3">{item.itemType}</td>
                  <td className="px-4 py-3">{item.size}</td>
                  <td className="px-4 py-3">{item.standard}</td>
                  <td className="px-4 py-3 text-right">
                    {String(item.shelfLifeMonths)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="ppe.add_item.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add PPE Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {(["itemName", "itemType", "size", "standard"] as const).map(
              (f) => (
                <div key={f}>
                  <Label className="capitalize mb-1 block">
                    {f.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <Input
                    value={form[f]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [f]: e.target.value }))
                    }
                    data-ocid={`ppe.add_item.${f}_input`}
                  />
                </div>
              ),
            )}
            <div>
              <Label className="mb-1 block">Shelf Life (months)</Label>
              <Input
                type="number"
                min="0"
                value={form.shelfLifeMonths}
                onChange={(e) =>
                  setForm((p) => ({ ...p, shelfLifeMonths: e.target.value }))
                }
                data-ocid="ppe.add_item.shelf_life_input"
              />
            </div>
            <Button
              onClick={() => addMut.mutate()}
              disabled={addMut.isPending || !form.itemName}
              data-ocid="ppe.add_item.submit_button"
            >
              {addMut.isPending ? "Saving..." : "Add Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── PPE Inventory ────────────────────────────────────────────────────────────

function PpeInventory({ canEdit }: { canEdit: boolean }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [qty, setQty] = useState("");
  const [minLevel, setMinLevel] = useState("");

  const { data: inv = [], isLoading } = useQuery<PPEInventoryView[]>({
    queryKey: ["ppeInventory"],
    queryFn: async () => {
      const r = await actor!.listPpeInventory(token!);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const { data: items = [] } = useQuery<PPEItem[]>({
    queryKey: ["ppeItems"],
    queryFn: async () => {
      const r = await actor!.listPpeItems(token!);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const itemMap = Object.fromEntries(items.map((i) => [i.itemId, i]));

  const updateMut = useMutation({
    mutationFn: async () => {
      const r = await actor!.updatePpeInventory(
        token!,
        editId!,
        BigInt(qty || "0"),
        BigInt(minLevel || "0"),
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ppeInventory"] });
      qc.invalidateQueries({ queryKey: ["ppeStats"] });
      toast.success("Inventory updated");
      setEditId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : inv.length === 0 ? (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="ppe.inventory.empty_state"
        >
          <PackageCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No inventory records yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-card/80">
              <tr className="text-left text-muted-foreground">
                {[
                  "Item Name",
                  "In Stock",
                  "Min Level",
                  "Status",
                  "Last Updated",
                  "",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inv.map((row, i) => {
                const item = itemMap[row.itemId];
                const isLow = row.quantityInStock <= row.minStockLevel;
                return (
                  <tr
                    key={row.itemId}
                    className="border-t border-border/30 hover:bg-card/40"
                    data-ocid={`ppe.inventory.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium">
                      {item?.itemName ?? row.itemId}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {String(row.quantityInStock)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {String(row.minStockLevel)}
                    </td>
                    <td className="px-4 py-3">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-destructive/20 text-destructive border-destructive/40">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-primary/20 text-primary border-primary/40">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {ts(row.lastUpdated)}
                    </td>
                    <td className="px-4 py-3">
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditId(row.itemId);
                            setQty(String(row.quantityInStock));
                            setMinLevel(String(row.minStockLevel));
                          }}
                          data-ocid={`ppe.inventory.edit_button.${i + 1}`}
                        >
                          Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!editId} onOpenChange={(o) => !o && setEditId(null)}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="ppe.update_inventory.dialog"
        >
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label className="mb-1 block">
                Quantity Delta (+ add, – remove)
              </Label>
              <Input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                data-ocid="ppe.update_inventory.qty_input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Min Stock Level</Label>
              <Input
                type="number"
                value={minLevel}
                onChange={(e) => setMinLevel(e.target.value)}
                data-ocid="ppe.update_inventory.min_input"
              />
            </div>
            <Button
              onClick={() => updateMut.mutate()}
              disabled={updateMut.isPending}
              data-ocid="ppe.update_inventory.submit_button"
            >
              {updateMut.isPending ? "Saving..." : "Update"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── PPE Issuances ────────────────────────────────────────────────────────────

function PpeIssuances({ canEdit }: { canEdit: boolean }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [filterEmp, setFilterEmp] = useState("");
  const [form, setForm] = useState({
    employeeId: "",
    itemId: "",
    size: "",
    quantity: "1",
    condition: PPEConditionIssue.New,
  });

  const { data: issuances = [], isLoading } = useQuery<PPEIssuance[]>({
    queryKey: ["ppeIssuances"],
    queryFn: async () => {
      const r = await actor!.listPpeIssuances(token!, null);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const { data: items = [] } = useQuery<PPEItem[]>({
    queryKey: ["ppeItems"],
    queryFn: async () => {
      const r = await actor!.listPpeItems(token!);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const itemMap = Object.fromEntries(items.map((i) => [i.itemId, i]));

  const filtered = filterEmp
    ? issuances.filter((i) => String(i.employeeId).includes(filterEmp))
    : issuances;

  const issueMut = useMutation({
    mutationFn: async () => {
      const r = await actor!.issuePpe(
        token!,
        BigInt(form.employeeId),
        form.itemId,
        form.size,
        BigInt(form.quantity),
        form.condition,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ppeIssuances"] });
      toast.success("PPE issued");
      setOpen(false);
      setForm({
        employeeId: "",
        itemId: "",
        size: "",
        quantity: "1",
        condition: PPEConditionIssue.New,
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <Input
          placeholder="Filter by Employee ID"
          value={filterEmp}
          onChange={(e) => setFilterEmp(e.target.value)}
          className="max-w-xs"
          data-ocid="ppe.issuances.search_input"
        />
        {canEdit && (
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            className="ml-auto"
            data-ocid="ppe.issuances.add_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Issue PPE
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="ppe.issuances.empty_state"
        >
          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No issuances found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-card/80">
              <tr className="text-left text-muted-foreground">
                {[
                  "Issuance ID",
                  "Employee ID",
                  "Item",
                  "Size",
                  "Qty",
                  "Issue Date",
                  "Condition",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={row.issuanceId}
                  className="border-t border-border/30 hover:bg-card/40"
                  data-ocid={`ppe.issuances.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {row.issuanceId.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3">{String(row.employeeId)}</td>
                  <td className="px-4 py-3">
                    {itemMap[row.itemId]?.itemName ?? row.itemId}
                  </td>
                  <td className="px-4 py-3">{row.size}</td>
                  <td className="px-4 py-3 text-right">
                    {String(row.quantity)}
                  </td>
                  <td className="px-4 py-3">{row.issueDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        row.condition === "New"
                          ? "bg-primary/20 text-primary border-primary/40"
                          : "bg-secondary/20 text-secondary border-secondary/40"
                      }`}
                    >
                      {row.condition}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="ppe.issue_ppe.dialog"
        >
          <DialogHeader>
            <DialogTitle>Issue PPE</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label className="mb-1 block">Employee ID</Label>
              <Input
                type="number"
                value={form.employeeId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, employeeId: e.target.value }))
                }
                data-ocid="ppe.issue_ppe.employee_input"
              />
            </div>
            <div>
              <Label className="mb-1 block">PPE Item</Label>
              <Select
                value={form.itemId}
                onValueChange={(v) => setForm((p) => ({ ...p, itemId: v }))}
              >
                <SelectTrigger data-ocid="ppe.issue_ppe.item_select">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((it) => (
                    <SelectItem key={it.itemId} value={it.itemId}>
                      {it.itemName} ({it.itemType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="mb-1 block">Size</Label>
                <Input
                  value={form.size}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, size: e.target.value }))
                  }
                  data-ocid="ppe.issue_ppe.size_input"
                />
              </div>
              <div>
                <Label className="mb-1 block">Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, quantity: e.target.value }))
                  }
                  data-ocid="ppe.issue_ppe.qty_input"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1 block">Condition</Label>
              <Select
                value={form.condition}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, condition: v as PPEConditionIssue }))
                }
              >
                <SelectTrigger data-ocid="ppe.issue_ppe.condition_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Reissued">Reissued</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => issueMut.mutate()}
              disabled={issueMut.isPending || !form.employeeId || !form.itemId}
              data-ocid="ppe.issue_ppe.submit_button"
            >
              {issueMut.isPending ? "Issuing..." : "Issue PPE"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── PPE Inspections ──────────────────────────────────────────────────────────

interface InspectionRecord {
  id: string;
  itemId: string;
  inspector: string;
  inspectionDate: string;
  condition: PPEInspectionCondition;
  remarks: string;
}

function PpeInspections({ canEdit }: { canEdit: boolean }) {
  const { actor, token } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const inspectionsRef = useRef<InspectionRecord[]>([]);
  const [, forceUpdate] = useState(0);
  const inspections = inspectionsRef.current;
  const [form, setForm] = useState({
    itemId: "",
    condition: PPEInspectionCondition.Good,
    remarks: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const { data: items = [] } = useQuery<PPEItem[]>({
    queryKey: ["ppeItems"],
    queryFn: async () => {
      const r = await actor!.listPpeItems(token!);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const itemMap = Object.fromEntries(items.map((i) => [i.itemId, i]));

  const recordMut = useMutation({
    mutationFn: async () => {
      const r = await actor!.recordPpeInspection(
        token!,
        form.itemId,
        form.condition,
        form.remarks,
        form.date,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: (id) => {
      inspectionsRef.current = [
        ...inspectionsRef.current,
        {
          id: id ?? "—",
          itemId: form.itemId,
          inspector: user?.name ?? "—",
          inspectionDate: form.date,
          condition: form.condition,
          remarks: form.remarks,
        },
      ];
      forceUpdate((n) => n + 1);
      qc.invalidateQueries({ queryKey: ["ppeStats"] });
      toast.success("Inspection recorded");
      setOpen(false);
      setForm({
        itemId: "",
        condition: PPEInspectionCondition.Good,
        remarks: "",
        date: new Date().toISOString().slice(0, 10),
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const conditionColor = (c: PPEInspectionCondition) =>
    ({
      Good: "bg-primary/20 text-primary border-primary/40",
      Damaged: "bg-secondary/20 text-secondary border-secondary/40",
      Replace: "bg-destructive/20 text-destructive border-destructive/40",
    })[c];

  return (
    <div>
      {canEdit && (
        <div className="flex justify-end mb-3">
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            data-ocid="ppe.inspections.add_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Record Inspection
          </Button>
        </div>
      )}
      {inspections.length === 0 ? (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="ppe.inspections.empty_state"
        >
          <ListChecks className="w-8 h-8 mx-auto mb-2 opacity-40" />
          No inspections recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-card/80">
              <tr className="text-left text-muted-foreground">
                {[
                  "ID",
                  "Item",
                  "Inspector",
                  "Date",
                  "Condition",
                  "Remarks",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inspections.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-t border-border/30 hover:bg-card/40"
                  data-ocid={`ppe.inspections.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {row.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3">
                    {itemMap[row.itemId]?.itemName ?? row.itemId}
                  </td>
                  <td className="px-4 py-3">{row.inspector}</td>
                  <td className="px-4 py-3">{row.inspectionDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${conditionColor(row.condition)}`}
                    >
                      {row.condition}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="bg-card border-border max-w-md"
          data-ocid="ppe.record_inspection.dialog"
        >
          <DialogHeader>
            <DialogTitle>Record PPE Inspection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label className="mb-1 block">PPE Item</Label>
              <Select
                value={form.itemId}
                onValueChange={(v) => setForm((p) => ({ ...p, itemId: v }))}
              >
                <SelectTrigger data-ocid="ppe.record_inspection.item_select">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((it) => (
                    <SelectItem key={it.itemId} value={it.itemId}>
                      {it.itemName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Condition</Label>
              <Select
                value={form.condition}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    condition: v as PPEInspectionCondition,
                  }))
                }
              >
                <SelectTrigger data-ocid="ppe.record_inspection.condition_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Replace">Replace</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">Inspection Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                data-ocid="ppe.record_inspection.date_input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Remarks</Label>
              <Textarea
                value={form.remarks}
                onChange={(e) =>
                  setForm((p) => ({ ...p, remarks: e.target.value }))
                }
                data-ocid="ppe.record_inspection.remarks_input"
              />
            </div>
            <Button
              onClick={() => recordMut.mutate()}
              disabled={recordMut.isPending || !form.itemId}
              data-ocid="ppe.record_inspection.submit_button"
            >
              {recordMut.isPending ? "Saving..." : "Record Inspection"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── LOTO Detail ───────────────────────────────────────────────────────────────

const ENERGY_SOURCE_LABELS: Record<EnergySourceLOTO, string> = {
  Electrical: "Electrical",
  Pneumatic: "Pneumatic",
  Hydraulic: "Hydraulic",
  Mechanical: "Mechanical",
  Thermal: "Thermal",
  Chemical: "Chemical",
  Gravitational: "Gravitational",
};

function LotoDetail({
  loto,
  onBack,
  canEdit,
}: { loto: LOTOView; onBack: () => void; canEdit: boolean }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const activateMut = useMutation({
    mutationFn: async () => {
      const r = await actor!.activateLoto(token!, loto.lotoNumber);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      qc.invalidateQueries({ queryKey: ["lotoStats"] });
      toast.success("LOTO activated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const completeMut = useMutation({
    mutationFn: async () => {
      const r = await actor!.completeLoto(token!, loto.lotoNumber);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      qc.invalidateQueries({ queryKey: ["lotoStats"] });
      toast.success("LOTO completed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const cancelMut = useMutation({
    mutationFn: async () => {
      const r = await actor!.cancelLoto(token!, loto.lotoNumber, cancelReason);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      qc.invalidateQueries({ queryKey: ["lotoStats"] });
      toast.success("LOTO cancelled");
      setCancelOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const lockMut = useMutation({
    mutationFn: async ({
      lockNumber,
      newStatus,
    }: { lockNumber: string; newStatus: LockEntryStatus }) => {
      const r = await actor!.updateLockStatus(
        token!,
        loto.lotoNumber,
        lockNumber,
        newStatus,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      toast.success("Lock status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const allLocksRemoved =
    loto.lockRegister.length > 0 &&
    loto.lockRegister.every((l) => l.status === "Removed");

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="loto.detail.back_button"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-bold">{loto.lotoNumber}</h2>
          <p className="text-sm text-muted-foreground">
            {loto.equipmentName} — Tag: {loto.tagNumber}
          </p>
        </div>
        <LotoBadge status={loto.status} />
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: "Work Description", value: loto.workDescription },
          { label: "Start", value: ts(loto.startDateTime) },
          {
            label: "End",
            value: loto.endDateTime ? ts(loto.endDateTime) : "—",
          },
          { label: "Created By", value: String(loto.createdBy) },
          {
            label: "Authorized By",
            value: loto.authorizedByEmpId
              ? String(loto.authorizedByEmpId)
              : "—",
          },
          {
            label: "Authorized At",
            value: loto.authorizedAt ? ts(loto.authorizedAt) : "—",
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card/40 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
            <p className="text-sm font-medium break-words">{value}</p>
          </div>
        ))}
      </div>

      {/* Energy Sources */}
      <div className="bg-card/40 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-2">Energy Sources</h3>
        <div className="flex flex-wrap gap-2">
          {loto.energySources.map((src) => (
            <Badge
              key={src}
              variant="outline"
              className="border-secondary/40 text-secondary"
            >
              <Zap className="w-3 h-3 mr-1" />
              {ENERGY_SOURCE_LABELS[src]}
            </Badge>
          ))}
          {loto.energySources.length === 0 && (
            <span className="text-xs text-muted-foreground">
              None specified
            </span>
          )}
        </div>
      </div>

      {/* Isolation Points */}
      <div className="bg-card/40 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Isolation Points</h3>
        {loto.isolationPoints.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No isolation points added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {loto.isolationPoints.map((pt, i) => (
              <div
                key={pt.pointId}
                className="flex items-center justify-between bg-background/40 rounded-lg px-3 py-2"
                data-ocid={`loto.isolation.item.${i + 1}`}
              >
                <div>
                  <p className="text-sm font-medium">{pt.location}</p>
                  <p className="text-xs text-muted-foreground">
                    Lock: {pt.lockNumber}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    pt.status === "Applied"
                      ? "bg-destructive/20 text-destructive border-destructive/40"
                      : "bg-primary/20 text-primary border-primary/40"
                  }`}
                >
                  {pt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lock Register */}
      <div className="bg-card/40 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Lock Register</h3>
        {loto.lockRegister.length === 0 ? (
          <p className="text-xs text-muted-foreground">No locks registered.</p>
        ) : (
          <div className="space-y-2">
            {loto.lockRegister.map((lk, i) => (
              <div
                key={lk.lockNumber}
                className="flex items-center justify-between bg-background/40 rounded-lg px-3 py-2"
                data-ocid={`loto.lock.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  {lk.status === "Applied" ? (
                    <Lock className="w-4 h-4 text-destructive" />
                  ) : (
                    <LockOpen className="w-4 h-4 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium">Lock #{lk.lockNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Assigned: Emp {String(lk.assignedEmpId)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${
                      lk.status === "Applied"
                        ? "bg-destructive/20 text-destructive border-destructive/40"
                        : "bg-primary/20 text-primary border-primary/40"
                    }`}
                  >
                    {lk.status}
                  </span>
                  {canEdit && loto.status === "Active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        lockMut.mutate({
                          lockNumber: lk.lockNumber,
                          newStatus:
                            lk.status === "Applied"
                              ? LockEntryStatus.Removed
                              : LockEntryStatus.Applied,
                        })
                      }
                      disabled={lockMut.isPending}
                      data-ocid={`loto.lock.toggle_button.${i + 1}`}
                    >
                      {lk.status === "Applied" ? "Remove" : "Apply"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Authorized Employees */}
      <div className="bg-card/40 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-2">Authorized Employees</h3>
        {loto.authorizedEmpIds.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No authorized employees listed.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {loto.authorizedEmpIds.map((id) => (
              <Badge key={String(id)} variant="outline">
                {String(id)}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Procedure Steps */}
      <div className="bg-card/40 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Procedure Steps</h3>
        {loto.procedureSteps.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No procedure steps added.
          </p>
        ) : (
          <ol className="space-y-1 list-decimal list-inside">
            {loto.procedureSteps.map((step, i) => (
              <li key={i} className="text-sm text-foreground py-1">
                {step}
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Re-energization Checklist */}
      {(loto.status === "Active" || loto.status === "Completed") && (
        <div className="bg-card/40 rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BatteryWarning className="w-4 h-4 text-secondary" />
            Re-energization Checklist
          </h3>
          {loto.reEnergizationChecklist.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No re-energization steps defined.
            </p>
          ) : (
            <ol className="space-y-1 list-decimal list-inside">
              {loto.reEnergizationChecklist.map((step, i) => (
                <li key={i} className="text-sm py-1">
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {canEdit && (
        <div className="flex flex-wrap gap-3 pt-2">
          {loto.status === "Draft" && (
            <Button
              onClick={() => activateMut.mutate()}
              disabled={activateMut.isPending}
              className="bg-destructive/80 hover:bg-destructive text-destructive-foreground"
              data-ocid="loto.detail.activate_button"
            >
              <Lock className="w-4 h-4 mr-1" />
              {activateMut.isPending ? "Activating..." : "Activate LOTO"}
            </Button>
          )}
          {loto.status === "Active" && allLocksRemoved && (
            <Button
              onClick={() => completeMut.mutate()}
              disabled={completeMut.isPending}
              data-ocid="loto.detail.complete_button"
            >
              <ShieldCheck className="w-4 h-4 mr-1" />
              {completeMut.isPending ? "Completing..." : "Complete LOTO"}
            </Button>
          )}
          {(loto.status === "Draft" || loto.status === "Active") && (
            <Button
              variant="outline"
              onClick={() => setCancelOpen(true)}
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              data-ocid="loto.detail.cancel_button"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Cancel LOTO
            </Button>
          )}
        </div>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="loto.cancel.dialog"
        >
          <DialogHeader>
            <DialogTitle>Cancel LOTO</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Label>Reason for cancellation</Label>
            <Textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              data-ocid="loto.cancel.reason_input"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCancelOpen(false)}
                data-ocid="loto.cancel.cancel_button"
              >
                Back
              </Button>
              <Button
                onClick={() => cancelMut.mutate()}
                disabled={cancelMut.isPending || !cancelReason}
                className="flex-1 bg-destructive/80 hover:bg-destructive text-destructive-foreground"
                data-ocid="loto.cancel.confirm_button"
              >
                {cancelMut.isPending ? "Cancelling..." : "Confirm Cancel"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── LOTO List ────────────────────────────────────────────────────────────────

const ENERGY_SOURCES = Object.values(EnergySourceLOTO);

function LotoList({ canEdit }: { canEdit: boolean }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<LOTOView | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<{
    equipmentName: string;
    tagNumber: string;
    workDescription: string;
    startDateTime: string;
    energySources: EnergySourceLOTO[];
  }>({
    equipmentName: "",
    tagNumber: "",
    workDescription: "",
    startDateTime: new Date().toISOString().slice(0, 16),
    energySources: [],
  });

  const { data: lotos = [], isLoading } = useQuery<LOTOView[]>({
    queryKey: ["lotos"],
    queryFn: async () => {
      const r = await actor!.listLotos(token!);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !!token,
  });

  const createMut = useMutation({
    mutationFn: async () => {
      const input: CreateLOTOInput = {
        equipmentName: form.equipmentName,
        tagNumber: form.tagNumber,
        workDescription: form.workDescription,
        startDateTime:
          BigInt(new Date(form.startDateTime).getTime()) * 1_000_000n,
      };
      const r = await actor!.createLoto(token!, input);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lotos"] });
      qc.invalidateQueries({ queryKey: ["lotoStats"] });
      toast.success("LOTO created");
      setCreateOpen(false);
      setForm({
        equipmentName: "",
        tagNumber: "",
        workDescription: "",
        startDateTime: new Date().toISOString().slice(0, 16),
        energySources: [],
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleEnergy = (src: EnergySourceLOTO) => {
    setForm((p) => ({
      ...p,
      energySources: p.energySources.includes(src)
        ? p.energySources.filter((s) => s !== src)
        : [...p.energySources, src],
    }));
  };

  if (selected) {
    const live =
      lotos.find((l) => l.lotoNumber === selected.lotoNumber) ?? selected;
    return (
      <LotoDetail
        loto={live}
        onBack={() => setSelected(null)}
        canEdit={canEdit}
      />
    );
  }

  return (
    <div>
      {canEdit && (
        <div className="flex justify-end mb-3">
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            data-ocid="loto.list.add_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Create New LOTO
          </Button>
        </div>
      )}
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      ) : lotos.length === 0 ? (
        <div
          className="text-center py-14 text-muted-foreground"
          data-ocid="loto.list.empty_state"
        >
          <Lock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No LOTO records yet</p>
          <p className="text-xs mt-1">Create a new LOTO to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead className="bg-card/80">
              <tr className="text-left text-muted-foreground">
                {[
                  "LOTO Number",
                  "Equipment",
                  "Tag",
                  "Energy Sources",
                  "Start",
                  "End",
                  "Status",
                  "",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lotos.map((loto, i) => (
                <tr
                  key={loto.lotoNumber}
                  className="border-t border-border/30 hover:bg-card/40 cursor-pointer"
                  onClick={() => setSelected(loto)}
                  onKeyDown={() => {}}
                  data-ocid={`loto.list.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-primary">
                    {loto.lotoNumber}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {loto.equipmentName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {loto.tagNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {loto.energySources.slice(0, 3).map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="text-[10px] border-secondary/40 text-secondary"
                        >
                          {s}
                        </Badge>
                      ))}
                      {loto.energySources.length > 3 && (
                        <Badge variant="outline" className="text-[10px]">
                          +{loto.energySources.length - 3}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {ts(loto.startDateTime)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {loto.endDateTime ? ts(loto.endDateTime) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <LotoBadge status={loto.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(loto);
                      }}
                      data-ocid={`loto.list.view_button.${i + 1}`}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent
          className="bg-card border-border max-w-lg"
          data-ocid="loto.create.dialog"
        >
          <DialogHeader>
            <DialogTitle>Create New LOTO</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="mb-1 block">Equipment Name</Label>
                <Input
                  value={form.equipmentName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, equipmentName: e.target.value }))
                  }
                  data-ocid="loto.create.equipment_input"
                />
              </div>
              <div>
                <Label className="mb-1 block">Tag Number</Label>
                <Input
                  value={form.tagNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tagNumber: e.target.value }))
                  }
                  data-ocid="loto.create.tag_input"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1 block">Work Description</Label>
              <Textarea
                value={form.workDescription}
                onChange={(e) =>
                  setForm((p) => ({ ...p, workDescription: e.target.value }))
                }
                data-ocid="loto.create.desc_input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Start Date/Time</Label>
              <Input
                type="datetime-local"
                value={form.startDateTime}
                onChange={(e) =>
                  setForm((p) => ({ ...p, startDateTime: e.target.value }))
                }
                data-ocid="loto.create.start_input"
              />
            </div>
            <div>
              <Label className="mb-2 block">Energy Sources</Label>
              <div className="grid grid-cols-2 gap-2">
                {ENERGY_SOURCES.map((src) => (
                  <label
                    key={src}
                    htmlFor={`loto-energy-${src}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      id={`loto-energy-${src}`}
                      checked={form.energySources.includes(src)}
                      onCheckedChange={() => toggleEnergy(src)}
                      data-ocid={`loto.create.energy_${src.toLowerCase()}_checkbox`}
                    />
                    <span className="text-sm">{src}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button
              onClick={() => createMut.mutate()}
              disabled={
                createMut.isPending || !form.equipmentName || !form.tagNumber
              }
              data-ocid="loto.create.submit_button"
            >
              {createMut.isPending ? "Creating..." : "Create LOTO"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── PPE Tab ───────────────────────────────────────────────────────────────────

const PPE_SUB_TABS = [
  "Item Master",
  "Inventory",
  "Issuances",
  "Inspections",
] as const;
type PpeSubTab = (typeof PPE_SUB_TABS)[number];

function PpeTab({ canEdit }: { canEdit: boolean }) {
  const [subTab, setSubTab] = useState<PpeSubTab>("Item Master");

  return (
    <div>
      <PpeStatsBar />
      {/* Sub-tab nav */}
      <div className="flex gap-1 bg-card/40 rounded-lg p-1 mb-5 w-fit">
        {PPE_SUB_TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSubTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              subTab === t
                ? "bg-primary text-primary-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid={`ppe.subtab.${t.toLowerCase().replace(/ /g, "_")}`}
          >
            {t}
          </button>
        ))}
      </div>
      {subTab === "Item Master" && <PpeItemMaster canEdit={canEdit} />}
      {subTab === "Inventory" && <PpeInventory canEdit={canEdit} />}
      {subTab === "Issuances" && <PpeIssuances canEdit={canEdit} />}
      {subTab === "Inspections" && <PpeInspections canEdit={canEdit} />}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const MAIN_TABS = ["PPE Management", "LOTO"] as const;
type MainTab = (typeof MAIN_TABS)[number];

export default function PPELOTOPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MainTab>("PPE Management");
  const manageable = canManage(user?.role ?? "");

  return (
    <div className="min-h-screen bg-background px-4 md:px-8 py-6">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="p-2 rounded-lg bg-primary/10 text-primary">
            <Shield className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              PPE &amp; LOTO Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Personal Protective Equipment control and Lockout-Tagout
              procedures
            </p>
          </div>
        </div>
      </div>

      {/* Main tab nav */}
      <div className="flex gap-1 bg-card/50 rounded-xl p-1 mb-6 w-fit border border-border/30">
        {MAIN_TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTab(t)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-card/60"
            }`}
            data-ocid={`ppe_loto.main_tab.${t.toLowerCase().replace(/ /g, "_")}`}
          >
            {t === "PPE Management" ? (
              <HardHat className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="bg-card/30 backdrop-blur border border-border/30 rounded-2xl p-5">
        {activeTab === "PPE Management" && <PpeTab canEdit={manageable} />}
        {activeTab === "LOTO" && (
          <div>
            <LotoStatsBar />
            <LotoList canEdit={manageable} />
          </div>
        )}
      </div>
    </div>
  );
}
