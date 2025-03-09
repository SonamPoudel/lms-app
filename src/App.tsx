import { Routes, Route, Navigate } from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AppLayout from "./AppLayout";
import Books from "./pages/books/Books";
import AddBooks from "./pages/books/AddBooks";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import EditBook from "./pages/books/EditBooks";
import AddMembers from "./pages/members/AddMember";
import Members from "./pages/members/Members";
import EditMember from "./pages/members/EditMember";
import Transaction from "./pages/transactions/Transactions";
import AddTransaction from "./pages/transactions/AddTransactions";
import EditTransaction from "./pages/transactions/EditTransactions";

// default export
export default function App() {
  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
      <AppRoutes />
    </div>
  );
}

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);
  console.log({ token });
  const tokenn = localStorage.getItem("token");
  return tokenn ? <AppLayout /> : <Navigate to="login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="users" element={<Users />} />
        <Route path="books" element={<Books />} />
        <Route path="books/add" element={<AddBooks />} />
        <Route path="/books/edit/:id" element={<EditBook />} />
        <Route path="members" element={<Members />} />
        <Route path="members/add" element={<AddMembers />} />
        <Route path="/members/edit/:id" element={<EditMember />} />
        <Route path="transactions" element={<Transaction />} />
        <Route path="transactions/add" element={<AddTransaction />} />
        <Route path="/transactions/edit/:id" element={<EditTransaction/>} />
      </Route>
    </Routes>
  );
}

function Users() {
  return <h1>Users</h1>;
}

// JSX can have only one parent element
