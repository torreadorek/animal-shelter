import express,{Request,Response, Router} from 'express';
import controller from '../controllers/auth';
import passport from 'passport';

const router:Router = express.Router();

router.post('/test',controller.test);
router.post('/google',controller.google)
export default router;