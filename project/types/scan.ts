export interface ScanResult {
  id: string;
  timestamp: string;
  imageUri?: string;
  anomalyDetected: boolean;
  severity: 'Low' | 'Medium' | 'High';
  confidence: number;
  bodyArea: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  recommendation: string;
  notes?: string;
}

export interface HistoryFilter {
  severity?: 'Low' | 'Medium' | 'High';
  dateRange?: {
    start: Date;
    end: Date;
  };
  anomalyDetected?: boolean;
}