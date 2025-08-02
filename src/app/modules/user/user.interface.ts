export interface IUser extends Document {
  name: string;
  phone: string;
  password: string;
  role: "user" | "agent" | "admin";
  isAgentApproved?: boolean;
  isActive?: boolean;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}