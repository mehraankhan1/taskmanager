import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [message, setMessage] = useState("");

  const fetchLostItems = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/lost");
      const data = await res.json();
      setLostItems(data);
    } catch (err) {
      setMessage("Failed to load lost items");
    }
  };

  const fetchFoundItems = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/found");
      const data = await res.json();
      setFoundItems(data);
    } catch (err) {
      setMessage("Failed to load found items");
    }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/login");
    } else {
      fetchLostItems();
      fetchFoundItems();
    }
  }, [user, navigate]);

  const handleDeleteLost = async (id) => {
    if (!window.confirm("Delete lost item?")) return;
    try {
      await fetch(`http://localhost:5001/api/lost/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage("Lost item deleted");
      fetchLostItems();
    } catch {
      setMessage("Failed to delete lost item");
    }
  };

  const handleDeleteFound = async (id) => {
    if (!window.confirm("Delete found item?")) return;
    try {
      await fetch(`http://localhost:5001/api/found/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage("Found item deleted");
      fetchFoundItems();
    } catch {
      setMessage("Failed to delete found item");
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-poppins text-gray-800">
      {/* Header Bar */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{user?.email || "Admin"}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {message && <p className="text-red-500 text-center mb-6">{message}</p>}

        {/* Responsive Grid for Lost and Found Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lost Items Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Lost Items</h2>
            {lostItems.length === 0 ? (
              <p className="text-gray-500">No lost items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 font-semibold">Title</th>
                      <th className="p-3 font-semibold">Description</th>
                      <th className="p-3 font-semibold">Category</th>
                      <th className="p-3 font-semibold">Location</th>
                      <th className="p-3 font-semibold">Reported By</th>
                      <th className="p-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lostItems.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="p-3">{item.title}</td>
                        <td className="p-3">{item.description}</td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3">{item.location}</td>
                        <td className="p-3">
                          {item.createdBy?.email || "N/A"}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteLost(item._id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full md:w-auto"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Found Items Section */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Found Items</h2>
            {foundItems.length === 0 ? (
              <p className="text-gray-500">No found items reported.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-3 font-semibold">Title</th>
                      <th className="p-3 font-semibold">Description</th>
                      <th className="p-3 font-semibold">Category</th>
                      <th className="p-3 font-semibold">Location</th>
                      <th className="p-3 font-semibold">Reported By</th>
                      <th className="p-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foundItems.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-gray-100 transition`}
                      >
                        <td className="p-3">{item.title}</td>
                        <td className="p-3">{item.description}</td>
                        <td className="p-3">{item.category}</td>
                        <td className="p-3">{item.location}</td>
                        <td className="p-3">
                          {item.createdBy?.email || "N/A"}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleDeleteFound(item._id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full md:w-auto"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
