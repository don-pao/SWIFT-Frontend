import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f3f4f6; /* Light gray background for contrast */
  color: #333; /* Darker text for better readability */
  font-family: Arial, sans-serif;
`;

const Card = styled.div`
  background-color: #ffffff; /* White card for high contrast */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 32px;
  width: 400px;
`;

const Title = styled.h1`
  margin-bottom: 24px;
  text-align: center;
  color: #432874; /* Purple for a branded, clear heading */
`;

const ErrorMessage = styled.p`
  color: #e63946; /* Bright red for errors */
  margin-bottom: 16px;
  font-weight: bold;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ddd; /* Light gray border for subtle styling */
  border-radius: 4px;
  font-size: 16px;
  background-color: #f9f9f9; /* Light background for input fields */
  color: #333;
  &:focus {
    border-color: #6200ee; /* Highlight border on focus */
    outline: none;
    background-color: #ffffff; /* Brighten field on focus */
  }
`;

const Button = styled.button`
  background-color: #432874; /* Purple for primary actions */
  color: #ffffff;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #7225f7; /* Slightly darker on hover */
  }
`;

const ToggleButton = styled.button`
  background-color: transparent;
  color: #6200ee; /* Purple for toggle link */
  border: none;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const AdminLoginAndRegister = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    adminUsername: "",
    adminPassword: "",
    adminEmail: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await axios.post("http://localhost:8080/api/admin/register", formData);
        setIsRegistering(false);
        setFormData({ adminUsername: "", adminPassword: "", adminEmail: "" });
      } else {
        const response = await axios.post(
          "http://localhost:8080/api/admin/login",
          null,
          {
            params: {
              username: formData.adminUsername,
              password: formData.adminPassword,
            },
          }
        );

        if (response.status === 200) {
          localStorage.setItem("adminToken", "dummy-token");
          window.location.href = "/admin/dashboard";
        } else {
          setError("Unexpected error occurred during login.");
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <Container>
      <Card>
        <Title>{isRegistering ? "Swift Admin Registration" : "Swift Admin Login"}</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="adminUsername"
            value={formData.adminUsername}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <Input
            type="password"
            name="adminPassword"
            value={formData.adminPassword}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {isRegistering && (
            <Input
              type="email"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          )}
          <Button type="submit">
            {isRegistering ? "Register" : "Login"}
          </Button>
        </Form>
        <p>
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <ToggleButton onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Login" : "Register"}
          </ToggleButton>
        </p>
      </Card>
    </Container>
  );
};

export default AdminLoginAndRegister;
