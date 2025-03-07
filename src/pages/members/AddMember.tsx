import React from "react";
import CustomInput from "../../components/CustomInput";
import { useNavigate } from "react-router";

export default function AddMembers() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const memberData = Object.fromEntries(formData.entries()); // Convert FormData to object

    // Ensure correct data types
    const memberDataReq = {
      ...memberData,
      phone: parseInt(memberData.phone as string, 10), // Convert to number
      user_id: parseInt(memberData.user_id as string, 10), // Convert to number
    };

    try {
      const response = await fetch("http://localhost:3000/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberDataReq),
      });

      if (response.status === 201) {
        alert("Member added successfully!");
        navigate("/members");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-lg font-bold">Add Member</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 bg-white p-8 rounded-lg shadow-md w-full"
      >
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col space-y-2 w-1/2">
            <CustomInput label="Name" type="text" name="name" />
            <CustomInput label="Phone" type="number" name="phone" />
            <CustomInput label="Address" type="text" name="address" />
          </div>
          <div className="flex flex-col space-y-2 w-1/2">
            <CustomInput label="User ID" type="number" name="user_id" />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black w-[150px] text-white py-2 rounded-md cursor-pointer"
          >
            + Add Member
          </button>
        </div>
      </form>
    </div>
  );
}
