export interface IUser {
  id: string;
  email: string;
  name: string;
  password: string;
  avatar?: string;
  avatarName?: string;
  bio: string;
  phone: string;
  favourite: Array<string>;
}
