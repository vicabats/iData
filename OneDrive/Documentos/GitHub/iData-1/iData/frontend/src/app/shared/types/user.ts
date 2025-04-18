import { UserType } from './user_type';

export interface User {
  name?: string;
  cpf: string;
  phone?: string;
  email?: string;
  password: string;
  birthdate?: string;
  id?: string;
  created_at?: string;
  type?: UserType;
}
