import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../../api/endpoints";
import { Card, EmptyState, Spinner, PublicIdBadge } from "../../components/ui/Misc";
import StatusBadge from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input, { Field } from "../../components/ui/Input";
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";

const STATUS_OPTIONS = ["pending", "in-progress", "completed"];

const emptyCreateForm = {
  email: "",
  serviceName: "",
  description: "",
  status: "pending",
};

export default function AdminServices() {
  const [services, setServices] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [creating, setCreating] = useState(false);
  const [createErrors, setCreateErrors] = useState([]);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    try {
      const { data } = await getAllServices();
      setServices(data.services);
    } catch {
      toast.error("Couldn't load services");
      setServices([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setCreateErrors([]);
    setCreating(true);
    try {
      await createService(createForm);
      toast.success("Service created");
      setCreateOpen(false);
      setCreateForm(emptyCreateForm);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || "Couldn't create service";
      setCreateErrors([msg]);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  }

  function openEdit(s) {
    setEditTarget(s);
    setEditForm({
      serviceName: s.serviceName,
      description: s.description,
      status: s.status,
      adminNote: s.adminNote || "",
    });
  }

  async function handleUpdate() {
    setSaving(true);
    try {
      await updateService(editTarget._id, editForm);
      toast.success("Service updated");
      setEditTarget(null);
      load();
    } catch {
      toast.error("Couldn't update service");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteService(deleteTarget._id);
      toast.success("Service deleted");
      setDeleteTarget(null);
      load();
    } catch {
      toast.error("Couldn't delete service");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Services
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            Every service request you've opened, with its current status.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New service
        </Button>
      </div>

      {services === null && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {services?.length === 0 && (
        <Card>
          <EmptyState
            icon={ClipboardList}
            title="No services yet"
            description="Open your first service request for a user."
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                New service
              </Button>
            }
          />
        </Card>
      )}

      {services?.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs text-ink-400 uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr
                  key={s._id}
                  className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-ink-800">{s.serviceName}</p>
                    <p className="text-xs text-ink-400 line-clamp-1 max-w-xs">
                      {s.description}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-ink-700">{s.user?.name || "—"}</p>
                    {s.user?.publicId && <PublicIdBadge id={s.user.publicId} />}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="p-2 text-ink-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-2 text-ink-400 hover:text-clay-400 hover:bg-clay-50 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New service request"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button loading={creating} onClick={handleCreate}>
              Create service
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="User email" hint="The user this request is for">
            <Input
              type="email"
              placeholder="user@company.com"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              required
            />
          </Field>
          <Field label="Service name">
            <Input
              placeholder="e.g. Laptop replacement"
              value={createForm.serviceName}
              onChange={(e) =>
                setCreateForm({ ...createForm, serviceName: e.target.value })
              }
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 min-h-[90px] resize-y"
              value={createForm.description}
              onChange={(e) =>
                setCreateForm({ ...createForm, description: e.target.value })
              }
              required
            />
          </Field>
          <Field label="Initial status">
            <select
              className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              value={createForm.status}
              onChange={(e) =>
                setCreateForm({ ...createForm, status: e.target.value })
              }
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          {createErrors.length > 0 && (
            <p className="text-sm text-clay-400 bg-clay-50 rounded-lg px-3 py-2">
              {createErrors[0]}
            </p>
          )}
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Update service"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={handleUpdate}>
              Save changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Service name">
            <Input
              value={editForm.serviceName || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, serviceName: e.target.value })
              }
            />
          </Field>
          <Field label="Description">
            <textarea
              className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 min-h-[80px] resize-y"
              value={editForm.description || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
          </Field>
          <Field label="Status">
            <select
              className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              value={editForm.status || "pending"}
              onChange={(e) =>
                setEditForm({ ...editForm, status: e.target.value })
              }
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Admin note" hint="Visible to the user">
            <textarea
              className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 min-h-[70px] resize-y"
              value={editForm.adminNote || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, adminNote: e.target.value })
              }
            />
          </Field>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete this service?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          This will permanently remove{" "}
          <span className="font-semibold text-ink-800">
            "{deleteTarget?.serviceName}"
          </span>
          . This can't be undone.
        </p>
      </Modal>
    </div>
  );
}
