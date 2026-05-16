import { useState, useEffect } from "react";
import { getMyServices, addUserNote } from "../../api/services";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";
import { format } from "date-fns";

const UserServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getMyServices();
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNote = (service) => {
    setSelectedService(service);
    setNote(service.userNote || "");
    setShowNoteModal(true);
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();
    try {
      await addUserNote(selectedService._id, note);
      toast.success("Note updated successfully");
      setShowNoteModal(false);
      fetchServices();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const filteredServices = services.filter((service) => {
    if (filter === "all") return true;
    return service.status === filter;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
        <p className="text-gray-600 mt-1">Track and manage your services</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "pending", "in-progress", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              filter === status
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status === "in-progress" ? "In Progress" : status}
          </button>
        ))}
      </div>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <EmptyState
          title="No services found"
          description="You don't have any services yet"
        />
      ) : (
        <div className="space-y-4">
          {filteredServices.map((service) => (
            <div key={service._id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {service.serviceName}
                    </h3>
                    <StatusBadge status={service.status} />
                  </div>
                  <p className="text-gray-600 mb-3">{service.description}</p>

                  {/* Admin Note */}
                  {service.adminNote && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        📝 Admin Note:
                      </p>
                      <p className="text-sm text-blue-800">
                        {service.adminNote}
                      </p>
                    </div>
                  )}

                  {/* User Note */}
                  {service.userNote && (
                    <div className="mb-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-900 mb-1">
                        💬 Your Note:
                      </p>
                      <p className="text-sm text-green-800">
                        {service.userNote}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400">
                    Created:{" "}
                    {service.createdAt &&
                      format(new Date(service.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenNote(service)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {service.userNote ? "Edit Note" : "Add Note"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Note Modal */}
      <Modal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        title={selectedService?.serviceName}
      >
        <form onSubmit={handleSaveNote} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Note / Feedback
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field"
              rows="5"
              placeholder="Add your feedback or notes about this service..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowNoteModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Note
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserServices;
