import React, { useContext } from "react";
import CustomInput from "../../components/CustomInput";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext"; // Update with actual path

export default function AddTransaction() {
  const { token } = useContext(AuthContext); // Get token from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const transactionData = Object.fromEntries(formData.entries());

    // Ensure correct data types & validation
    const deadline = transactionData.deadline as string;
    const book_id = transactionData.book_id as string;
    const transaction_type = transactionData.transaction_type as string;
    const member_id = parseInt(transactionData.member_id as string, 10);

    if (!deadline || !member_id || !book_id || transaction_type) {
      alert("Please fill all fields correctly.");
      return;
    }

    const transactionDataReq = { deadline, member_id, book_id, transaction_type };

    try {
      const response = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionDataReq),
      });

      const result = await response.json(); // Read response body

      if (response.status === 201) {
        alert("Transaction added successfully!");
        navigate("/transactions");
      } else {
        console.error("Failed to add transaction:", result);
        alert(result.message || "Failed to add transaction.");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-lg font-bold">Add Transaction</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 bg-white p-8 rounded-lg shadow-md w-full"
      >
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col space-y-2 w-1/2">
            <CustomInput label="Deadline" type="text" name="deadline" required />
            <CustomInput label="Member_id" type="number" name="member_id" required />
            <CustomInput label="Transaction_type" type="text" name="transaction_type" required />
            <CustomInput label="Book_id" type="number" name="book_id" required/>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black w-[150px] text-white py-2 rounded-md cursor-pointer"
          >
            + Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
