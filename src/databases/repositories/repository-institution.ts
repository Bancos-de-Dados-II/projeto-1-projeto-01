import { PrismaClient } from '@prisma/client';
import type { Institution } from '../../domain/entities/Institution.js';
import crypto from 'node:crypto';

// Interface auxiliar para tipar o retorno do banco antes de converter
interface InstitutionRaw extends Omit<Institution, 'latitude' | 'longitude'> {
    latitude: number;
    longitude: number;  
}

class RepositoryInstitution {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    private getSelectQuery() {
        return `
            SELECT 
                id, 
                name, 
                cnpj, 
                email, 
                phone, 
                address, 

                "createdAt", 
                "updatedAt",
                ST_Y(location::geometry) as latitude, 
                ST_X(location::geometry) as longitude 
            FROM "institutions"
        `;
    }

    async findById(id: string): Promise<Institution | null> {
        const result = await this.prisma.$queryRawUnsafe<InstitutionRaw[]>(
            `${this.getSelectQuery()} WHERE id = $1 LIMIT 1`, 
            id
        );
        return result[0] || null;
    }
    
    async findByEmail(email: string): Promise<Institution | null> {
        const result = await this.prisma.$queryRawUnsafe<InstitutionRaw[]>(
            `${this.getSelectQuery()} WHERE email = $1 LIMIT 1`, 
            email
        );
        return result[0] || null;
    }

    async register(institution: Omit<Institution, 'id'>): Promise<Institution> {
        const id = crypto.randomUUID(); 
        
        await this.prisma.$executeRaw`
            INSERT INTO "institutions" (
                id, name, cnpj, email, phone, address, 
                "createdAt", "updatedAt", location
            )
            VALUES (
                ${id}, 
                ${institution.name}, 
                ${institution.cnpj}, 
                ${institution.email}, 
                ${institution.phone}, 
                ${institution.address}, 
                NOW(),
                NOW(),
                ST_SetSRID(ST_MakePoint(${institution.longitude}, ${institution.latitude}), 4326)
            );
        `;

        return { id, ...institution };
    }

    async update(institution: Institution): Promise<Institution> {
        const result = await this.prisma.$queryRaw<InstitutionRaw[]>`
            UPDATE "institutions"
            SET 
                name = ${institution.name},
                cnpj = ${institution.cnpj},
                email = ${institution.email},
                phone = ${institution.phone},
                address = ${institution.address},
                
                "updatedAt" = NOW(), 
                location = ST_SetSRID(ST_MakePoint(${institution.longitude}, ${institution.latitude}), 4326)
            WHERE id = ${institution.id}
            RETURNING 
                id, 
                name, 
                cnpj, 
                email, 
                phone, 
                address, 
                
                "createdAt",
                "updatedAt",
                ST_Y(location::geometry) as latitude, 
                ST_X(location::geometry) as longitude
        `;

        const updatedInstitution = result[0];

        if (!updatedInstitution) {
            throw new Error("Instituição não encontrada para atualização.");
        }

        return updatedInstitution;
    }

    async getAll(): Promise<Institution[]> {
        return await this.prisma.$queryRawUnsafe<InstitutionRaw[]>(
            `${this.getSelectQuery()}`
        );
    }

    async findByName(name: string): Promise<Institution | null> {
        const result = await this.prisma.$queryRawUnsafe<InstitutionRaw[]>(
            `${this.getSelectQuery()} WHERE name = $1`,
            name
        );
        return result[0] || null;
    }

    async findByCnpj(cnpj: string): Promise<Institution | null> {
        const result = await this.prisma.$queryRawUnsafe<InstitutionRaw[]>(
            `${this.getSelectQuery()} WHERE cnpj = $1 LIMIT 1`,
            cnpj
        );
        return result[0] || null;
    } 

    async delete(id: string): Promise<Institution> {
        const result = await this.prisma.$queryRawUnsafe<InstitutionRaw[]>(
            `DELETE FROM "institutions" 
             WHERE id = $1 
             RETURNING 
                id, 
                name, 
                cnpj, 
                email, 
                phone, 
                address, 
                ST_Y(location::geometry) as latitude, 
                ST_X(location::geometry) as longitude`,
            id
        );

        const deletedInstitution = result[0];

        if (!deletedInstitution) {
            throw new Error("Instituição não encontrada para exclusão.");
        }

        return deletedInstitution;
    }
}

export default new RepositoryInstitution();