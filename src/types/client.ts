
export interface ClientTaskProgress {
  clientName: string;
  email: string;
  completed: number;
  total: number;
  percentage: number;
  lastActive: string;
  intakeForm: boolean;
  designPicker: boolean;
  templates: boolean;
}
