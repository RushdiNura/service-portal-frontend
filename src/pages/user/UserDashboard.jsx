import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyServices, addUserNote } from "../../api/endpoints";
import { Card, EmptyState, Spinner } from "../../components/ui/Misc";
import StatusBadge, { StatusRail } from "../../components/ui/StatusBadge";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Field } from "../../components/ui/Input";
import { ClipboardList, MessageSquarePlus } from "lucide-react";

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UserDashboard() {
  const [services, setServices] = useState(null);
  const [noteTarget, setNoteTarget] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    try {
      const { data } = await getMyServices();
      setServices(data.services);
    } catch {
      toast.error("Couldn't load your services");
      setServices([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNote(service) {
    setNoteTarget(service);
    setNoteText(service.userNote || "");
  }

  async function saveNote() {
    setSaving(true);
    try {
      await addUserNote(noteTarget._id, noteText);
      toast.success("Note saved");
      setNoteTarget(null);
      load();
    } catch {
      toast.error("Couldn't save your note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          My services
        </h1>
        <p className="text-sm text-ink-400 mt-1">
          Track the status of every request raised on your behalf.
        </p>
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
            description="When an admin opens a service request for you, it'll show up here."
          />
        </Card>
      )}

      {services?.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {services.map((s) => (
            <Card key={s._id} className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-semibold text-ink-900">
                    {s.serviceName}
                  </h3>
                  <p className="text-xs text-ink-400 mt-0.5">
                    Opened {formatDate(s.createdAt)}
                  </p>
                </div>
                <StatusBadge status={s.status} />
              </div>

              <p className="text-sm text-ink-600 leading-relaxed">
                {s.description}
              </p>

              <StatusRail status={s.status} />

              {s.adminNote && (
                <div className="text-xs bg-ink-50 rounded-lg px-3 py-2 text-ink-600">
                  <span className="font-semibold text-ink-700">
                    Note from admin:{" "}
                  </span>
                  {s.adminNote}
                </div>
              )}

              <div className="pt-1 border-t border-ink-100 flex items-center justify-between">
                <p className="text-xs text-ink-400 truncate max-w-[60%]">
                  {s.userNote ? `Your note: ${s.userNote}` : "No note added"}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openNote(s)}
                >
                  <MessageSquarePlus className="h-3.5 w-3.5" />
                  {s.userNote ? "Edit note" : "Add note"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!noteTarget}
        onClose={() => setNoteTarget(null)}
        title={`Note on "${noteTarget?.serviceName}"`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setNoteTarget(null)}>
              Cancel
            </Button>
            <Button loading={saving} onClick={saveNote}>
              Save note
            </Button>
          </>
        }
      >
        <Field
          label="Your note"
          hint="Add context the admin should know about this request."
        >
          <textarea
            className="w-full rounded-lg border border-ink-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 min-h-[100px] resize-y"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="e.g. This is blocking my onboarding, please prioritize."
          />
        </Field>
      </Modal>
    </div>
  );
}
