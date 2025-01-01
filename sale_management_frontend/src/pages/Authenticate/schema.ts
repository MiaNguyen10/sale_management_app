import * as yup from "yup";
import { emailRegExp, passwordRegExp, phoneRegExp } from "../../utils/regexFormat";

export const schemaRegister = yup
  .object({
    name: yup.string().required("Name is required"),
    address: yup.string().required("Address is required"),
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    email: yup
      .string()
      .email()
      .required("Email is required")
      .matches(emailRegExp, "Email is not valid"),
    username: yup.string().required(),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        passwordRegExp,
        "Password must contain at least 6 characters, one uppercase, one lowercase, one number and one special case character"
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Confirm password must match password"),
  })
  .required();

export const schemaLogin = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
})