export enum ExamType {
  Imaging = 'Imaging',
  Clinical = 'Clinical',
  Dental = 'Dental',
  Physical = 'Physical',
  Other = 'Other',
}

export const ExamTypeNames: Record<ExamType, string> = {
  [ExamType.Imaging]: 'Imagem',
  [ExamType.Clinical]: 'Clínico',
  [ExamType.Dental]: 'Odontológico',
  [ExamType.Physical]: 'Físico',
  [ExamType.Other]: 'Outro',
};

export interface Exam {
  id?: string;
  type: ExamType;
  title: string;
  description: string;
  date: string;
  file: File;
}
