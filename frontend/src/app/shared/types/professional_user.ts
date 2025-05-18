import { User } from './user';
import { UserAddress } from './user_address';

export interface ProfessionalUser extends User {
  address: UserAddress;
  professionalLicense: String;
}
