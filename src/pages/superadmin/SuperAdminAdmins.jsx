import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createAdmin, getAllUsersWithDeleted } from "../../api/endpoints";
import { Card, EmptyState, Spinner, PublicIdBadge } from "../../components/ui/Misc";
import RoleBadge from "../../components/ui/RoleBadge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input, { Field } from "../../components/ui/Input";
import { Plus, ShieldCheck } from "lucide-react";

const emptyForm = { name: "", email: "", password: "" };

export default function SuperAdminAdmins() {
  const [users, setUsers] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const { data } = await getAllUsersWithDeleted();
      setUsers(data.users.filter((u) => u.role === "admin"));
    } catch {
      toast.error("Couldn't load admins");
      setUsers([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setCreating(true);
    try {
      await createAdmin(form);
      toast.success("Admin created");
      setCreateOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      const msg = err.response?.data?.message || "Couldn't create admin";
      setError(msg);
      toast.error(msg);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Admins
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            People with admin access to manage users and services.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New admin
        </Button>
      </div>

      {users === null && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {users?.length === 0 && (
        <Card>
          <EmptyState
            icon={ShieldCheck}
            title="No admins yet"
            description="Promote someone to admin to help manage the portal."
            action={
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                New admin
              </Button>
            }
          />
        </Card>
      )}

      {users?.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs text-ink-400 uppercase tracking-wide">
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Role</th>
                <th className="px-5 py-3 font-semibold">ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-ink-800">{u.name}</td>
                  <td className="px-5 py-3.5 text-ink-600">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-5 py-3.5">
                    <PublicIdBadge id={u.publicId} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New admin"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button loading={creating} onClick={handleCreate}>
              Create admin
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Field label="Full name">
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>
          <Field label="Temporary password">
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Field>
          {error && (
            <p className="text-sm text-clay-400 bg-clay-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </form>
      </Modal>
    </div>
  );
}
