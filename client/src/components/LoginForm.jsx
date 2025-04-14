import "../styles/LoginForm.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Login successful!");

        localStorage.setItem("token", data.token);
        navigate("/customer"); 
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to login.");
    }
  };
  

  return (
    <div className="login-box">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to Your Dashboard</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Your Password"
            required
          />
        </div>

        <div className="check-remember">
          <input className="tick-box" type="checkbox" id="remember" name="remember" />
          <label htmlFor="remember">Remember me</label>
          <button type="button" className="forgot-password">Forgot Password</button>
        </div>

        <div className="login-container">
          <button className="login-button" type="submit">Login</button>
        </div>

        <div className="register-container">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
