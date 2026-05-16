import { useState, useEffect } from "react";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../../api/services";
import { getUsers } from "../../api/admin"; // ✅ Import getUsers
import { useAuth } from "../../context/AuthContext"; // ✅ Import useAuth
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import StatusBadge from "../../components/StatusBadge";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";
import toast from "react-hot-toast";
import { format } from "date-fns";

const Services = () => {
  const { user } = useAuth(); // ✅ Get current user
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]); // ✅ Users list for dropdown
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteServiceData, setDeleteServiceData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    userId: "", // ✅ Changed from email to userId
    serviceName: "",
    description: "",
    status: "pending",
  });

  const [editData, setEditData] = useState({
    serviceName: "",
    description: "",
    status: "",
    adminNote: "",
  });

  useEffect(() => {
    fetchServices();
    fetchMyUsers(); // ✅ Fetch admin's users
  }, [page]);

  // ✅ Fetch users that this admin created
  const fetchMyUsers = async () => {
    try {
      const data = await getUsers(1, 1000); // Get all users
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllServices(page);
      setServices(data.services);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    
    // ✅ Validate that a user is selected
    if (!formData.userId) {
      toast.error("Please select a user");
      return;
    }
    
    try {
      await createService(formData);
      toast.success("Service created successfully");
      setShowCreateModal(false);
      setFormData({
        userId: "",
        serviceName: "",
        description: "",
        status: "pending",
      });
      setPage(1);
      fetchServices();
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };


  const handleEditService = (service) => {
    setSelectedService(service);
    setEditData({
      serviceName: service.serviceName,
      description: service.description,
      status: service.status,
      adminNote: service.adminNote || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await updateService(selectedService._id, editData);
      toast.success("Service updated successfully");
      setShowEditModal(false);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleDeleteService = async () => {
    setDeleteLoading(true);
    try {
      await deleteService(deleteServiceData._id);
      toast.success("Service deleted successfully");
      setDeleteServiceData(null);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || service.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
  <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">
            {total > 0 ? `${total} total services` : "Manage services"}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {/* Filters */}
      {total > 0 && !loading && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-48"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {/* Services List or Empty State */}
      {total === 0 && !loading ? (
        <div className="card flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-gray-100 rounded-2xl mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No services yet
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Create a service for your users
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            Create Service
          </button>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16">
          <div className="p-4 bg-gray-100 rounded-2xl mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No results found
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            Try adjusting your search or filter
          </p>
          <button
            onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        // Services list (keep your existing service cards)
        <div className="space-y-4">
         {filteredServices.map((service) => (
    <div key={service._id} className="card hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Service Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {service.serviceName}
            </h3>
            <StatusBadge status={service.status} />
          </div>
          
          <p className="text-gray-600 text-sm mb-3">
            {service.description}
          </p>
          
          {/* User Info */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {service.user?.name?.charAt(0)}
                </span>
              </div>
              <span className="font-medium text-gray-700">{service.user?.name}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span>{service.user?.email}</span>
            <span className="text-gray-300">•</span>
            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
              {service.user?.publicId}
            </span>
          </div>
          
          {/* Timestamps */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Created: {service.createdAt && format(new Date(service.createdAt), 'MMM dd, yyyy')}</span>
            {service.updatedAt !== service.createdAt && (
              <>
                <span>•</span>
                <span>Updated: {service.updatedAt && format(new Date(service.updatedAt), 'MMM dd, yyyy')}</span>
              </>
            )}
          </div>
          
          {/* Admin Note */}
          {service.adminNote && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-blue-700 mb-1">Admin Note</p>
              <p className="text-sm text-blue-800">{service.adminNote}</p>
            </div>
          )}
          
          {/* User Note */}
          {service.userNote && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="text-xs font-medium text-green-700 mb-1">User Note</p>
              <p className="text-sm text-green-800">{service.userNote}</p>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 lg:flex-shrink-0">
          <button
            onClick={() => handleEditService(service)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit service"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteServiceData(service)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete service"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  ))}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Create Service Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Service"
      >
        <form onSubmit={handleCreateService} className="space-y-5">
          {/* ✅ User Dropdown - Only shows admin's users */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select User
            </label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Choose a user...</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">
                No users available. Create a user first.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Service Name
            </label>
            <input
              type="text"
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              className="input-field"
              placeholder="e.g., Business Consulting"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Service details..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Service
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Service"
      >
        <form onSubmit={handleUpdateService} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              value={editData.serviceName}
              onChange={(e) =>
                setEditData({ ...editData, serviceName: e.target.value })
              }
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="input-field"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Note
            </label>
            <textarea
              value={editData.adminNote}
              onChange={(e) =>
                setEditData({ ...editData, adminNote: e.target.value })
              }
              className="input-field"
              rows="3"
              placeholder="Add a note for the user..."
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Update Service
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteServiceData}
        onClose={() => setDeleteServiceData(null)}
        onConfirm={handleDeleteService}
        title="Delete Service"
        message={`Are you sure you want to delete "${deleteServiceData?.serviceName}"?`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Services;
