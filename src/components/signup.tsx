import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Loader } from "./loader";
import { AuthInputcomp } from "./authinput";
import { z } from "zod";
import { EyeOff, Eye, Moon, Sun } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inputSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must have at least 3 characters" })
    .max(10, { message: "Username can have at most 10 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must have at least 8 characters" })
    .max(20, { message: "Password can have at most 20 characters" })
    .regex(/\W/, { message: "Password must contain a special character" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" }),
});

export const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("password");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved dark mode preference on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedMode === "false") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // If no preference is saved, check if the home page has dark mode applied
      const isDarkModeApplied = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDarkModeApplied);
      localStorage.setItem("darkMode", isDarkModeApplied.toString());
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Save to localStorage so other pages (including home) can access it
    localStorage.setItem("darkMode", newMode.toString());
    
    // Apply dark mode to document for immediate effect
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Dispatch a custom event that the home page can listen for
    const darkModeEvent = new CustomEvent('darkModeChanged', { 
      detail: { isDarkMode: newMode } 
    });
    window.dispatchEvent(darkModeEvent);
  };

  const handleToggle = () => {
    if (type === "password") {
      setType("text");
    } else {
      setType("password");
    }
  };

  const signup = async () => {
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      inputSchema.parse({ username, password });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        setError(validationError.errors[0].message);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post("https://secondbrain-5u8x.onrender.com/api/v1/signup", {
        username,
        password,
      });
      // alert("You have successfully signed up!");
      toast.success("You have successfully signed up!");
      navigate("/signin");
    } catch (err) {
      const error = err as any;
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const responseData = error.response.data as any;
        
        if (responseData.message) {
          setError(responseData.message);
          toast.warning(responseData.message);
        } else if (error.response.status === 409) {
          setError("Username already exists. Please choose a different username.");
          toast.warning("Username already exists. Please choose a different username.");
        } else {
          setError(`Signup failed (Status: ${error.response.status}). Please try again later.`);
          toast.warning(`Signup failed (Status: ${error.response.status}). Please try again later.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your internet connection.");
        toast.warning("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Signup failed. Please try again later.");
        toast.warning("Signup failed. Please try again later.");
      }
      
      console.error("Signup error details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex pt-24 font-poppins justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} min-h-screen p-8 bg-pattern`}>
      <div className={`relative border-gray-200 border ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-custom-h shadow-md rounded-lg w-full max-w-sm p-6`}>
        {/* Dark mode toggle button in top right corner */}
        <button 
          onClick={toggleDarkMode} 
          className={`absolute top-3 right-3 p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="pt-4 flex justify-center">
          <p className="w-full text-3xl font-bold text-center">
            Sign Up and Sync Your Ideas!
          </p>
        </div>

        <div className="pt-5 flex justify-center">
          <AuthInputcomp reference={usernameRef} placeholder="Username" />
        </div>

        <div className="pt-4 flex justify-center relative">
          <AuthInputcomp
            reference={passwordRef}
            placeholder="Password"
            type={type}
          />
          <button
            onClick={handleToggle}
            className="absolute right-4 top-1/2 transform translate-y-1 sm:translate-x-6 translate-x-9"
          >
            {type === "password" ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && (
          <div className="pt-4 flex justify-center">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <div className="pt-6 flex justify-center">
          <Button
            onClick={signup}
            size="lg"
            variant="primary"
            center={true}
            width="full"
            text={loading ? <Loader /> : "Sign Up"}
            disabled={loading}
          />
        </div>

        <div className="pt-4 flex justify-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-center`}>
            Already a member?{" "}
            <span className={`${isDarkMode ? 'text-blue-400' : 'text-[#414D5D]'} cursor-pointer`}>
              <Link to="/signin">
                <button>Sign In</button>
              </Link>
            </span>
          </p>
        </div>
        <div className="pt-4 flex justify-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} text-center`}>
            Before registering, read and agree with our{" "}
            <span className={`${isDarkMode ? 'text-blue-400' : 'text-[#414D5D]'}`}>
              Terms of Service and Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
