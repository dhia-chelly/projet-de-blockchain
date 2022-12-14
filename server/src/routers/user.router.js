import { Router } from 'express';
import { saveUserDetails,getUsers,getUsersByRole,getUsersByAdr } from '../controllers/user.controller'

const userRouter = Router();

userRouter.route('/save-details').post(saveUserDetails);
userRouter.route('/get-all').get(getUsers);
userRouter.route('/get-by-role/:role').get(getUsersByRole);
userRouter.route('/get-by-adr/').post(getUsersByAdr);


export default userRouter;