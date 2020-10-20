import express,{Request,Response, Router} from 'express';
import controller from '../controllers/auth';
import passport from 'passport';

const router:Router = express.Router();

router.post('/test',controller.test);
router.post('/google',controller.google)
router.post('/facebook',controller.facebook)
router.post('/check',controller.check)
export default router;