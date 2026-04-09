/**
 * UK Newspaper Database
 *
 * 389 newspapers, 155 property journalists, 166 finance journalists
 * across 525 towns. Used for targeted press release distribution.
 *
 * Source: /Users/mattlenzie/Downloads/UK_Newspaper_Database_v2.xlsx
 * Converted via scripts at build time → data/newspapers.json
 */

import fs from "fs";
import path from "path";

// ── Types ──────────────────────────────────────────────────────

export interface Newspaper {
  nation: string;
  county: string;
  townCount: number;
  keyTowns: string[];
  newspaper: string;
  url: string;
  type: string;
  publisher: string;
  editor: string;
  additionalPapers: string;
  notes: string;
}

export interface Journalist {
  nation: string;
  county: string;
  keyTowns: string[];
  newspaper: string;
  url: string;
  type: string;
  publisher: string;
  journalist: string;
  contact: string;
  editor: string;
}

export interface TownReference {
  nation: string;
  county: string;
  town: string;
  population: number;
}

interface NewspaperDatabase {
  newspapers: Newspaper[];
  propertyJournalists: Journalist[];
  financeJournalists: Journalist[];
  townsReference: TownReference[];
}

// ── Data Loading ───────────────────────────────────────────────

let _db: NewspaperDatabase | null = null;

function loadDatabase(): NewspaperDatabase {
  if (_db) return _db;
  const filePath = path.join(process.cwd(), "data", "newspapers.json");
  const content = fs.readFileSync(filePath, "utf-8");
  _db = JSON.parse(content) as NewspaperDatabase;
  return _db;
}

// ── Lookup Functions ───────────────────────────────────────────

/** Get all newspapers covering a specific county */
export function getNewspapersByCounty(county: string): Newspaper[] {
  const db = loadDatabase();
  const normalised = county.toLowerCase();
  return db.newspapers.filter(
    (n) => n.county.toLowerCase() === normalised
  );
}

/** Get all newspapers covering a specific town */
export function getNewspapersByTown(townName: string): Newspaper[] {
  const db = loadDatabase();
  const normalised = townName.toLowerCase();
  return db.newspapers.filter((n) =>
    n.keyTowns.some((t) => t.toLowerCase() === normalised)
  );
}

/** Get property journalists covering a county */
export function getPropertyJournalistsByCounty(county: string): Journalist[] {
  const db = loadDatabase();
  const normalised = county.toLowerCase();
  return db.propertyJournalists.filter(
    (j) => j.county.toLowerCase() === normalised
  );
}

/** Get finance journalists covering a county */
export function getFinanceJournalistsByCounty(county: string): Journalist[] {
  const db = loadDatabase();
  const normalised = county.toLowerCase();
  return db.financeJournalists.filter(
    (j) => j.county.toLowerCase() === normalised
  );
}

/** Get property journalists covering a specific town */
export function getPropertyJournalistsByTown(townName: string): Journalist[] {
  const db = loadDatabase();
  const normalised = townName.toLowerCase();
  return db.propertyJournalists.filter((j) =>
    j.keyTowns.some((t) => t.toLowerCase() === normalised)
  );
}

/** Get finance journalists covering a specific town */
export function getFinanceJournalistsByTown(townName: string): Journalist[] {
  const db = loadDatabase();
  const normalised = townName.toLowerCase();
  return db.financeJournalists.filter((j) =>
    j.keyTowns.some((t) => t.toLowerCase() === normalised)
  );
}

/** Get town population from the reference table */
export function getTownPopulation(townName: string): number | null {
  const db = loadDatabase();
  const normalised = townName.toLowerCase();
  const entry = db.townsReference.find(
    (t) => t.town.toLowerCase() === normalised
  );
  return entry?.population ?? null;
}

/** Get all database stats */
export function getDatabaseStats() {
  const db = loadDatabase();
  return {
    newspaperCount: db.newspapers.length,
    propertyJournalistCount: db.propertyJournalists.length,
    financeJournalistCount: db.financeJournalists.length,
    townCount: db.townsReference.length,
    counties: [...new Set(db.newspapers.map((n) => n.county))].sort(),
  };
}
