import { PrismaClient } from '@prisma/client';
/**
 * PrismaClient: This is the main class provided by Prisma to interact with your database. 
 * By creating an instance of it (prisma), you can perform various operations like querying, 
 * inserting, updating, and deleting data in a type-safe manner. 
 * Exporting prisma: By exporting the prisma instance, it can be imported and used in other parts of your
 * Next.js application to interact with the database.
 */

const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
