import { createContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  handleLogout: () => void;
  handleLogin: (token: string) => void;
}

// Create a context with default values
const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {}, // Empty function
  handleLogout: () => {},
  handleLogin: () => {},
});

// Define provider props type
interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize token from localStorage
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  useEffect(() => {
    // Sync token with localStorage whenever it changes
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const handleLogin = (token: string) => {
    setToken(token); // Update state
  };

  const handleLogout = () => {
    setToken(null); // Clear token
  };

  return (
    // Provide the context to all the children
    <AuthContext.Provider
      value={{ token, setToken, handleLogout, handleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Export the context and provider
export { AuthContext, AuthProvider };
