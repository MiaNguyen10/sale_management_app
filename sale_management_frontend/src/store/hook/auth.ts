import { createAsyncThunk } from "@reduxjs/toolkit";
import { Organization } from "../type";
import axiosInstance from "../api/axiosInstance";

export const signupOrganization = createAsyncThunk(
  "auth/signupOrganization",
  async (organization: Organization) => {
    try {
      const response = await axiosInstance.post("/auth/register", organization);
      return response.data;
    } catch (error) {
      console.error("Failed to signup organization:", error);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: { username: string; password: string }) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Failed to login:", error);
    }
  }
);
