import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/category/get-all-categories");
      setCategories(data.categories);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await API.put(`/category/update-category/${category._id}`, {
        isActive: !category.isActive,
      });

      setCategories((prev) =>
        prev.map((item) =>
          item._id === category._id
            ? { ...item, isActive: !item.isActive }
            : item,
        ),
      );
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-2xl font-semibold">Loading Categories...</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-gray-500 mt-1">Manage your store categories</p>
        </div>

        <button
          onClick={() => navigate("/admin/categories/add")}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
        >
          + Add Category
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-3 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl text-gray-500">No Categories Found</h2>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Category */}
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={category.imageUrl}
                        alt={category.title}
                        className="w-16 h-16 rounded-xl object-cover border"
                      />

                      <div>
                        <h3 className="font-semibold text-lg">
                          {category.title}
                        </h3>

                        <p className="text-sm text-gray-500">
                          ID: {category._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="p-4 text-gray-600">{category.description}</td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/admin/categories/edit/${category._id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleToggleStatus(category)}
                        className={`px-4 py-2 rounded-lg text-white ${
                          category.isActive
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {category.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
