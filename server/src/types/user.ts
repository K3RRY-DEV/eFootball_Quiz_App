

export interface IUser {
  username: string;
  email: string;
  password: string;
  role?: "user" | "admin"; // optional because default is "user"
  createdAt?: Date;        // optional, will be auto-generated
}