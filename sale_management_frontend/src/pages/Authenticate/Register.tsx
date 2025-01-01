import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import logo from "../../assets/Logo.png";
import { signupOrganization } from "../../store/hook/auth";
import { useAppDispatch } from "../../store/store";
import { Organization } from "../../store/type";
import { schemaRegister } from "./schema";

interface IRegisterForm {
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  username: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schemaRegister),
  });

  const onSubmit: SubmitHandler<IRegisterForm> = async (data) => {
    const organization: Organization = {
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
      email: data.email,
      username: data.username,
      password: data.password,
    };
    try {
      const result = await dispatch(signupOrganization(organization));
      if (signupOrganization.fulfilled.match(result)) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="flex items-center justify-center bg-pastelGreen">
        <img src={logo} alt="logo" />
      </div>
      <div className="flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-center mt-10 text-darkGreen">
          Register
        </h2>

        {/* REGISTER FORM */}
        <div className="m-10">
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
              name="password"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="relative">
                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="standard"
                    value={value}
                    onChange={onChange}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3 cursor-pointer"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </span>
                </div>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { value, onChange } }) => (
                <div className="relative">
                  <TextField
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    variant="standard"
                    value={value}
                    onChange={onChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                  <span
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-3 cursor-pointer"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
              Register
            </Button>
          </form>
        </div>

        <div>
          <p className="text-center mt-4 text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
