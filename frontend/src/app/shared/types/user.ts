import { UserAddress } from './user_address';
import { UserType } from './user_type';

export interface User {
  name?: string;
  cpf: string;
  phone?: string;
  email?: string;
  password: string;
  birthdate?: string;
  id?: string;
  type?: UserType;
  address: UserAddress;
}
