import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiSearch,
  FiPlus,
  FiRefreshCw,
  FiTag,
  FiEdit2,
  FiCheckCircle,
  FiXCircle,
  FiArrowUpRight,
  FiImage,
} from "react-icons/fi";
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
    setLoading(true);

    try {
      const { data } = await API.get("/category/get-all-categories");
      setCategories(data.categories || []);
    } catch (error) {
      console.error(error);
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
      console.error(error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredCategories = categories.filter((category) => {
    const query = search.toLowerCase();

    return (
      (category.title || "").toLowerCase().includes(query) ||
      (category.description || "").toLowerCase().includes(query)
    );
  });

  const activeCount = categories.filter((category) => category.isActive).length;

  const inactiveCount = categories.length - activeCount;

  const summaryCards = [
    {
      title: "Total Categories",
      value: categories.length,
      icon: FiGrid,
      style: "bg-[#F0E7FC] text-[#6D28D9]",
    },
    {
      title: "Active Categories",
      value: activeCount,
      icon: FiCheckCircle,
      style: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Inactive Categories",
      value: inactiveCount,
      icon: FiXCircle,
      style: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
              BIRD Management
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
            Categories Management
          </h1>

          <p className="mt-2 text-sm text-[#796B87] sm:text-base">
            Organize and manage your store categories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchCategories}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5D6F8] bg-white px-4 py-3 text-sm font-semibold text-[#5B21B6] shadow-sm transition hover:bg-[#F5EEFF] disabled:opacity-60"
          >
            <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/categories/add")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3 text-sm font-bold text-white shadow-md shadow-purple-900/15 transition hover:bg-[#5B21B6] hover:shadow-lg"
          >
            <FiPlus size={19} />
            Add Category
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-[#EAE3F2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D7C2F3] hover:shadow-lg hover:shadow-purple-900/5"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.style}`}
                >
                  <Icon size={22} />
                </span>

                <FiArrowUpRight
                  size={18}
                  className="text-[#C2B2D4] transition group-hover:text-[#6D28D9]"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-[#796B87]">
                {card.title}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-[#352047]">
                {loading ? (
                  <span className="inline-block h-8 w-14 animate-pulse rounded-lg bg-[#F0EAF6]" />
                ) : (
                  card.value
                )}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Categories Workspace */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
        {/* Search Toolbar */}
        <div className="border-b border-[#EEE7F5] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-[#352047]">
                All Categories
              </h2>

              <p className="mt-1 text-sm text-[#897A98]">
                {loading
                  ? "Loading categories..."
                  : `${filteredCategories.length} of ${categories.length} categories`}
              </p>
            </div>

            <div className="relative w-full sm:max-w-md">
              <FiSearch
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6AAF]"
              />

              <input
                type="text"
                placeholder="Search by category or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] py-3 pl-11 pr-4 text-sm text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4 rounded-xl border border-[#F0EAF5] p-4"
              >
                <div className="h-14 w-14 rounded-xl bg-[#F0EAF5]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-[#F0EAF5]" />
                  <div className="h-3 w-2/3 rounded bg-[#F0EAF5]" />
                </div>
                <div className="h-8 w-24 rounded-lg bg-[#F0EAF5]" />
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
              {search ? <FiSearch size={28} /> : <FiGrid size={28} />}
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#352047]">
              {search ? "No matching categories" : "No categories found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#897A98]">
              {search
                ? "Try a different search term to find your category."
                : "Create your first category to start organizing products."}
            </p>

            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5B21B6]"
              >
                Clear Search
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/admin/categories/add")}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5B21B6]"
              >
                <FiPlus size={17} />
                Add Category
              </button>
            )}
          </div>
        ) : (
          /* Categories Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="bg-[#F8F3FF] text-[11px] uppercase tracking-[0.12em] text-[#6B4A91]">
                  <th className="px-5 py-4 font-bold">Category</th>
                  <th className="px-5 py-4 font-bold">Description</th>
                  <th className="px-5 py-4 text-center font-bold">Status</th>
                  <th className="px-5 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EAF5]">
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className={`transition-colors ${
                      category.isActive
                        ? "hover:bg-[#FCFAFF]"
                        : "bg-[#FAF8FC] hover:bg-[#F7F1FC]"
                    }`}
                  >
                    {/* Category Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#EEE7F5] bg-[#FAF8FC]">
                          {category.imageUrl ? (
                            <img
                              src={category.imageUrl}
                              alt={category.title || "Category"}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiImage size={23} className="text-[#B9A4D2]" />
                          )}
                        </div>

                        <div>
                          <h3
                            className={`text-sm font-bold ${
                              category.isActive
                                ? "text-[#352047]"
                                : "text-[#8B7C99]"
                            }`}
                          >
                            {category.title || "Untitled Category"}
                          </h3>

                          <p className="mt-1 text-[11px] text-[#A092AF]">
                            ID: {String(category._id).slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="max-w-sm px-5 py-4">
                      <p className="line-clamp-2 text-sm leading-6 text-[#796B87]">
                        {category.description || "No description available"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          category.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            category.isActive ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/categories/edit/${category._id}`)
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-[#DCC8F6] bg-[#F5EEFF] px-3 py-2 text-xs font-semibold text-[#5B21B6] transition hover:border-[#BFA0ED] hover:bg-[#EDE3FF] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10"
                        >
                          <FiEdit2 size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(category)}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-4 ${
                            category.isActive
                              ? "border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-100 focus:ring-rose-100"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 focus:ring-emerald-100"
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

        {/* Footer */}
        {!loading && filteredCategories.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-[#EEE7F5] bg-[#FCFAFE] px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-[#897A98]">
              Showing{" "}
              <span className="font-semibold text-[#554064]">
                {filteredCategories.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#554064]">
                {categories.length}
              </span>{" "}
              categories
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-[#6D28D9]">
              <FiTag size={14} />
              Keep your store organized
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoriesPage;
