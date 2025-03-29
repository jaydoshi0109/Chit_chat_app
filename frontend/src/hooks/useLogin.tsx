import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogin = () => {
  type LoginInputs = {
    username: string;
    password: string;
  };

  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (inputs: LoginInputs) => {
    try {
      setLoading(true);

      const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // <-- Important if you're using cookies
        body: JSON.stringify(inputs),
      });
      

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong"); // ✅ Handle undefined messages
      }

      setAuthUser(data);
      toast.success(data.message || "Logged in successfully");
    } catch (error: any) {
      toast.error(error.message); // ✅ Now error.message will work correctly
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;