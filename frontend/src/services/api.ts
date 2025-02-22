import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true
});

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  createdBy: User;
  assignees: User[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData extends LoginData {
  name: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  assigneeIds?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeIds?: string[];
}

export const authAPI = {
  login: async (data: LoginData) => {
    const response = await api.post<{ user: User }>('/auth/login', data);
    return response.data;
  },
  signup: async (data: SignupData) => {
    const response = await api.post<{ user: User }>('/auth/signup', data);
    return response.data;
  },
  logout: () => api.post('/auth/logout'),
  me: async () => {
    const response = await api.get<{ user: User }>('/auth/me');
    return response.data;
  },
};

export const tasksAPI = {
  getTasks: async () => {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get<User[]>('/tasks/users');
    return response.data;
  },
  createTask: async (data: CreateTaskData) => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },
  updateTask: async (id: string, data: UpdateTaskData) => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },
  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
}; 