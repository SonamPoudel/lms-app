import { PencilIcon, Trash2Icon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext"; // Update with actual path

interface Transaction {
  id: number;
  deadline: string;
  member_id: string;
  transaction_type: string;
  book_id: number;
}

export default function Transaction() {
  const { token } = useContext(AuthContext); // Get token from AuthContext
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/transactions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response Status:", response.status); // Debugging
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data); // Debugging

      if (Array.isArray(data)) {
        setTransactionData(data.sort((a: Transaction, b: Transaction) => a.id - b.id));
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]); // Re-fetch when token updates

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/transaction/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      setTransactionData((prev) => prev.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/transactions/edit/${id}`);
  };

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-semibold mb-4">Transactions</h1>
      <button
        onClick={() => navigate("/transactions/add")}
        className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        + Add Transaction
      </button>
      <div className="w-full overflow-auto mt-6">
        <table className="w-full bg-white border border-black-500 rounded-lg shadow-md">
          <thead className="bg-green-200 border-b">
            <tr className="text-left text-gray-600">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">User ID</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactionData.length > 0 ? (
              transactionData.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3">{transaction.id}</td>
                  <td className="p-3">{transaction.deadline}</td>
                  <td className="p-3">{transaction.book_id}</td>
                  <td className="p-3">{transaction.member_id}</td>
                  <td className="p-3">{transaction.transaction_type}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(transaction.id)}
                        className="p-2 bg-green-400 text-white rounded-md hover:bg-green-600 transition duration-150"
                      >
                        <PencilIcon size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 bg-red-400 text-white rounded-md hover:bg-red-600 transition duration-150"
                      >
                        <Trash2Icon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No transactions detected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
