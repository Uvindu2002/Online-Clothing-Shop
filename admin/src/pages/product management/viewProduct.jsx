import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";

export default function ViewProducts() {
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/product/");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.products); // Set products in state
      } catch (error) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchProducts();
  }, []);

  // Handle delete product
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`/api/product/delete/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      // Remove the deleted product from the state
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle status change
  const handleStatusChange = async (productId, currentStatus) => {
    try {
      // Toggle status between "active" and "inactive"
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await fetch(`/api/product/status/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }), // Send the new status
      });

      if (!response.ok) {
        throw new Error("Failed to update product status");
      }

      const data = await response.json();
      console.log("Response from backend:", data);

      // Update the product status in the state
      setProducts(
        products.map((product) =>
          product._id === productId
            ? { ...product, status: newStatus } // Update status in the state
            : product
        )
      );
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  // Navigate to the Edit Product page
  const handleEdit = (productId) => {
    navigate(`/editproduct/${productId}`); // Navigate to the Edit Product page
  };

  // Navigate to the Add Product page
  const handleAddProduct = () => {
    navigate("/addproduct"); // Navigate to the Add Product page
  };

  // Handle sign out
  const handleSignOut = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");

    // Dispatch the employee logout action
    dispatch(employeeLogout());

    // Navigate to the employee login page
    navigate("/employeeLogin");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#161A1D]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold text-[#660708]">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3F4]">
      {/* Header */}
      <header className="bg-[#161A1D] shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#F5F3F4]">Employee Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Title and Add Product Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#161A1D]">All Products</h1>
          <button
            onClick={handleAddProduct}
            className="bg-[#660708] text-[#F5F3F4] px-6 py-2 rounded-lg hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            Add Product
          </button>
        </div>

        {/* Table to display products */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#161A1D]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-[#F5F3F4] transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {product.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    ${product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded ${
                        product.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleStatusChange(product._id, product.status)}
                      className="ml-2 bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                    >
                      {product.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="ml-2 bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}