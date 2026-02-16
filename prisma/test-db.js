require('dotenv/config');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const dbUrl = 'file:' + path.resolve(__dirname, '..', 'dev.db');
console.log('Using DB URL:', dbUrl);

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
});

async function main() {
    try {
        await prisma.$connect();
        console.log('Connected!');
        const count = await prisma.card.count();
        console.log('Current card count:', count);
    } catch (e) {
        console.log('Error name:', e.constructor.name);
        console.log('Error message:', e.message);
        if (e.errorCode) console.log('Error code:', e.errorCode);
    } finally {
        await prisma.$disconnect();
    }
}

main();
