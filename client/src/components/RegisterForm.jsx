import "../styles/RegisterForm.css";

function RegisterForm() {
  return (
    <div className="login-box">
      <div className="register-form">
        <h2>Create Your Account</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Your Username"
            required
          />
          <label>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your Email"
            required
          />
          <label>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Your Password"
            required
          />
          <label>Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            placeholder="Confirm Your Password"
            required
          />
        </div>
        <div className="register-container">
          <button className="register-button" type="submit">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
