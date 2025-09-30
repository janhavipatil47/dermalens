import * as SQLite from 'expo-sqlite';
import { ScanResult } from '../types/scan';

const db = SQLite.openDatabaseSync('dermalens.db');

export const initializeDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      imageUri TEXT,
      anomalyDetected INTEGER NOT NULL,
      severity TEXT NOT NULL,
      confidence REAL NOT NULL,
      bodyArea TEXT NOT NULL,
      boundingBoxX REAL,
      boundingBoxY REAL,
      boundingBoxWidth REAL,
      boundingBoxHeight REAL,
      recommendation TEXT NOT NULL,
      notes TEXT
    );
  `);
};

export const saveScanResult = (result: ScanResult): void => {
  const statement = db.prepareSync(`
    INSERT INTO scans (
      id, timestamp, imageUri, anomalyDetected, severity, confidence,
      bodyArea, boundingBoxX, boundingBoxY, boundingBoxWidth, boundingBoxHeight,
      recommendation, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  statement.executeSync([
    result.id,
    result.timestamp,
    result.imageUri || null,
    result.anomalyDetected ? 1 : 0,
    result.severity,
    result.confidence,
    result.bodyArea,
    result.boundingBox?.x || null,
    result.boundingBox?.y || null,
    result.boundingBox?.width || null,
    result.boundingBox?.height || null,
    result.recommendation,
    result.notes || null,
  ]);
};

export const getAllScans = (): ScanResult[] => {
  const result = db.getAllSync(`
    SELECT * FROM scans ORDER BY timestamp DESC
  `);

  return result.map((row: any) => ({
    id: row.id,
    timestamp: row.timestamp,
    imageUri: row.imageUri,
    anomalyDetected: row.anomalyDetected === 1,
    severity: row.severity,
    confidence: row.confidence,
    bodyArea: row.bodyArea,
    boundingBox: row.boundingBoxX ? {
      x: row.boundingBoxX,
      y: row.boundingBoxY,
      width: row.boundingBoxWidth,
      height: row.boundingBoxHeight,
    } : undefined,
    recommendation: row.recommendation,
    notes: row.notes,
  }));
};

export const getScanById = (id: string): ScanResult | null => {
  const result = db.getFirstSync(`
    SELECT * FROM scans WHERE id = ?
  `, [id]);

  if (!result) return null;

  const row = result as any;
  return {
    id: row.id,
    timestamp: row.timestamp,
    imageUri: row.imageUri,
    anomalyDetected: row.anomalyDetected === 1,
    severity: row.severity,
    confidence: row.confidence,
    bodyArea: row.bodyArea,
    boundingBox: row.boundingBoxX ? {
      x: row.boundingBoxX,
      y: row.boundingBoxY,
      width: row.boundingBoxWidth,
      height: row.boundingBoxHeight,
    } : undefined,
    recommendation: row.recommendation,
    notes: row.notes,
  };
};

export const deleteScan = (id: string): void => {
  const statement = db.prepareSync(`DELETE FROM scans WHERE id = ?`);
  statement.executeSync([id]);
};

export const getScansCount = (): { total: number; detected: number; clear: number } => {
  const totalResult = db.getFirstSync(`SELECT COUNT(*) as count FROM scans`) as any;
  const detectedResult = db.getFirstSync(`SELECT COUNT(*) as count FROM scans WHERE anomalyDetected = 1`) as any;
  
  const total = totalResult.count;
  const detected = detectedResult.count;
  const clear = total - detected;

  return { total, detected, clear };
};