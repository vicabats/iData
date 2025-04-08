import { User } from './user';
import { UserAddress } from './user_address';

export interface ProfessionalUser extends User {
  facility: UserAddress;
  professionalLicense: String;
}
