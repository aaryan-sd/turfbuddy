import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", form);
      alert("Login success! Token: " + res.data.token);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold text-purple-600 mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          onChange={handleChange}
        />
        <button type="submit" className="w-full bg-purple-700 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
