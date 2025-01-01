import { JwtPayload, jwtDecode } from "jwt-decode";

export interface DecodedToken extends JwtPayload {
  organization_id?: string;
  name?: string;
  username?: string;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
