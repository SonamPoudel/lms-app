import { createContext, useEffect, useState } from "react";
import { Book } from "../pages/books/Books";

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
  const token = localStorage.getItem("token");

   const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/books", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        //sorting books by id in ascending order
        const sortedData = data.sort((a: Book, b: Book) => a.id - b.id);
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
  )
}

export { BooksProvider, BooksContext };