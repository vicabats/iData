import { HealthInsurance } from './health_insurance';
import { User } from './user';

export interface PersonalUser extends User {
  health_insurance?: HealthInsurance;
}
