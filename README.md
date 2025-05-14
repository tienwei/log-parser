
# Http Request Log Parser
## Overview 
This is a simple node program in typescript that reads a given http log file containing HTTP requests and then reports the following information:
  - The number of unique IP addresses
  - The top 3 most visited URLs
  - The top 3 most active IP addresses

## Assumptions
This program is developed based on the following assumptions:
  - the log entry follows the same/similar pattern
  - the log file should contain more than 3 log entries with status code 2xx and 3xx
  - ignore urls that return the status code with 4xx & 5xx
  - if there are some URLs with the same number of visits(top 3), we only report the first 3 ones based on the log entry order
  - similarly for the top 3 active IPs, we only report the first 3 ones based on the log entry order

## Example Log Entry
177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574
A log file with test data is included with this assignment.

## How to Run
- For development mode, run `npm run dev`
- For production mode, run `npm run prod`
- For test, run `npm run test`

Note: currently I run this under node v22.14.0