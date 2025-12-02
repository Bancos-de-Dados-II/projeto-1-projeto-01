import express from 'express';
import registerInstitutionController from '../controllers/register-institution-controller.js';
import getAllInstitutionsController from '../controllers/getAll-institutions-controller.js';
import deleteInstitutionController from '../controllers/delete-institution-controller.js'; 

const intitutionRoutes = express.Router();

intitutionRoutes.get('/', getAllInstitutionsController.handle);
intitutionRoutes.post('/', registerInstitutionController.handle);
intitutionRoutes.delete('/:id', deleteInstitutionController.handle); 

export default intitutionRoutes;