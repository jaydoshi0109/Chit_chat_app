import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

type SignupInputs = {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  gender: string;
};

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async (inputs: SignupInputs) => {
    try {
      setLoading(true);
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong"); // ✅ Handle undefined messages
      }

      setAuthUser(data);
    } catch (error: any) {
      toast.error(error.message); // ✅ Now error.message will work correctly
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;