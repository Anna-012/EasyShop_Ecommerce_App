import { useEffect, useState, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import API from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";

import HomeFilters from "../../components/client/Home/HomeFilters";
import ProductToolbar from "../../components/client/Home/ProductToolbar";
import ActiveFilters from "../../components/client/Home/ActiveFilters";
import ProductGrid from "../../components/client/Home/ProductGrid";
import GuestAuthModal from "../../components/auth/GuestAuthModal";

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          API.get("/products/get-all-products"),
          API.get("/category/get-all-categories"),
        ]);

        setProducts(productsResponse.data.products || []);
        setCategories(categoriesResponse.data.categories || []);
      } catch (err) {
        console.error("Failed to load homepage data:", err);
        setError(true);
      } finally {
        setLoading(false);
        window.hideBirdLoader?.();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategories(category ? [category] : []);
  }, [category]);

  const highestPrice = useMemo(() => {
    return Math.max(
      1,
      ...products.map((product) => Number(product.sellingPrice) || 0),
    );
  }, [products]);

  const priceLimit = maxPrice ?? highestPrice;

  const toggleCategory = (categoryTitle) => {
    const nextCategories = selectedCategories.includes(categoryTitle)
      ? selectedCategories.filter((item) => item !== categoryTitle)
      : [...selectedCategories, categoryTitle];

    setSelectedCategories(nextCategories);

    if (category) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("category");
      setSearchParams(nextParams);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setInStockOnly(false);
    setMaxPrice(null);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("category");
    setSearchParams(nextParams);
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchSearch = search
        ? (product.title || "").toLowerCase().includes(search.toLowerCase())
        : true;

      const matchCategory = selectedCategories.length
        ? selectedCategories.includes(product.category?.title)
        : true;

      const matchPrice = (Number(product.sellingPrice) || 0) <= priceLimit;

      const matchStock = inStockOnly ? Number(product.stockQuantity) > 0 : true;

      return matchSearch && matchCategory && matchPrice && matchStock;
    });

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => (Number(a.sellingPrice) || 0) - (Number(b.sellingPrice) || 0),
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) => (Number(b.sellingPrice) || 0) - (Number(a.sellingPrice) || 0),
      );
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [products, search, selectedCategories, priceLimit, inStockOnly, sortBy]);

  const handleAddToCart = (product) => {
    if (!userInfo) {
      setShowGuestModal(true);
      return;
    }

    addToCart(product);
  };

  return (
    <main className="min-h-screen bg-[#FAF9FF] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
          <HomeFilters
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            clearFilters={clearFilters}
            priceLimit={priceLimit}
            highestPrice={highestPrice}
            setMaxPrice={setMaxPrice}
            loading={loading}
            products={products}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
          />

          <section className="min-w-0 flex-1 w-full">
            <ProductToolbar
              search={search}
              loading={loading}
              error={error}
              productCount={filteredProducts.length}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />

            <ActiveFilters
              selectedCategories={selectedCategories}
              inStockOnly={inStockOnly}
              maxPrice={maxPrice}
              priceLimit={priceLimit}
              toggleCategory={toggleCategory}
              setInStockOnly={setInStockOnly}
              setMaxPrice={setMaxPrice}
            />

            <ProductGrid
              loading={loading}
              error={error}
              products={filteredProducts}
              onAddToCart={handleAddToCart}
              onClearFilters={clearFilters}
            />
          </section>
        </div>
      </div>

      <GuestAuthModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
      />
    </main>
  );
};

export default HomePage;
