import fs from 'fs';
import type { LogEntry, LogStats } from './log';

//
/**
 * Read the log file and display the required results
 * @param filePath: string
 * @returns void
 */
function readLogs(filePath: string) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Fail to read the logs with the error: ${err}`);
    }

    const logEntries = parseLogFile(data);
    const stats = analyseLogEntries(logEntries);

    console.log('Log Analysis Results:');
    console.log('---------------------');
    console.log(`Number of unique IP addresses: ${stats.uniqueIpCount}`);

    console.log('\nTop 3 most visited URLs:');
    stats.topUrls.forEach((item, index) => {
      const unit = item.count === 1 ? 'visit' : 'visits';
      console.log(`${index + 1}. ${item.url} (${item.count} ${unit})`);
    });

    console.log('\nTop 3 most active IP addresses:');
    stats.topIps.forEach((item, index) => {
      const unit = item.count === 1 ? 'request' : 'requests';
      console.log(`${index + 1}. ${item.ip} (${item.count} ${unit})`);
    });
  });
}

/**
 * Parse the entire log file
 * @param logData: string
 * @returns LogEntry[]
 */
function parseLogFile(logData: string): LogEntry[] {
  const logLines = logData.split('\n').filter((line) => line.trim() !== '');
  return logLines.map((line) => httpParser(line)).filter((entry) => entry !== null) as LogEntry[];
}

/**
 * Parse a single log entry
 * @param httpRequest
 * @returns LogEntry | null
 */
function httpParser(httpRequest: string): LogEntry | null {
  // Regex pattern for the http request entry
  const regex =
    /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+-\s+([^\[]*?)\s+\[(\d{2}\/\w{3}\/\d{4}:\d{2}:\d{2}:\d{2}\s+[+-]\d{4})\]\s+"(GET|POST|PUT|DELETE|HEAD|OPTIONS|PATCH)\s+([^\s]+)\s+(HTTP\/\d\.\d)"\s+(\d{3})\s+(\d+)/;

  const match = httpRequest.match(regex);

  if (!match) {
    return null;
  }

  // skip match[2] for some logs with admin role
  return {
    ip: match[1],
    timestamp: match[3],
    method: match[4],
    url: match[5],
    protocol: match[6],
    statusCode: parseInt(match[7], 10),
    responseSize: parseInt(match[8], 10),
  };
}

/**
 * Analyse log entries to for analysis
 * @param entries: LogEntry[]
 * @returns LogStats
 */
function analyseLogEntries(entries: LogEntry[]): LogStats {
  // Count unique IPs
  const uniqueIps = new Set(entries.map((entry) => entry.ip));

  // Count URL visits
  const urlCounts: Record<string, number> = {};
  // filter out 4xx & 5xx
  entries
    .filter((entry) => entry.statusCode < 400)
    .forEach((entry) => {
      urlCounts[entry.url] = (urlCounts[entry.url] || 0) + 1;
    });

  // Count requests per IP
  const ipCounts: Record<string, number> = {};
  entries.forEach((entry) => {
    ipCounts[entry.ip] = (ipCounts[entry.ip] || 0) + 1;
  });

  // Get top 3 URLs
  const topUrls = Object.entries(urlCounts)
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Get top 3 IPs
  const topIps = Object.entries(ipCounts)
    .map(([ip, count]) => ({ ip, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    uniqueIpCount: uniqueIps.size,
    topUrls,
    topIps,
  };
}

export { readLogs, httpParser, analyseLogEntries };
