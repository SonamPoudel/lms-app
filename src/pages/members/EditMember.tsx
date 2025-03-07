import React, { useEffect, useState } from "react";
import CustomInput from "../../components/CustomInput";
import { useNavigate, useParams } from "react-router";

export default function EditMember() {
  const [memberData, setMemberData] = useState<any>({});
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch member details
  const findMember = async () => {
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
      setMemberData(parsedData);
    } catch (err) {
      console.error("Error fetching member data:", err);
      alert("Failed to load member data.");
    }
  };

  useEffect(() => {
    findMember();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedMemberData = Object.fromEntries(formData.entries()); // Convert FormData to object

    try {
      const response = await fetch(`http://localhost:3000/members/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedMemberData),
      });

      if (response.ok) {
        alert("Member updated successfully!");
        navigate("/members");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Failed to update member.");
    }
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <h1 className="text-lg font-bold">Edit Member</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 bg-white p-8 rounded-lg shadow-md w-full"
      >
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col space-y-2 w-1/2">
            <CustomInput
              value={memberData?.id || ""}
              label="ID"
              type="number"
              name="id"
            />
            <CustomInput
              value={memberData?.name || ""}
              label="Name"
              type="text"
              name="name"
            />
            <CustomInput
              value={memberData?.phone || ""}
              label="Phone"
              type="number"
              name="phone"
            />
            <CustomInput
              value={memberData?.address || ""}
              label="Address"
              type="text"
              name="address"
            />
          </div>
          <div className="flex flex-col space-y-2 w-1/2">
            <CustomInput
              value={memberData?.user_id || ""}
              label="User ID"
              type="number"
              name="user_id"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black w-[150px] text-white py-2 rounded-md cursor-pointer"
          >
            + Update Member
          </button>
        </div>
      </form>
    </div>
  );
}
