import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { employeeLogout } from "../../redux/employee/employeeSlice";

export default function ViewCheckouts() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch all checkouts
  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await fetch("/api/checkout");
        if (!response.ok) {
          throw new Error("Failed to fetch checkouts");
        }
        const data = await response.json();
        setCheckouts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (checkoutId, status) => {
    try {
      const response = await fetch(`/api/checkout/${checkoutId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();

      // Update the checkout status in the state
      setCheckouts((prevCheckouts) =>
        prevCheckouts.map((checkout) =>
          checkout._id === checkoutId ? { ...checkout, status: data.checkout.status } : checkout
        )
      );

      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  // Handle checkout deletion
  const handleDeleteCheckout = async (checkoutId) => {
    try {
      const response = await fetch(`/api/checkout/${checkoutId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete checkout");
      }

      // Remove the deleted checkout from the state
      setCheckouts((prevCheckouts) =>
        prevCheckouts.filter((checkout) => checkout._id !== checkoutId)
      );

      alert("Checkout deleted successfully!");
    } catch (error) {
      console.error("Error deleting checkout:", error);
      alert("Failed to delete checkout");
    }
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
        <h1 className="text-3xl font-extrabold text-[#161A1D] mb-8">All Checkouts</h1>

        {/* Checkouts Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#161A1D]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-[#F5F3F4] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3F4]">
              {checkouts.map((checkout) => (
                <tr
                  key={checkout._id}
                  className="hover:bg-[#F5F3F4] transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {checkout.userId?.username || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {checkout.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {checkout.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {checkout.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    ${checkout.totalPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    <select
                      value={checkout.status}
                      onChange={(e) => handleStatusUpdate(checkout._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-sm ${
                        checkout.status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : checkout.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161A1D]">
                    {new Date(checkout.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/checkoutdetails/${checkout._id}`}
                      className="bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDeleteCheckout(checkout._id)}
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