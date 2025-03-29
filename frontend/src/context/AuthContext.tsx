import { createContext, useContext } from "react";
import { useState, useEffect } from "react";

type AuthUserType = {
  id: string;
  fullname: string;
  profilePic: string;
  gender: string;
};

const AuthContext = createContext<{
  authUser: AuthUserType | null;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
}>({
  authUser: null,
  setAuthUser: () => {},
  isLoading: true,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //logic
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const backendUrl = import.meta.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/auth/me`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setAuthUser(data);
      } catch (error) {
        console.error("Error fetching user:", error); // Optional for debugging
        // setAuthUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser(); // ✅ Invoking the function
  }, []);

  return (

    <AuthContext.Provider value={{ authUser, setAuthUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};