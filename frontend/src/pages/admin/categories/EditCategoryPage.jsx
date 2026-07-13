import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";

const EditCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const { data } = await API.get(`/category/get-category/${id}`);

      setTitle(data.category.title);
      setDescription(data.category.description);
      setCurrentImage(data.category.imageUrl);
    } catch (error) {
      console.log(error);
      alert("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    try {
      await API.put(`/category/update-category/${id}`, formData);

      alert("Category updated successfully");

      navigate("/admin/categories");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Failed to update category");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-2xl font-semibold">Loading Category...</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Category</h1>

        <button
          onClick={() => navigate("/admin/categories")}
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Category Name</label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {currentImage && (
          <div>
            <label className="block mb-2 font-medium">Current Image</label>

            <img
              src={currentImage}
              alt={title}
              className="w-40 h-40 object-cover rounded-lg border"
            />
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium">Change Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategoryPage;
