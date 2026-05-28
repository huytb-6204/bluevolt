"use client";

import { type JSX, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  listAllVehiclesAdmin,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  VEHICLE_TYPE_LABEL,
  type Vehicle,
  type VehicleType,
  type VehicleStatus,
} from "@/lib/vehicles-api";
import { formatPrice } from "@/lib/bookings-api";
import { Card, CardContent } from "@repo/ui/components/base/card";
import { Button } from "@repo/ui/components/base/button";
import { Input } from "@repo/ui/components/base/input";
import { Label } from "@repo/ui/components/base/label";
import { Badge } from "@repo/ui/components/base/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/base/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/base/select";
import { Plus, Pencil, Trash2, Loader2, Bike } from "lucide-react";

const STATUS_LABEL: Record<VehicleStatus, string> = {
  AVAILABLE: "Đang khả dụng",
  MAINTENANCE: "Bảo trì",
  HIDDEN: "Đã ẩn",
};

const STATUS_COLOR: Record<VehicleStatus, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  MAINTENANCE: "bg-amber-100 text-amber-700",
  HIDDEN: "bg-slate-100 text-slate-500",
};

interface FormState {
  name: string;
  type: VehicleType;
  description: string;
  pricePerDay: string;
  rangeKm: string;
  maxSpeed: string;
  imageUrl: string;
  status: VehicleStatus;
}

const emptyForm: FormState = {
  name: "",
  type: "MOTORBIKE",
  description: "",
  pricePerDay: "",
  rangeKm: "",
  maxSpeed: "",
  imageUrl: "",
  status: "AVAILABLE",
};

function toForm(v: Vehicle): FormState {
  return {
    name: v.name,
    type: v.type,
    description: v.description ?? "",
    pricePerDay: String(v.pricePerDay),
    rangeKm: String(v.rangeKm),
    maxSpeed: String(v.maxSpeed),
    imageUrl: v.imageUrl ?? "",
    status: v.status,
  };
}

export default function AdminVehiclesPage(): JSX.Element {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function refresh() {
    setLoading(true);
    listAllVehiclesAdmin()
      .then(setVehicles)
      .catch(() => setError("Không tải được danh sách xe."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refresh();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(v: Vehicle) {
    setEditingId(v.id);
    setForm(toForm(v));
    setError(null);
    setDialogOpen(true);
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        description: form.description || undefined,
        pricePerDay: parseInt(form.pricePerDay, 10),
        rangeKm: parseInt(form.rangeKm, 10),
        maxSpeed: parseInt(form.maxSpeed, 10),
        imageUrl: form.imageUrl || undefined,
        status: form.status,
      };
      if (editingId) {
        await updateVehicle(editingId, payload);
      } else {
        await createVehicle(payload);
      }
      setDialogOpen(false);
      refresh();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string | string[] } } })
          ?.response?.data?.message ?? "Lỗi không xác định";
      setError(Array.isArray(msg) ? msg.join(", ") : String(msg));
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Xoá xe này? Hành động không thể hoàn tác.")) return;
    setDeletingId(id);
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch {
      alert("Không xoá được xe (có thể đang được đặt).");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell title="Quản lý đội xe">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {loading ? "Đang tải..." : `${vehicles.length} xe`}
        </p>
        <Button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-500 text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm xe
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((v) => (
            <Card key={v.id} className="border-slate-200">
              <CardContent className="p-4 flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center flex-shrink-0">
                  {v.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.imageUrl}
                      alt={v.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Bike className="w-7 h-7 text-blue-600/50" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{v.name}</h3>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0">
                      {VEHICLE_TYPE_LABEL[v.type]}
                    </Badge>
                    <Badge
                      className={`${STATUS_COLOR[v.status]} hover:opacity-90 border-0`}
                    >
                      {STATUS_LABEL[v.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {formatPrice(v.pricePerDay)}/ngày · {v.rangeKm}km · {v.maxSpeed}km/h
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(v)}
                    className="text-slate-900"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(v.id)}
                    disabled={deletingId === v.id}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    {deletingId === v.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Sửa xe" : "Thêm xe mới"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "Cập nhật thông tin xe."
                : "Nhập thông tin xe mới để thêm vào đội xe."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSave} className="space-y-3">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Tên xe</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="type">Loại xe</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) =>
                    setForm({ ...form, type: v as VehicleType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SCOOTER">Xe ga điện</SelectItem>
                    <SelectItem value="MOTORBIKE">Xe máy điện</SelectItem>
                    <SelectItem value="PREMIUM">Cao cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm({ ...form, status: v as VehicleStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Khả dụng</SelectItem>
                    <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
                    <SelectItem value="HIDDEN">Ẩn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="price">Giá/ngày (VND)</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={form.pricePerDay}
                  onChange={(e) =>
                    setForm({ ...form, pricePerDay: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="range">Quãng (km)</Label>
                <Input
                  id="range"
                  type="number"
                  min={0}
                  value={form.rangeKm}
                  onChange={(e) =>
                    setForm({ ...form, rangeKm: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="speed">Tốc độ (km/h)</Label>
                <Input
                  id="speed"
                  type="number"
                  min={0}
                  value={form.maxSpeed}
                  onChange={(e) =>
                    setForm({ ...form, maxSpeed: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="imageUrl">URL ảnh (tuỳ chọn)</Label>
              <Input
                id="imageUrl"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="desc">Mô tả</Label>
              <Input
                id="desc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Mô tả ngắn về xe"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="text-slate-900"
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Đang lưu...
                  </>
                ) : editingId ? (
                  "Cập nhật"
                ) : (
                  "Tạo xe"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
