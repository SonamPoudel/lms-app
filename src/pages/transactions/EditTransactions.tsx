import React, { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput";
import { useNavigate, useParams } from "react-router";

export default function EditTransaction() {
  const [transactionData, setTransactionData] = useState<any>({});
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch member details
  const findTransaction = async () => {
    try {
      const response = await fetch(`http://localhost:3000/members/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch member data");

      const parsedData = await response.json();
      setTransactionData(parsedData);
    } catch (err) {
      console.error("Error fetching transaction data:", err);
      alert("Failed to load transaction data.");
    }
  };

  useEffect(() => {
    findTransaction();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedTransactionData = Object.fromEntries(formData.entries()); // Convert FormData to object

    try {
      const response = await fetch(`http://localhost:3000/transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTransactionData),
      });

      if (response.ok) {
        alert("Transaction updated successfully!");
        navigate("/transactions");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-lg font-bold">Edit Transaction</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 bg-white p-8 rounded-lg shadow-md w-full"
      >
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col space-y-2 w-1/2">
            <CustomInput
              value={transactionData?.id || ""}
              label="ID"
              type="number"
              name="id"
            />
            <CustomInput
              value={transactionData?.deadline || ""}
              label="Deadline"
              type="date"
              name="deadline"
            />
            <CustomInput
              value={transactionData?.member_id || ""}
              label="Member_id"
              type="number"
              name="member_id"
            />
            <CustomInput
              value={transactionData?.book_id || ""}
              label="Book_id"
              type="number"
              name="book_id"
            />
          </div>
          <div className="flex flex-col space-y-2 w-1/2">
            <CustomInput
              value={transactionData?.transaction_type || ""}
              label="Transaction_type"
              type="text"
              name="transaction_type"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black w-[150px] text-white py-2 rounded-md cursor-pointer"
          >
            + Update Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
