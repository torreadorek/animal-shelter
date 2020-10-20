import express, { Router } from 'express';
import controller from '../controllers/animals'

const router:Router = express.Router();

router.post('/new',controller.new)
router.post('/category',controller.category)

export default router;