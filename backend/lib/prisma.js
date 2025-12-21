import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Don't initialize immediately, wait for first use
let prisma;

function getPrisma() {
    if (!prisma) {
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            throw new Error('DATABASE_URL is not set');
        }

        const pool = new Pool({
            connectionString,
            ssl: {
                rejectUnauthorized: false
            }
        });

        const adapter = new PrismaPg(pool);
        prisma = new PrismaClient({ adapter });
    }
    return prisma;
}

export { getPrisma };