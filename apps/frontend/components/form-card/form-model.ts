export interface FormModel {
  title: string;
  description: string;
  onSubmit: (values: any) => void | Promise<void>;
  defaultValues: any;
  inputs: InputModel[];
}

export interface InputModel {
  name: string;
}
