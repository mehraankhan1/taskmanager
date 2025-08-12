import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const FoundItems = () => {
  const { user } = useAuth();
  const token = user?.token;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState("");
  const [foundItems, setFoundItems] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    photo: "",
  });

  // Fetch all found items from backend
  const fetchFoundItems = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/found");
      const data = await res.json();
      setFoundItems(data);
    } catch (error) {
      console.error("Failed to fetch found items:", error);
    }
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

  // Submit found item form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("You must be logged in to submit a found item.");
      return;
    }

    const foundItemData = { title, description, category, location, photo };

    try {
      const res = await fetch("http://localhost:5001/api/found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(foundItemData),
      });

      if (res.ok) {
        setMessage("Found item reported successfully!");
        // Clear form
        setTitle("");
        setDescription("");
        setCategory("Other");
        setLocation("");
        setPhoto("");
        fetchFoundItems(); // Refresh list
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Failed to report found item.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  // Delete found item
  const handleDelete = async (id) => {
    if (!token) {
      setMessage("You must be logged in to delete an item.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`http://localhost:5001/api/found/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMessage("Found item deleted!");
        fetchFoundItems();
      } else {
        const err = await res.json();
        setMessage(err.message || "Failed to delete item.");
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
    }
  };

  // Start editing
  const startEditing = (item) => {
    setEditingId(item._id);
    setEditFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      photo: item.photo || "",
    });
  };

  // Update submit
  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();

    if (!token) {
      setMessage("You must be logged in to update an item.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/found/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setMessage("Found item updated!");
        setEditingId(null);
        fetchFoundItems();
      } else {
        const err = await res.json();
        setMessage(err.message || "Failed to update item.");
      }
    } catch (error) {
      setMessage("Server error. Try again later.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Report a Found Item
      </h2>
      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.includes("successfully") ||
            message.includes("updated") ||
            message.includes("deleted")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-10">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Item Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Enter item title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Describe the found item"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Documents">Documents</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="Where was it found?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="photo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Photo URL (optional)
          </label>
          <input
            id="photo"
            type="text"
            placeholder="Enter photo URL"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Report Found Item
        </button>
      </form>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Found Items</h2>
      {foundItems.length === 0 ? (
        <p className="text-gray-600">No found items reported yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foundItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-2">
                {item.description}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Category:</strong> {item.category}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                <strong>Location:</strong> {item.location}
              </p>
              {item.photo && (
                <img
                  src={item.photo}
                  alt={item.title}
                  className="max-w-[150px] rounded-md mb-4"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-600 px-4 py-2 border border-red-600 rounded-md hover:bg-red-50 transition duration-200"
                >
                  Delete
                </button>
                <button
                  onClick={() => startEditing(item)}
                  className="text-blue-600 px-4 py-2 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-200"
                >
                  Edit
                </button>
              </div>
              {editingId === item._id ? (
                <form
                  onSubmit={(e) => handleUpdateSubmit(e, item._id)}
                  className="flex flex-col gap-4 mt-4"
                >
                  <div>
                    <label
                      htmlFor={`edit-title-${item._id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Item Title
                    </label>
                    <input
                      id={`edit-title-${item._id}`}
                      type="text"
                      value={editFormData.title}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          title: e.target.value,
                        })
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`edit-description-${item._id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id={`edit-description-${item._id}`}
                      value={editFormData.description}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          description: e.target.value,
                        })
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`edit-category-${item._id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id={`edit-category-${item._id}`}
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          category: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Documents">Documents</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`edit-location-${item._id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Location
                    </label>
                    <input
                      id={`edit-location-${item._id}`}
                      type="text"
                      value={editFormData.location}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          location: e.target.value,
                        })
                      }
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`edit-photo-${item._id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Photo URL (optional)
                    </label>
                    <input
                      id={`edit-photo-${item._id}`}
                      type="text"
                      value={editFormData.photo}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          photo: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setMessage("");
                      }}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoundItems;
