export interface Organization {
  Name: string;
  Address: string;
  PhoneNumber: string;
  Email: string;
  Username: string;
  PasswordHash: string;
}

export interface UpdatedOrganization {
  organization_id: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  username: string;
  oldPassword: string | null;
  newPassword: string | null;
}

export interface ProductWithDiscount {
  ProductID: number;
  OrganizationID: number;
  ProductName: string;
  ProductDescription: string;
  OriginalPrice: number;
  StockQuantity: number;
  CategoryName: string;
  DiscountID: number;
  DiscountName: string;
  DiscountDescription: string;
  DiscountValue: number;
  DiscountType: number;
  DiscountedPrice: number;
}

export interface Product {
  ProductID: number;
  Name: string;
  Description: string;
  Price: number;
  StockQuantity: number;
}
