import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth';

const router = Router();
const prisma = new PrismaClient();

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assigneeIds: z.array(z.string()).optional()
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  assigneeIds: z.array(z.string()).optional()
});

// Get all tasks
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { creatorId: req.user!.id },
          {
            assignees: {
              some: {
                userId: req.user!.id
              }
            }
          }
        ]
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Transform the response to match the expected format
    const transformedTasks = tasks.map(task => ({
      ...task,
      assignees: task.assignees.map(assignee => assignee.user)
    }));

    res.json(transformedTasks);
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, assigneeIds = [] } = taskSchema.parse(req.body);
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        creatorId: req.user!.id,
        assignees: {
          create: assigneeIds.map(userId => ({
            user: {
              connect: { id: userId }
            }
          }))
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Transform the response
    const transformedTask = {
      ...task,
      assignees: task.assignees.map(assignee => assignee.user)
    };
    
    res.json(transformedTask);
  } catch (error) {
    console.error('Error in createTask:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update task
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = updateTaskSchema.parse(req.body);
    
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignees: true
      }
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (task.creatorId !== req.user!.id && !task.assignees.some(a => a.userId === req.user!.id)) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    // Handle assignee updates if provided
    const { assigneeIds, ...otherUpdates } = updates;
    const updateData: any = { ...otherUpdates };

    if (assigneeIds) {
      updateData.assignees = {
        deleteMany: {},
        create: assigneeIds.map(userId => ({
          user: {
            connect: { id: userId }
          }
        }))
      };
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Transform the response
    const transformedTask = {
      ...updatedTask,
      assignees: updatedTask.assignees.map(assignee => assignee.user)
    };
    
    res.json(transformedTask);
  } catch (error) {
    console.error('Error in updateTask:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete task
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    if (task.creatorId !== req.user!.id) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    await prisma.task.delete({
      where: { id }
    });
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTask:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (for assigning tasks)
router.get('/users', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 