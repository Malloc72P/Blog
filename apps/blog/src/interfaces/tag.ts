import { Dayjs } from 'dayjs';

export interface Tag {
  id: string;
  name: string;
  createdAt: Dayjs;
}
