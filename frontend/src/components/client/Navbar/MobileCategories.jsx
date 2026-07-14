import { Link } from "react-router-dom";

const MobileCategories = ({ categories }) => {
  return (
    <div className="lg:hidden overflow-x-auto whitespace-nowrap">
      <div className="flex gap-6 px-4 py-3">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/?category=${category.title}`}
            className="text-sm font-medium hover:text-orange-500"
          >
            {category.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileCategories;
