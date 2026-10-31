import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { getUsers, searchUsers, createUser, deleteUser } from "../../api/endpoints";
import { Card, EmptyState, Spinner, PublicIdBadge } from "../../components/ui/Misc";
import RoleBadge from "../../components/ui/RoleBadge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input, { Field } from "../../components/ui/Input";
import { useAuth } from "../../context/AuthContext";
import { Plus, Trash2, Search, Users as UsersIcon } from "lucide-react";

const emptyForm = { name: "", email: "", password: "", role: "user" };

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const isSuper = currentUser?.role === "super-admin";

  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [errors, setErrors] = useState([]);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await getUsers();
      setUsers(data.users);
    } catch {
      toast.error("Couldn't load users");
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!query.trim()) {
        load();
        return;
      }
      try {
        const { data } = await searchUsers(query);
        setUsers(data.users);
      } catch {
        toast.error("Search failed");
      }
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function handleCreate(e) {
    e.preventDefault();
    setErrors([]);
    setCreating(true);
    try {
      await createUser(form);
      toast.success("User created");
      setCreateOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      const data = err.response?.data;
      const msgs = data?.errors || [data?.message || "Couldn't create user"];
      setErrors(msgs);
      toast.error(msgs[0]);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteUser(deleteTarget._id);
      toast.success("User removed");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't delete user");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">
            Users
          </h1>
          <p className="text-sm text-ink-400 mt-1">
            {isSuper
              ? "Every user and admin in the system."
              : "Users you've created and manage."}
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New user
        </Button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-300" />
        <Input
          className="pl-9"
          placeholder="Search by name, email, or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {users === null && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {users?.length === 0 && (
        <Card>
          <EmptyState
            icon={UsersIcon}
            title="No users found"
            description={query ? "Try a different search." : "Create your first user to get started."}
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
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-ink-800">
                    {u.name}
                  </td>
                  <td className="px-5 py-3.5 text-ink-600">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-5 py-3.5">
                    <PublicIdBadge id={u.publicId} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <button
                        onClick={() => setDeleteTarget(u)}
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

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New user"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button loading={creating} onClick={handleCreate}>
              Create user
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
          <Field label="Temporary password" hint="At least 6 characters">
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Field>
          {isSuper && (
            <Field label="Role">
              <select
                className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
          )}
          {errors.length > 0 && (
            <ul className="text-sm text-clay-400 bg-clay-50 rounded-lg px-3 py-2 space-y-0.5">
              {errors.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </form>
      </Modal>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Remove this user?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          <span className="font-semibold text-ink-800">
            {deleteTarget?.name}
          </span>{" "}
          will be deactivated and lose access to the portal.
        </p>
      </Modal>
    </div>
  );
}
