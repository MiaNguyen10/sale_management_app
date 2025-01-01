import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { UpdatedOrganization } from "../type";

export const getOrganizationByID = createAsyncThunk(
    "organization/getOrganizationByID",
    async ({ organization_id }: { organization_id: string }) => {
        try {
            const response = await axiosInstance.get(`/organizations/${organization_id}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch organization by ID:", error);
        }
    }
)

export const updateOrganization = createAsyncThunk(
    "organization/updateOrganization",
    async (organization: UpdatedOrganization, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/organizations/${organization.organization_id}`, organization);
            return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // Use rejectWithValue to properly pass the error message
            return rejectWithValue(error.response?.data?.message || 'An error occurred while updating the organization');
        }
    }
);