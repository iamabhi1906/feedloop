export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isLoginDisabled: boolean;
  hideFeedbacks: boolean;
  hideComments: boolean;
  createdAt: string;
  updatedAt: string;
}
