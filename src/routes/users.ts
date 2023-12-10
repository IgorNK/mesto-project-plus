import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.patch('/users/me', updateUser);
router.get('/users/:id', getUserById);
router.patch('/users/me/avatar', updateAvatar);

export default router;
