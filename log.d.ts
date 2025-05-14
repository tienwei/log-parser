export interface LogEntry {
  ip: string;
  timestamp: string;
  method: string;
  url: string;
  protocol: string;
  statusCode: number;
  responseSize: number;
}

export interface LogStats {
  uniqueIpCount: number;
  topUrls: Array<{ url: string; count: number }>;
  topIps: Array<{ ip: string; count: number }>;
}
