import type {Request, Response} from 'express';
import type Institution from '../entities/institution.ts';

export class RegisterInstitutionController {
    handle(req: Request, res: Response): Response {
        //validação de formatação dos dados
        const {name, cnpj, email, telephone, address, lattitude, longitude} = req.body as Institution;

        return res.send('Register a new institution');
    }
}
