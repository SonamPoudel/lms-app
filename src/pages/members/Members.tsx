import { PencilIcon, Trash2Icon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../context/AuthContext"; // Update with actual path

interface Member {
  id: number;
  name: string;
  phone: string;
  address: string;
  user_id: number;
}

export default function Member() {
  const { token } = useContext(AuthContext); // Get token from AuthContext
  const [memberData, setMemberData] = useState<Member[]>([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/members", {
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
        setMemberData(data.sort((a: Member, b: Member) => a.id - b.id));
      } else {
        console.error("Invalid data format:", data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]); // Re-fetch when token updates

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/members/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      setMemberData((prev) => prev.filter((member) => member.id !== id));
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/members/edit/${id}`);
  };

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-semibold mb-4">Members</h1>
      <button
        onClick={() => navigate("/members/add")}
        className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        + Add Member
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
            {memberData.length > 0 ? (
              memberData.map((member) => (
                <tr
                  key={member.id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3">{member.id}</td>
                  <td className="p-3">{member.name}</td>
                  <td className="p-3">{member.phone}</td>
                  <td className="p-3">{member.address}</td>
                  <td className="p-3">{member.user_id}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(member.id)}
                        className="p-2 bg-green-400 text-white rounded-md hover:bg-green-600 transition duration-150"
                      >
                        <PencilIcon size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
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
                  No members detected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
