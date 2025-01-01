import { createSlice } from "@reduxjs/toolkit";
import { Organization } from "../type";
import { getOrganizationByID, updateOrganization } from "../hook/organization";

interface OrganizationState {
  organizationProfile: Organization;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: OrganizationState = {
  organizationProfile: {
    Name: "",
    Address: "",
    PhoneNumber: "",
    Email: "",
    Username: "",
    PasswordHash: "",
  },
  loading: "idle",
  error: null,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrganizationByID.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getOrganizationByID.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.organizationProfile = action.payload;
      })
      .addCase(getOrganizationByID.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(updateOrganization.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.organizationProfile = action.payload;
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export default organizationSlice.reducer;
export const getOrganizationProfile = (state: {
  organization: OrganizationState;
}) => state.organization.organizationProfile;
