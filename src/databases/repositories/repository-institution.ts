import { PrismaClient } from '@prisma/client';
import type { Institution } from '../../domain/entities/Institution.js';

class RepositoryInstitution {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    // Método para buscar pelo ID
    async findById(id: string): Promise<Institution | null> {
        return await this.prisma.institution.findUnique({
            where: { id },
        });
    }
    
    // Método para buscar pelo Email 
    async findByEmail(email: string): Promise<Institution | null> {
        return await this.prisma.institution.findFirst({
            where: { email },
        });
    }

    // Método para registrar e retornar a Institution completa
    async register(institution: Omit<Institution, 'id'>): Promise<Institution> {
        
        return await this.prisma.institution.create({
            data: {
                name: institution.name,
                cnpj: institution.cnpj,
                email: institution.email,
                phone: institution.phone,
                address: institution.address,
                active: institution.active,
                latitude: institution.latitude,
                longitude: institution.longitude,
            },
        });
    }

    // Método para exclusão lógica 
    async delete(id: string): Promise<Institution> {
        return await this.prisma.institution.update({
            where: { id },
            data: { active: false }, // Marcando como inativo
        });
    }

    async getAll(): Promise<Institution[]> {
       
        return await this.prisma.institution.findMany({
             where: { active: true } // buscando apenas ativos
        });
    }

    async findByName(name: string): Promise<Institution | null> {
        return await this.prisma.institution.findFirst({ 
            where: { name, active: true }, // Filtrando por ativo
        });
    }

    async findByCnpj(cnpj: string): Promise<Institution | null> {
        return await this.prisma.institution.findFirst({
            where: { cnpj, active: true }, // Filtrando por ativo
        });
    }   
}

export default new RepositoryInstitution();

