import { useState } from "react";
import { UserAuth } from "../../config/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = UserAuth();

  //sign in a registered user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      navigate("/myrecs");
    } catch (e) {
      setError(e.message);
      document.getElementById("err-message").innerText =
        "Incorrect Email and/or password";
      console.log(e.message);
    }
  };

  return (
    <main id="main" className="reg-form">
      {/*sign-in form*/}
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>

          <span id="err-message"></span>

          <div className="form-group">
            <label for="email">Email Address</label>
            <br />
            <input
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div className="form-group">
            <label for="password">Password</label>
            <br />
            <input
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          <button>Sign In</button>

          <p>
            Don't have an account yet? <Link to="/signup">Sign up.</Link>{" "}
          </p>
        </form>
    </main>
  );
};

export default SignIn;
