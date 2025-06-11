import { ExamType } from '../types/exam';

export function getExamTypeChipColor(type: ExamType): string {
  switch (type) {
    case ExamType.Imaging:
      return '#e3f2fd';
    case ExamType.Clinical:
      return '#e8f5e9';
    case ExamType.Dental:
      return '#fff3e0';
    case ExamType.Physical:
      return '#f3e5f5';
    default:
      return '#ececec';
  }
}
