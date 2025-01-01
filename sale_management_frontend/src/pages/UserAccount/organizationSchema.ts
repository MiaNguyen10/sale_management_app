import * as yup from "yup";
import {
  emailRegExp,
  passwordRegExp,
  phoneRegExp,
} from "../../utils/regexFormat";

export const schemaOrganization = yup
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
    oldPassword: yup.string().notRequired(),
    newPassword: yup
      .string()
      .notRequired()
      .matches(
        passwordRegExp,
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      ),
  })
  .required();
