import { User } from './user';
import { UserAddress } from './user_address';

export interface ProfessionalFacility {
  name: string;
  address: UserAddress;
}

export interface ProfessionalUser extends User {
  facility: ProfessionalFacility;
  professionalLicense: String;
}
