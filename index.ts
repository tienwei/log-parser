/**
 * The task is to parse a log file containing HTTP requests and to report on its contents. For a given log file we want to know,
• The number of unique IP addresses 
• The top 3 most visited URLs
• The top 3 most active IP addresses
example log: 177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574
 */
import { readLogs } from './utils';

function main() {
  readLogs('./programming-task-example-data.log');
}

// Run the program
main();
