import { User } from './user';

export interface ProfessionalUser extends User {
  professionalLicense: String;
}
