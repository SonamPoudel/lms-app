import { PencilIcon, Trash2Icon } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { BooksContext } from "../../context/BooksContext";
import { api } from "../../utils/api";

const token = localStorage.getItem("token");

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  published_date: Date;
  isbn: number;
  category: string;
  available_copies: number;
  total_copies: number;
}

export default function Books() {
  const navigate = useNavigate();
  const { bookData, setBookData } = useContext(BooksContext);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await api({
        url: `/books/${id}`,
        method: "DELETE",
      });
      const filteredBook = bookData.filter((book) => book.id !== id);

      setBookData(filteredBook);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/books/edit/${id}`);
  };

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-3xl font-semibold mb-4">Books</h1>

      <button
        onClick={() => navigate("/books/add")}
        className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
      >
        + Add Book
      </button>

      <div className="w-full overflow-auto mt-6">
        <table className="w-full bg-white border border-black-500 rounded-lg shadow-md">
          <thead className="bg-green-200 border-b">
            <tr className="text-left text-gray-600">
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Publisher</th>
              <th className="p-3">Published Date</th>
              <th className="p-3">ISBN</th>
              <th className="p-3">Category</th>
              <th className="p-3">Available Copies</th>
              <th className="p-3">Total Copies</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookData.length > 0 ? (
              bookData.map((book) => (
                <tr
                  key={book.id}
                  className="border-b hover:bg-gray-50 transition duration-150"
                >
                  <td className="p-3">{book.id}</td>
                  <td className="p-3">{book.title}</td>
                  <td className="p-3">{book.author}</td>
                  <td className="p-3">{book.publisher}</td>
                  <td className="p-3">
                    {new Date(book.published_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{book.isbn}</td>
                  <td className="p-3">{book.category}</td>
                  <td className="p-3">{book.available_copies}</td>
                  <td className="p-3">{book.total_copies}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleEdit(book.id)}
                        className="p-2 bg-green-400 text-white rounded-md hover:bg-green-600 transition duration-150"
                      >
                        <PencilIcon size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
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
                <td colSpan={10} className="p-4 text-center text-gray-500">
                  No books available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
