export enum ExamType {
  'Imaging',
  'Clinical',
  'Dental',
  'Physical',
}

export interface Exam {
  id: string;
  type: ExamType;
  title: string;
  description: string;
  date: string;
}
