import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", mobile: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      localStorage.setItem("phone", formData.mobile);
      navigate("/verify");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-purple-100">
      <form className="bg-white p-8 rounded shadow-md space-y-4 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold text-purple-700">Signup</h2>
        {["name", "email", "mobile", "password"].map(field => (
          <input
            key={field}
            name={field}
            type={field === "password" ? "password" : "text"}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit" className="w-full bg-purple-700 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
