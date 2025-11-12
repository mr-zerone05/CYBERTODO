import express, { Router } from 'express';
import { getAllTasks, createTask, deleteTask, updateTask } from '../Controllers/tasksControllers.js';
const router = express.Router();

export default router;

router.get('/', getAllTasks );

router.post('/', createTask);

router.delete('/:id', deleteTask);

router.put('/:id', updateTask);