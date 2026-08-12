export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  isLoginDisabled: boolean;
  hideFeedbacks: boolean;
  hideComments: boolean;
  createdAt: string;
  updatedAt: string;
}
