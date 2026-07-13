import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const AddCategoryPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      await API.post("/category/create-category", formData);

      alert("Category Created Successfully");

      navigate("/admin/categories");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Add Category</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Category Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <textarea
          rows="4"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border rounded-lg px-4 py-3"
          required
        />

        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default AddCategoryPage;
