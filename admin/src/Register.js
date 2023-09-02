import React, { useState } from "react";
import { firestore } from "../firebase/firebase";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database"; // Import Firestore or Realtime Database if you want to store additional user data

import MyImage from "./pages/logo.png";

export const Register = (props) => {
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [name, setName] = useState("");
  const [registrationError, setRegistrationError] = useState(null); // State to handle registration errors

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(username, password);

      // User registered successfully
      const user = userCredential.user;

      // Now, you can save additional user data to Firestore or Realtime Database
      await firebase
        .database()
        .ref("users")
        .child(user.uid)
        .set({
          name: name,
          // Add any other user data fields you want to store
        });

      console.log("User registered:", user);

      // Optionally, send a verification email if desired
      // await user.sendEmailVerification();

      // Reset form and clear any previous errors
      setUser("");
      setPass("");
      setName("");
      setRegistrationError(null);

      // You can also perform additional actions here, such as redirecting the user to a different page
    } catch (error) {
      // Handle registration errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Registration error:", errorMessage);
      setRegistrationError(errorMessage);
    }
  };

  return (
    <div className="form-container">
      <div className="box">
        <img className="login-logo" src={MyImage} alt="Logo" />
        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Fullname</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            id="name"
            placeholder="Full Name"
            name="name"
            required
          />
          <label htmlFor="username">Username</label>
          <input
            value={username}
            onChange={(e) => setUser(e.target.value)}
            type="email" // Assuming the username is an email address
            placeholder="Username (Email)"
            id="username"
            name="username"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            value={password}
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="*******"
            id="password"
            name="password"
            required
          />
          <button type="submit">Register</button>
        </form>
        {registrationError && (
          <p className="error-message">{registrationError}</p>
        )}
        <button
          className="link-button"
          onClick={() => props.onFormSwitch("login")}
        >
          Already have an account? Login Here!
        </button>
      </div>
    </div>
  );
};