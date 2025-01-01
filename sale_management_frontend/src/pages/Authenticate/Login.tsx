import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import React from "react";
import logo from "../../assets/Logo.svg";
import { useAppDispatch } from "../../store/store";
import { useNavigate } from "react-router";
import { login } from "../../store/hook/auth";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaLogin } from "./schema";

interface ILoginForm {
  username: string;
  password: string;
}

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorLogin, setErrorLogin] = React.useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schemaLogin),
  });

  const onSubmit: SubmitHandler<ILoginForm> = (data) => {
    const { username, password } = data;
    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
        setErrorLogin("Invalid username or password");
      });
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100 shadow-md">
      <div
        className="bg-white p-6 rounded-lg shadow-lg my-5"
        style={{ width: "430px" }}
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mt-16">Welcome</h1>
          <img src={logo} alt="Logo" className="w-48 mx-auto" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 px-4">
          <Controller
            name="username"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                error={!!errors.username}
                helperText={errors.username?.message}
                id="username"
                label="Username"
                variant="standard"
                className="text-gray-700"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
                id="password"
                label="Password"
                variant="standard"
                className="text-gray-700"
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                InputProps={{
                  endAdornment: (
                    <div
                      className="cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </div>
                  ),
                }}
              />
            )}
          />
          {errorLogin && (
            <p className="text-red-500 text-center">{errorLogin}</p>
          )}
          <Button
            fullWidth
            variant="contained"
            style={{
              background: "#D9DFC6",
              color: "#fff",
              borderRadius: "30px",
              height: "45px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
            type="submit"
          >
            Login
          </Button>
        </form>
        <div>
          <p className="text-center mt-4 text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
