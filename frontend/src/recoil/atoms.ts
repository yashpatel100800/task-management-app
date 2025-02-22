import { atom } from 'recoil';
import { User, Task } from '../services/api';

export interface Filter {
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeId?: string;
}

export const userState = atom<User | null>({
  key: 'userState',
  default: null,
});

export const tasksState = atom<Task[]>({
  key: 'tasksState',
  default: [],
});

export const filterState = atom<Filter>({
  key: 'filterState',
  default: {},
});

export const availableUsersState = atom<User[]>({
  key: 'availableUsersState',
  default: [],
}); 