export const passwordRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/i;
export const emailRegExp =
  /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i;
export const phoneRegExp =
  /^\d{10,14}$/i;

const regexFormat = {
  passwordRegExp,
  emailRegExp,
  phoneRegExp,
};

export default regexFormat;
