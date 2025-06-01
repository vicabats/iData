export enum ExamType {
  Imaging = 'IMAGING',
  Clinical = 'CLINICAL',
  Dental = 'DENTAL',
  Physical = 'PHYSICAL',
  Other = 'OTHER',
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
  fileContent?: string;
}

export function getExamTypeName(type: ExamType): string {
  return ExamTypeNames[type] ?? type;
}
