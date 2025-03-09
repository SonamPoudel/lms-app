import React, { useContext, useState, useMemo } from "react";
import CustomInput from "../../components/CustomInput";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext"; // Update with actual path
import { BooksContext } from "../../context/BooksContext";

export default function AddTransaction() {
  const [transactionType, setTransactionType] = useState("borrow");
  const [bookId, setBookId] = useState<number | null>(null);
  const { token } = useContext(AuthContext); // Get token from AuthContext
  const navigate = useNavigate();
  const { bookData } = useContext(BooksContext);

  console.log(bookData);

  const bookOptions = useMemo(
    () =>
      bookData.map((book) => ({
        label: book.title,
        value: book.id,
      })),
    [bookData]
  );

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

    console.log({ transactionType, bookId })

    const transactionDataReq = {
      deadline,
      member_id,
      book_id: bookId,
      transaction_type: transactionType,
    };

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
    <div className="flex flex-col items-start gap-4 w-full">
      <h1 className="text-lg font-bold">Add Transaction</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 bg-white p-8 rounded-lg shadow-md w-full"
      >
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-4 w-full">
            <div className="flex flex-col w-full">
              <label htmlFor="book">Book</label>
              <select
                name="book"
                className="w-full border h-8 rounded border-gray-300 px-2"
                defaultValue={""}
                onChange={(e) => setBookId(parseInt(e.target.value, 10))}
              >
                <option>Select Book</option>
                {bookOptions.map((book) => (
                  <option key={book.value} value={book.value}>
                    {book.label}
                  </option>
                ))}
              </select>
            </div>
            <CustomInput
              label="Member_id"
              type="number"
              name="member_id"
              required
            />
          </div>
          <div className="flex gap-4 w-full">
            {/* select input */}
            <div className="flex flex-col w-full">
              <label htmlFor="transaction_type">Transaction Type</label>
              <select
                name="transaction_type"
                className="w-full border h-8 rounded border-gray-300 px-2"
                defaultValue={"borrow"}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="borrow">Borrow</option>
                <option value="return">Return</option>
              </select>
            </div>

            <CustomInput
              label="Deadline"
              type="date"
              name="deadline"
              required
            />
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
