import React, { useContext } from "react";
import CustomInput from "../../components/CustomInput";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext"; // Update with actual path

export default function AddMembers() {
  const { token } = useContext(AuthContext); // Get token from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const memberData = Object.fromEntries(formData.entries());

    // Ensure correct data types & validation
    const name = memberData.name as string;
    const phone = memberData.phone as string;
    const address = memberData.address as string;
    const user_id = parseInt(memberData.user_id as string, 10);

    if (!name || !phone || !address || isNaN(user_id)) {
      alert("Please fill all fields correctly.");
      return;
    }

    const memberDataReq = { name, phone, address, user_id };

    try {
      const response = await fetch("http://localhost:3000/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberDataReq),
      });

      const result = await response.json(); // Read response body

      if (response.status === 201) {
        alert("Member added successfully!");
        navigate("/members");
      } else {
        console.error("Failed to add member:", result);
        alert(result.message || "Failed to add member.");
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
            <CustomInput label="Name" type="text" name="name" required />
            <CustomInput label="Phone" type="text" name="phone" required />
            <CustomInput label="Address" type="text" name="address" required />
          </div>
          <div className="flex flex-col space-y-2 w-1/2">
            <CustomInput
              label="User ID"
              type="number"
              name="user_id"
              required
            />
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
