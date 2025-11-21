import type {Request, Response} from 'express';
import type Institution from '../domain/entities/Institution.js';

export class RegisterInstitutionController {
    handle(req: Request, res: Response): Response {
        //validação de formatação dos dados
        const {name, cnpj, email, phone, address, latitude, longitude} = req.body as Institution;

        return res.send('Register a new institution');
    }
}
