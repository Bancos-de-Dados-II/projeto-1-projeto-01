import { InstitutionModel, type IInstitutionDocument} from '../../models/institution-model.js'; 
import type { Institution } from '../../domain/entities/Institution.js';

class RepositoryInstitution {

    private toDomain(doc: IInstitutionDocument): Institution {
        if (!doc) return null as any;

        return {
            id: doc._id.toString(),
            name: doc.name,
            cnpj: doc.cnpj,
            email: doc.email,
            phone: doc.phone,
            address: doc.address,
            active: doc.active,

            longitude: doc.location.coordinates[0], 
            latitude: doc.location.coordinates[1],
        };
    }

    
    async findById(id: string): Promise<Institution | null> {
        try {
            const doc = await InstitutionModel.findById(id);
            return doc ? this.toDomain(doc) : null;
        } catch (error) {
            return null;
        }
    }
    
    async findByEmail(email: string): Promise<Institution | null> {
        const doc = await InstitutionModel.findOne({ email });
        return doc ? this.toDomain(doc) : null;
    }

    async register(institution: Omit<Institution, 'id'>): Promise<Institution> {
        const doc = await InstitutionModel.create({
            ...institution,
            location: { 
                type: 'Point', 
                coordinates: [institution.longitude, institution.latitude] 
            }
        });

        return this.toDomain(doc);
    }

    async update(institution: Institution): Promise<Institution> {
        const doc = await InstitutionModel.findByIdAndUpdate(
            institution.id,
            {
                name: institution.name,
                cnpj: institution.cnpj,
                email: institution.email,
                phone: institution.phone,
                address: institution.address,
                location: { 
                    type: 'Point', 
                    coordinates: [institution.longitude, institution.latitude] 
                }
            },
            { new: true } 
        );

        if (!doc) {
            throw new Error("Instituição não encontrada para atualização.");
        }

        return this.toDomain(doc);
    }

    async getAll(): Promise<Institution[]> {
        const docs = await InstitutionModel.find();
        return docs.map(doc => this.toDomain(doc));
    }

    async findByName(name: string): Promise<Institution | null> {
        const doc = await InstitutionModel.findOne({ 
            name: { $regex: new RegExp(name, "i") } 
        });
        return doc ? this.toDomain(doc) : null;
    }

    async findByCnpj(cnpj: string): Promise<Institution | null> {
        const doc = await InstitutionModel.findOne({ cnpj });
        return doc ? this.toDomain(doc) : null;
    } 

    async delete(id: string): Promise<Institution> {
        const doc = await InstitutionModel.findByIdAndDelete(id);

        if (!doc) {
            throw new Error("Instituição não encontrada para exclusão.");
        }

        return this.toDomain(doc);
    }
}

export default new RepositoryInstitution();