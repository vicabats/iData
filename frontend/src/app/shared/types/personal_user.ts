import { HealthInsurance } from './health_insurance';
import { User } from './user';
import { UserAddress } from './user_address';

export interface PersonalUser extends User {
  birthDate: string;
  address: UserAddress;
  health_insurance?: HealthInsurance;
}
