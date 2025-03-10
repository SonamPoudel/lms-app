import { createContext, useEffect, useState } from "react";
import { Book } from "../pages/books/Books";
import { api } from "../utils/api";

interface BooksContextType {
  bookData: Book[];
  setBookData: (bookData: Book[]) => void;
}

const BooksContext = createContext<BooksContextType>({
  bookData: [],
  setBookData: () => {},
});

const BooksProvider = ({ children }: any) => {
  const [bookData, setBookData] = useState<Book[]>([]);
  const fetchBooks = async () => {
    try {
      const response = await api({
        url: "/books",
      });
      //sorting books by id in ascending order
      const sortedData = response.data.sort((a: Book, b: Book) => a.id - b.id);
      setBookData(sortedData);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <BooksContext.Provider value={{ bookData, setBookData }}>
      {children}
    </BooksContext.Provider>
  );
};

export { BooksProvider, BooksContext };
