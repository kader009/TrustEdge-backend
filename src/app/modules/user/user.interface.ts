export type TUserRole = 'user' | 'admin';
export type TUserStatus = 'active' | 'inactive' | 'banned';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  role: TUserRole;
  status?: TUserStatus;
  isDeleted?: boolean;
  createdAt?: Date;
}

export interface IUpdatePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}
