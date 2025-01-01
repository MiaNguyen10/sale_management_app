import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout";
import {
  getOrganizationByID,
  updateOrganization,
} from "../../store/hook/organization";
import { getOrganizationProfile } from "../../store/slices/organizationSlice";
import { useAppDispatch } from "../../store/store";
import { UpdatedOrganization } from "../../store/type";
import { decodeToken } from "../../utils/jwtUtils";
import { schemaOrganization } from "./organizationSchema";

interface IProfileForm {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  username: string;
  oldPassword?: string | null;
  newPassword?: string | null;
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const token = sessionStorage.getItem("token");
  const organization_id = decodeToken(token!)?.organization_id;
  const organization = useSelector(getOrganizationProfile);

  const togglePasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
      username: "",
      oldPassword: "",
      newPassword: "",
    },
    resolver: yupResolver(schemaOrganization),
  });

  useEffect(() => {
    if (organization_id) {
      dispatch(getOrganizationByID({ organization_id }));
    }
  }, [dispatch, organization_id]);

  useEffect(() => {
    if (organization) {
      reset({
        name: organization.Name,
        address: organization.Address,
        phoneNumber: organization.PhoneNumber,
        email: organization.Email,
        username: organization.Username,
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [organization, reset]);

  const onSubmit: SubmitHandler<IProfileForm> = async (data) => {
    setError(null);
    const organization: UpdatedOrganization = {
      organization_id: organization_id!,
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      username: data.username,
      oldPassword: data.oldPassword || null,
      newPassword: data.newPassword || null,
    };
    try {
      const response = await dispatch(updateOrganization(organization));

      // Check if the action was rejected
      if (response.meta.requestStatus === "rejected") {
        setError(response.payload as string);
        return;
      }

      // Check if the action was fulfilled
      if (response.payload) {
        reset({
          name: response.payload.data.Name,
          address: response.payload.data.Address,
          phoneNumber: response.payload.data.PhoneNumber,
          email: response.payload.data.Email,
          username: response.payload.data.Username,
          oldPassword: "",
          newPassword: "",
        });
        setSuccess(response.payload.message);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError("Failed to update profile");
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center my-16 h-full">
        <h1 className="text-4xl font-bold">Profile</h1>
        <div className="m-10">
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 px-4">
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label="Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={value}
                  onChange={onChange}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label="Address"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={value}
                  onChange={onChange}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label="Phone Number"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={value}
                  onChange={onChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  variant="standard"
                  value={value}
                  onChange={onChange}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="username"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  label="Username"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={value}
                  onChange={onChange}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />
              )}
            />
            <Controller
              name="oldPassword"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="relative">
                  <TextField
                    label="Old Password"
                    type={showOldPassword ? "text" : "password"}
                    fullWidth
                    variant="standard"
                    value={value}
                    onChange={onChange}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword?.message}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 cursor-pointer"
                  >
                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                </div>
              )}
            />
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="relative">
                  <TextField
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    fullWidth
                    variant="standard"
                    value={value}
                    onChange={onChange}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3 cursor-pointer"
                  >
                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                </div>
              )}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              style={{
                background: "#D9DFC6",
                color: "#fff",
                borderRadius: "30px",
                height: "45px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Save update
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
