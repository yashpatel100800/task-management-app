import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tasksAPI } from '../../services/api';
import type { Task, User, CreateTaskData, UpdateTaskData } from '../../services/api';

interface TaskState {
  tasks: Task[];
  availableUsers: User[];
  filter: {
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    assigneeId?: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  availableUsers: [],
  filter: {},
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await tasksAPI.getTasks();
  return response;
});

export const fetchUsers = createAsyncThunk('tasks/fetchUsers', async () => {
  const response = await tasksAPI.getUsers();
  return response;
});

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data: CreateTaskData) => {
    const response = await tasksAPI.createTask(data);
    return response;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }: { id: string; data: UpdateTaskData }) => {
    const response = await tasksAPI.updateTask(id, data);
    return response;
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string) => {
    await tasksAPI.deleteTask(id);
    return id;
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TaskState['filter']>) => {
      state.filter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Fetch Users
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.availableUsers = action.payload;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export const { setFilter, clearError } = taskSlice.actions;
export default taskSlice.reducer; 