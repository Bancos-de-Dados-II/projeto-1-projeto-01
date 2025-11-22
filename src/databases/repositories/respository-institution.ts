
import { PrismaClient } from '@prisma/client';
import type Institution from '../../domain/entities/Institution.ts';

class RepositoryInstitution {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async register(institution: Omit<Institution, 'id'>) {
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

    async getAll(): Promise<Institution[]> {
        return await this.prisma.institution.findMany();
    }

    async findByName(name: string): Promise<Institution | null> {
        return await this.prisma.institution.findFirst({    
            where: { name },
        });
    }

    async findByCnpj(cnpj: string): Promise<Institution | null> {
        return await this.prisma.institution.findFirst({
            where: { cnpj },
        });
    }   
}

export default new RepositoryInstitution();

