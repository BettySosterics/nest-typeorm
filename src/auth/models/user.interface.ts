import { Role } from './role.enum';

export interface User {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  imagePath?: string;
  role?: Role;
}
