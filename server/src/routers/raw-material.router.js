import { Router } from 'express';
import { saveRawMaterialDetails,getRMByStatus,getRMAll,getRMById,changeStatus,changeManif } from '../controllers/raw-material.controller'

const rawMaterialRouter = Router();

rawMaterialRouter.route('/save-details').post(saveRawMaterialDetails);
rawMaterialRouter.route('/get-by-status/:status').get(getRMByStatus);
rawMaterialRouter.route('/get-by-status/').get(getRMAll);
rawMaterialRouter.route('/get-by-id/:id').get(getRMById);
rawMaterialRouter.route('/change-status').post(changeStatus);
rawMaterialRouter.route('/change-manif').post(changeManif);



export default rawMaterialRouter;