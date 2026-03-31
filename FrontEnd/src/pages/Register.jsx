import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    let result;
    if (avatar) {
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("phone", phone);
      data.append("password", password);
      data.append("role", "student");
      data.append("avatar", avatar);
      result = await register(data);
    } else {
      // For no-avatar signup, send JSON payload for simpler backend parsing.
      result = await register({ name, email, phone, password, role: "student" });
    }

    if (result.success) {
      toast.success("Account created! Welcome 🎉");
      navigate("/student/dashboard");
    } else {
      toast.error(result.message || "Registration failed!");
      setIsLoading(false);
    }
  };

  return (
    <main className="mt-20 mb-20 m-auto w-[65%] min-w-[300px] flex justify-center bg-white shadow-lg shadow-gray-300 rounded-lg p-10">
      <div className="w-full space-y-5">

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold">Sikshya Sadan Register</h1>
          <p className="text-xl text-gray-500 mt-2">Create an account to get started.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">

          <div className="flex flex-col gap-y-2 text-xl">
            <label className="font-semibold">Full Name</label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-y-2 text-xl">
            <label className="font-semibold">Phone Number</label>
            <input
              type="text"
              required
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-3 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-y-2 text-xl">
            <label className="font-semibold">Profile Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              className="border p-3 rounded-md outline-none focus:border-blue-500"
            />
          </div>

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
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-3 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-y-2 text-xl">
            <label className="font-semibold">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-3 rounded-md outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 p-4 text-white text-xl font-bold w-full rounded-md mt-5"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login link */}
        <div className="text-center text-lg mt-8">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Login Here
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}

export default Register;