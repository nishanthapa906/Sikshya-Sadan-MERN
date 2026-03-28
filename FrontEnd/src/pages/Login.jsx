import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Call login from context
    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back! 👋");

      // Go to correct dashboard based on role
      if (result.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (result.user.role === "instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } else {
      toast.error(result.message || "Login failed!");
      setIsLoading(false);
    }
  };

  return (
    <main className="mt-20 mb-20 m-auto w-[65%] min-w-[300px] flex justify-center bg-white shadow-lg shadow-gray-300 rounded-lg p-10">
      <div className="w-full space-y-5">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Sikshya Sadan Login</h1>
          <p className="text-xl text-gray-500 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">

          <div className="flex flex-col gap-y-2 text-xl">
            <label className="font-semibold">Email Address</label>
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-3 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-y-2 text-xl">
            <label className="font-semibold">Password</label>
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 p-4 text-white text-xl font-bold w-full rounded-md mt-5"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center text-lg mt-8">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Register Here
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}

export default Login;