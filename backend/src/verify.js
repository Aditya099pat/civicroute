import https from 'https';
import http from 'http';
import tls from 'tls';
import crypto from 'crypto';

/**
 * Honest URL verification for official government portals.
 *
 * Reports only truthful, observable facts (reachability, HTTPS, real TLS cert
 * details, a real content hash, and whether the host is a genuine government
 * domain). Never fabricates trust signals.
 *
 * SSRF protection: only hosts ending in an allowed government suffix are ever
 * contacted, and requests to private / loopback address literals are refused.
 */

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes
const cache = new Map(); // url -> { result, expires }
const REQUEST_TIMEOUT_MS = 8000;

function allowedSuffixes() {
  return (process.env.ALLOWED_VERIFY_HOSTS || '.gov.in,.gov,.nic.in')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isPrivateHost(hostname) {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost')) return true;
  // IPv4 / IPv6 literals and private ranges
  if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  if (h === '::1' || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('fe80')) return true;
  return false;
}

export function classifyUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: 'invalid-url' };
  }
  const isHttps = url.protocol === 'https:';
  const hostname = url.hostname.toLowerCase();
  const isGovDomain = allowedSuffixes().some((suffix) => hostname.endsWith(suffix));
  if (isPrivateHost(hostname)) return { ok: false, reason: 'private-host', hostname };
  if (!isGovDomain) return { ok: false, reason: 'not-allowed-host', hostname, isHttps };
  return { ok: true, url, hostname, isHttps };
}

function fetchHead(url) {
  return new Promise((resolve) => {
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request(
      url,
      { method: 'GET', timeout: REQUEST_TIMEOUT_MS, headers: { 'User-Agent': 'CivicRoute-Verifier/1.0' } },
      (res) => {
        const chunks = [];
        let bytes = 0;
        res.on('data', (c) => {
          bytes += c.length;
          if (bytes <= 262144) chunks.push(c); // hash first 256KB only
        });
        res.on('end', () => {
          const hash = crypto.createHash('sha256').update(Buffer.concat(chunks)).digest('hex');
          resolve({
            reachable: res.statusCode < 500,
            statusCode: res.statusCode,
            contentHash: `sha256:${hash.slice(0, 32)}`,
          });
        });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      resolve({ reachable: false, error: 'timeout' });
    });
    req.on('error', (err) => resolve({ reachable: false, error: err.code || err.message }));
    req.end();
  });
}

function fetchCert(hostname) {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: hostname, port: 443, servername: hostname, timeout: REQUEST_TIMEOUT_MS, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate();
        const protocol = socket.getProtocol();
        const authorized = socket.authorized;
        socket.end();
        resolve({
          protocol,
          authorized,
          issuer: cert?.issuer?.O || cert?.issuer?.CN || null,
          validTo: cert?.valid_to || null,
        });
      }
    );
    socket.on('timeout', () => {
      socket.destroy();
      resolve(null);
    });
    socket.on('error', () => resolve(null));
  });
}

export async function verifyUrl(rawUrl) {
  const cached = cache.get(rawUrl);
  if (cached && cached.expires > Date.now()) return cached.result;

  const classified = classifyUrl(rawUrl);
  let result;
  if (!classified.ok) {
    result = {
      url: rawUrl,
      verified: false,
      status: classified.reason,
      isHttps: !!classified.isHttps,
      isGovDomain: false,
      hostname: classified.hostname || null,
    };
  } else {
    const [head, cert] = await Promise.all([
      fetchHead(classified.url),
      classified.isHttps ? fetchCert(classified.hostname) : Promise.resolve(null),
    ]);
    result = {
      url: rawUrl,
      hostname: classified.hostname,
      isHttps: classified.isHttps,
      isGovDomain: true,
      reachable: !!head.reachable,
      statusCode: head.statusCode || null,
      contentHash: head.contentHash || null,
      tls: cert
        ? { protocol: cert.protocol, issuer: cert.issuer, validTo: cert.validTo, trusted: cert.authorized }
        : null,
      verified: !!head.reachable && classified.isHttps,
      status: head.reachable ? 'reachable' : (head.error || 'unreachable'),
      checkedAt: new Date().toISOString(),
    };
  }

  cache.set(rawUrl, { result, expires: Date.now() + CACHE_TTL_MS });
  return result;
}

export async function verifyUrls(urls = []) {
  const unique = [...new Set(urls.filter(Boolean))].slice(0, 25);
  const entries = await Promise.all(unique.map(async (u) => [u, await verifyUrl(u)]));
  return Object.fromEntries(entries);
}
