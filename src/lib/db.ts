import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'cards.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
    if (!db) {
        const options: Database.Options = {
            readonly: process.env.NODE_ENV === 'production',
            fileMustExist: true,
        };
        db = new Database(DB_PATH, options);

        if (!options.readonly) {
            db.pragma('journal_mode = WAL');
            initializeDb(db);
        }
    }
    return db;
}

function initializeDb(db: Database.Database) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      issuer TEXT NOT NULL,
      card_type TEXT NOT NULL,
      network TEXT NOT NULL,
      annual_fee REAL DEFAULT 0,
      joining_fee REAL DEFAULT 0,
      interest_rate REAL,
      cashback_rate REAL,
      rewards_rate REAL,
      rewards_type TEXT,
      welcome_bonus TEXT,
      features TEXT DEFAULT '[]',
      benefits TEXT DEFAULT '[]',
      eligibility TEXT DEFAULT '{}',
      fees TEXT DEFAULT '{}',
      image_url TEXT,
      card_color TEXT DEFAULT '#1a1a2e',
      card_gradient TEXT DEFAULT 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      rating REAL DEFAULT 4.0,
      popularity_score INTEGER DEFAULT 0,
      is_popular INTEGER DEFAULT 0,
      highlight TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export interface Card {
    id: string;
    name: string;
    slug: string;
    issuer: string;
    card_type: string;
    network: string;
    annual_fee: number;
    joining_fee: number;
    interest_rate: number | null;
    cashback_rate: number | null;
    rewards_rate: number | null;
    rewards_type: string | null;
    welcome_bonus: string | null;
    features: string;
    benefits: string;
    eligibility: string;
    fees: string;
    image_url: string | null;
    card_color: string;
    card_gradient: string;
    rating: number;
    popularity_score: number;
    is_popular: number;
    highlight: string | null;
    created_at: string;
    updated_at: string;
}

// Parsed version for frontend use
export interface CardParsed {
    id: string;
    name: string;
    slug: string;
    issuer: string;
    cardType: string;
    network: string;
    annualFee: number;
    joiningFee: number;
    interestRate: number | null;
    cashbackRate: number | null;
    rewardsRate: number | null;
    rewardsType: string | null;
    welcomeBonus: string | null;
    features: string[];
    benefits: string[];
    eligibility: Record<string, unknown>;
    fees: Record<string, unknown>;
    imageUrl: string | null;
    cardColor: string;
    cardGradient: string;
    rating: number;
    popularityScore: number;
    isPopular: boolean;
    highlight: string | null;
}

export function parseCard(card: Card): CardParsed {
    return {
        id: card.id,
        name: card.name,
        slug: card.slug,
        issuer: card.issuer,
        cardType: card.card_type,
        network: card.network,
        annualFee: card.annual_fee,
        joiningFee: card.joining_fee,
        interestRate: card.interest_rate,
        cashbackRate: card.cashback_rate,
        rewardsRate: card.rewards_rate,
        rewardsType: card.rewards_type,
        welcomeBonus: card.welcome_bonus,
        features: JSON.parse(card.features || '[]'),
        benefits: JSON.parse(card.benefits || '[]'),
        eligibility: JSON.parse(card.eligibility || '{}'),
        fees: JSON.parse(card.fees || '{}'),
        imageUrl: card.image_url,
        cardColor: card.card_color,
        cardGradient: card.card_gradient,
        rating: card.rating,
        popularityScore: card.popularity_score,
        isPopular: card.is_popular === 1,
        highlight: card.highlight,
    };
}

