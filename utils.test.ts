import 'mocha';
import { httpParser, analyseLogEntries } from './utils';
import { expect } from 'chai';

describe('Log parser', () => {
  describe('httpParser', () => {
    it('should return null if no match', () => {
      const mockedLog = 'this is not a valid log';
      expect(httpParser(mockedLog)).to.be.a('null');
    });

    it('should parse the correct http request information', () => {
      const mockedLog = '177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574';
      expect(httpParser(mockedLog)).to.eql({
        ip: '177.71.128.21',
        timestamp: '10/Jul/2018:22:21:28 +0200',
        method: 'GET',
        url: '/intranet-analytics/',
        protocol: 'HTTP/1.1',
        statusCode: 200,
        responseSize: 3574,
      });
    });

    it('should parse the correct http request info even the log with extra info', () => {
      const mockedLog =
        '50.112.00.11 - admin [11/Jul/2018:17:33:01 +0200] "GET /asset.css HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6"';
      expect(httpParser(mockedLog)).to.eql({
        ip: '50.112.00.11',
        timestamp: '11/Jul/2018:17:33:01 +0200',
        method: 'GET',
        url: '/asset.css',
        protocol: 'HTTP/1.1',
        statusCode: 200,
        responseSize: 3574,
      });
    });
  });

  describe('analyseLogEntries', () => {
    it('should report the 5 unique IPs, right top 3 URLs and IPs(some with the same counts) based on the mock entries', () => {
      const mockLogEntries = [
        {
          ip: '177.71.128.21',
          timestamp: '10/Jul/2018:22:21:28 +0200',
          method: 'GET',
          url: '/intranet-analytics/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.40',
          timestamp: '09/Jul/2018:10:11:30 +0200',
          method: 'GET',
          url: 'http://example.net/faq/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.41',
          timestamp: '11/Jul/2018:17:41:30 +0200',
          method: 'GET',
          url: '/intranet-analytics/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.40',
          timestamp: '09/Jul/2018:10:10:38 +0200',
          method: 'GET',
          url: '/docs/manage-users/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '177.71.128.22',
          timestamp: '10/Jul/2018:22:22:08 +0200',
          method: 'GET',
          url: '/intranet-analytics/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.9',
          timestamp: '09/Jul/2018:23:00:42 +0200',
          method: 'GET',
          url: '/docs/manage-users/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
      ];
      const expectedStats = {
        uniqueIpCount: 5,
        topUrls: [
          { url: '/intranet-analytics/', count: 3 },
          { url: '/docs/manage-users/', count: 2 },
          { url: 'http://example.net/faq/', count: 1 },
        ],
        topIps: [
          { ip: '168.41.191.40', count: 2 },
          { ip: '177.71.128.21', count: 1 },
          { ip: '168.41.191.41', count: 1 },
        ],
      };
      expect(analyseLogEntries(mockLogEntries)).to.eql(expectedStats);
    });
    it('should report the right stats object based on the given example logEntries', () => {
      const mockLogEntries = [
        {
          ip: '177.71.128.21',
          timestamp: '10/Jul/2018:22:21:28 +0200',
          method: 'GET',
          url: '/intranet-analytics/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.40',
          timestamp: '09/Jul/2018:10:11:30 +0200',
          method: 'GET',
          url: 'http://example.net/faq/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.41',
          timestamp: '11/Jul/2018:17:41:30 +0200',
          method: 'GET',
          url: '/this/page/does/not/exist/',
          protocol: 'HTTP/1.1',
          statusCode: 404,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.40',
          timestamp: '09/Jul/2018:10:10:38 +0200',
          method: 'GET',
          url: 'http://example.net/blog/category/meta/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '177.71.128.21',
          timestamp: '10/Jul/2018:22:22:08 +0200',
          method: 'GET',
          url: '/blog/2018/08/survey-your-opinion-matters/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.9',
          timestamp: '09/Jul/2018:23:00:42 +0200',
          method: 'GET',
          url: '/docs/manage-users/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.40',
          timestamp: '09/Jul/2018:10:11:56 +0200',
          method: 'GET',
          url: '/blog/category/community/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.34',
          timestamp: '10/Jul/2018:22:01:17 +0200',
          method: 'GET',
          url: '/faq/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '177.71.128.21',
          timestamp: '10/Jul/2018:22:21:03 +0200',
          method: 'GET',
          url: '/docs/manage-websites/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '50.112.00.28',
          timestamp: '11/Jul/2018:15:49:46 +0200',
          method: 'GET',
          url: '/faq/how-to-install/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '50.112.00.11',
          timestamp: '11/Jul/2018:17:31:56 +0200',
          method: 'GET',
          url: '/asset.js',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '72.44.32.11',
          timestamp: '11/Jul/2018:17:42:07 +0200',
          method: 'GET',
          url: '/to-an-error',
          protocol: 'HTTP/1.1',
          statusCode: 500,
          responseSize: 3574,
        },
        {
          ip: '72.44.32.10',
          timestamp: '09/Jul/2018:15:48:07 +0200',
          method: 'GET',
          url: '/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.9',
          timestamp: '09/Jul/2018:22:56:45 +0200',
          method: 'GET',
          url: '/docs/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.43',
          timestamp: '11/Jul/2018:17:43:40 +0200',
          method: 'GET',
          url: '/moved-permanently',
          protocol: 'HTTP/1.1',
          statusCode: 301,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.43',
          timestamp: '11/Jul/2018:17:44:40 +0200',
          method: 'GET',
          url: '/temp-redirect',
          protocol: 'HTTP/1.1',
          statusCode: 307,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.40',
          timestamp: '09/Jul/2018:10:12:03 +0200',
          method: 'GET',
          url: '/docs/manage-websites/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '168.41.191.34',
          timestamp: '10/Jul/2018:21:59:50 +0200',
          method: 'GET',
          url: '/faq/how-to/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '72.44.32.10',
          timestamp: '09/Jul/2018:15:49:48 +0200',
          method: 'GET',
          url: '/translations/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '79.125.00.21',
          timestamp: '10/Jul/2018:20:03:40 +0200',
          method: 'GET',
          url: '/newsletter/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '50.112.00.11',
          timestamp: '11/Jul/2018:17:31:05 +0200',
          method: 'GET',
          url: '/hosting/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '72.44.32.10',
          timestamp: '09/Jul/2018:15:48:20 +0200',
          method: 'GET',
          url: '/download/counter/',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
        {
          ip: '50.112.00.11',
          timestamp: '11/Jul/2018:17:33:01 +0200',
          method: 'GET',
          url: '/asset.css',
          protocol: 'HTTP/1.1',
          statusCode: 200,
          responseSize: 3574,
        },
      ];
      const expectedStats = {
        uniqueIpCount: 11,
        topUrls: [
          { url: '/docs/manage-websites/', count: 2 },
          { url: '/intranet-analytics/', count: 1 },
          { url: 'http://example.net/faq/', count: 1 },
        ],
        topIps: [
          { ip: '168.41.191.40', count: 4 },
          { ip: '177.71.128.21', count: 3 },
          { ip: '50.112.00.11', count: 3 },
        ],
      };
      expect(analyseLogEntries(mockLogEntries)).to.eql(expectedStats);
    });
  });
});
