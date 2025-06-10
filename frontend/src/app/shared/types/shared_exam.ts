import { Exam } from './exam';

export interface SharedExam {
  id?: string;
  sharingDate: string;
  personal: SharedExamPersonal;
  exam: Exam;
}

interface SharedExamPersonal {
  name: string;
  email: string;
  cpf: string;
}
