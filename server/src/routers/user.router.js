import { Router } from 'express';
import { saveUserDetails,getUsers,getUsersByRole } from '../controllers/user.controller'

const userRouter = Router();

userRouter.route('/save-details').post(saveUserDetails);
userRouter.route('/get-all').get(getUsers);
userRouter.route('/get-by-role').get(getUsersByRole);


export default userRouter;