export function getAllCards(filters?: {
    cardType?: string;
    network?: string;
    issuer?: string;
    minFee?: number;
    maxFee?: number;
    rewardsType?: string;
    sort?: string;
    search?: string;
    page?: number;
    limit?: number;
}): { cards: CardParsed[]; total: number } {
    const db = getDb();
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters?.cardType) {
        conditions.push('card_type = ?');
        params.push(filters.cardType);
    }
    if (filters?.network) {
        conditions.push('network = ?');
        params.push(filters.network);
    }
    if (filters?.issuer) {
        conditions.push('issuer = ?');
        params.push(filters.issuer);
    }
    if (filters?.minFee !== undefined) {
        conditions.push('annual_fee >= ?');
        params.push(filters.minFee);
    }
    if (filters?.maxFee !== undefined) {
        conditions.push('annual_fee <= ?');
        params.push(filters.maxFee);
    }
    if (filters?.rewardsType) {
        conditions.push('rewards_type = ?');
        params.push(filters.rewardsType);
    }
    if (filters?.search) {
        conditions.push('(name LIKE ? OR issuer LIKE ? OR highlight LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderBy = 'ORDER BY popularity_score DESC';
    if (filters?.sort === 'fee_low') orderBy = 'ORDER BY annual_fee ASC';
    if (filters?.sort === 'fee_high') orderBy = 'ORDER BY annual_fee DESC';
    if (filters?.sort === 'rating') orderBy = 'ORDER BY rating DESC';
    if (filters?.sort === 'rewards') orderBy = 'ORDER BY COALESCE(rewards_rate, cashback_rate, 0) DESC';
    if (filters?.sort === 'name') orderBy = 'ORDER BY name ASC';

    const countResult = db.prepare(`SELECT COUNT(*) as total FROM cards ${whereClause}`).get(...params) as { total: number };
    const total = countResult.total;

    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const offset = (page - 1) * limit;

    const rows = db.prepare(`SELECT * FROM cards ${whereClause} ${orderBy} LIMIT ? OFFSET ?`).all(...params, limit, offset) as Card[];

    return {
        cards: rows.map(parseCard),
        total,
    };
}

export function getCardBySlug(slug: string): CardParsed | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM cards WHERE slug = ?').get(slug) as Card | undefined;
    return row ? parseCard(row) : null;
}

export function getCardById(id: string): CardParsed | null {
    const db = getDb();
    const row = db.prepare('SELECT * FROM cards WHERE id = ?').get(id) as Card | undefined;
    return row ? parseCard(row) : null;
}

export function getCardsByIds(ids: string[]): CardParsed[] {
    const db = getDb();
    const placeholders = ids.map(() => '?').join(',');
    const rows = db.prepare(`SELECT * FROM cards WHERE id IN (${placeholders})`).all(...ids) as Card[];
    return rows.map(parseCard);
}

export function getSimilarCards(card: CardParsed, limit = 4): CardParsed[] {
    const db = getDb();
    const rows = db.prepare(`
    SELECT * FROM cards 
    WHERE id != ? AND (card_type = ? OR issuer = ? OR rewards_type = ?)
    ORDER BY popularity_score DESC 
    LIMIT ?
  `).all(card.id, card.cardType, card.issuer, card.rewardsType, limit) as Card[];
    return rows.map(parseCard);
}

export function getFeaturedCards(limit = 8): CardParsed[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM cards WHERE is_popular = 1 ORDER BY popularity_score DESC LIMIT ?').all(limit) as Card[];
    return rows.map(parseCard);
}

export function getUniqueIssuers(): string[] {
    const db = getDb();
    const rows = db.prepare('SELECT DISTINCT issuer FROM cards ORDER BY issuer').all() as { issuer: string }[];
    return rows.map(r => r.issuer);
}

export function searchCards(query: string, limit = 10): CardParsed[] {
    const db = getDb();
    const searchTerm = `%${query}%`;
    const rows = db.prepare(`
    SELECT * FROM cards 
    WHERE name LIKE ? OR issuer LIKE ? OR highlight LIKE ? OR card_type LIKE ? OR rewards_type LIKE ?
    ORDER BY popularity_score DESC 
    LIMIT ?
  `).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit) as Card[];
    return rows.map(parseCard);
}
