import { useState, useEffect } from "react";
import { searchUsers } from "../../api/admin";
import { getServicesByPublicId } from "../../api/services";
import { Search as SearchIcon, User, Briefcase, Loader } from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import StatusBadge from "../../components/StatusBadge";

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchForUsers();
    } else {
      setUsers([]);
    }
  }, [debouncedQuery]);

  const searchForUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await searchUsers(debouncedQuery);
      setUsers(data.users);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchUserServices = async (user) => {
    setSelectedUser(user);
    setLoadingServices(true);
    try {
      const data = await getServicesByPublicId(user.publicId);
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoadingServices(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Users</h1>
        <p className="text-gray-600 mt-1">Find users and their services</p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or public ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field pl-10 text-lg"
          autoFocus
        />
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Users
            </h2>

            {loadingUsers ? (
              <div className="flex justify-center py-8">
                <Loader className="animate-spin h-6 w-6 text-primary-600" />
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => fetchUserServices(user)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedUser?._id === user._id
                        ? "bg-primary-50 border border-primary-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">
                          {user.name?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">{user.publicId}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <p className="text-center text-gray-500 py-8">No users found</p>
            ) : (
              <p className="text-center text-gray-400 py-8">
                Type to search users...
              </p>
            )}
          </div>
        </div>

        {/* User Services */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {selectedUser
                ? `Services - ${selectedUser.name}`
                : "User Services"}
            </h2>

            {!selectedUser ? (
              <p className="text-center text-gray-400 py-12">
                Select a user to view their services
              </p>
            ) : loadingServices ? (
              <div className="flex justify-center py-12">
                <Loader className="animate-spin h-8 w-8 text-primary-600" />
              </div>
            ) : services.length > 0 ? (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service._id}
                    className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{service.serviceName}</h3>
                      <StatusBadge status={service.status} />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {service.description}
                    </p>
                    {service.adminNote && (
                      <div className="text-xs bg-blue-50 p-2 rounded mb-1">
                        <strong>Admin:</strong> {service.adminNote}
                      </div>
                    )}
                    {service.userNote && (
                      <div className="text-xs bg-green-50 p-2 rounded">
                        <strong>User:</strong> {service.userNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">
                No services found for this user
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
