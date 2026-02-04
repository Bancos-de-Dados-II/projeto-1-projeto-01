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

    // --- 1. BUSCAR POR ID ---
    async findById(id: string): Promise<Institution | null> {
        // Mongoose valida se o ID é um ObjectId válido. Se não for, ele estoura erro.
        // É bom tratar, ou deixar estourar dependendo da sua estratégia.
        try {
            const doc = await InstitutionModel.findById(id);
            return doc ? this.toDomain(doc) : null;
        } catch (error) {
            return null; // Retorna null se o ID for inválido (formato errado)
        }
    }
    
    // --- 2. BUSCAR POR EMAIL ---
    async findByEmail(email: string): Promise<Institution | null> {
        const doc = await InstitutionModel.findOne({ email });
        return doc ? this.toDomain(doc) : null;
    }

    // --- 3. REGISTRAR (CRIAR) ---
    async register(institution: Omit<Institution, 'id'>): Promise<Institution> {
        // Não precisa gerar UUID com crypto. O Mongo gera o _id sozinho.
        
        const doc = await InstitutionModel.create({
            ...institution,
            // Montamos o objeto GeoJSON exigido pelo Mongo
            location: { 
                type: 'Point', 
                coordinates: [institution.longitude, institution.latitude] // ATENÇÃO: Longitude primeiro!
            }
        });

        return this.toDomain(doc);
    }

    // --- 4. ATUALIZAR ---
    async update(institution: Institution): Promise<Institution> {
        const doc = await InstitutionModel.findByIdAndUpdate(
            institution.id,
            {
                name: institution.name,
                cnpj: institution.cnpj,
                email: institution.email,
                phone: institution.phone,
                address: institution.address,
                // Atualiza a localização também
                location: { 
                    type: 'Point', 
                    coordinates: [institution.longitude, institution.latitude] 
                }
            },
            { new: true } // Importante: Retorna o objeto ATUALIZADO, não o antigo
        );

        if (!doc) {
            throw new Error("Instituição não encontrada para atualização.");
        }

        return this.toDomain(doc);
    }

    // --- 5. LISTAR TODOS ---
    async getAll(): Promise<Institution[]> {
        const docs = await InstitutionModel.find();
        return docs.map(doc => this.toDomain(doc));
    }

    // --- 6. BUSCAR POR NOME ---
    async findByName(name: string): Promise<Institution | null> {
        // O regex torna a busca case-insensitive (opcional, mas útil)
        const doc = await InstitutionModel.findOne({ 
            name: { $regex: new RegExp(name, "i") } 
        });
        return doc ? this.toDomain(doc) : null;
    }

    // --- 7. BUSCAR POR CNPJ ---
    async findByCnpj(cnpj: string): Promise<Institution | null> {
        const doc = await InstitutionModel.findOne({ cnpj });
        return doc ? this.toDomain(doc) : null;
    } 

    // --- 8. DELETAR ---
    async delete(id: string): Promise<Institution> {
        const doc = await InstitutionModel.findByIdAndDelete(id);

        if (!doc) {
            throw new Error("Instituição não encontrada para exclusão.");
        }

        return this.toDomain(doc);
    }
}

export default new RepositoryInstitution();