// src/lib/prisma.js

const { PrismaClient } = require('@prisma/client');
const { PrismaPg }     = require('@prisma/adapter-pg');
const { Pool }         = require('pg');

// ─────────────────────────────────────────
// SSL :
// - En local (dev)  → on ignore le certificat
// - En production   → SSL strict activé
// ─────────────────────────────────────────
const estEnProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: estEnProduction
    ? { rejectUnauthorized: true }   // prod → SSL strict
    : { rejectUnauthorized: false }, // dev  → SSL souple
});

const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter });

module.exports = prisma;