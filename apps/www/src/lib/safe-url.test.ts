import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  assertPublicHttpUrl,
  isPrivateIp,
  isPrivateIpv4,
  isPrivateIpv6,
  UnsafeUrlError,
} from './safe-url.ts';

describe('isPrivateIpv4', () => {
  it('flags loopback, RFC1918, link-local, and CGNAT', () => {
    assert.equal(isPrivateIpv4('127.0.0.1'), true);
    assert.equal(isPrivateIpv4('10.0.0.5'), true);
    assert.equal(isPrivateIpv4('192.168.1.1'), true);
    assert.equal(isPrivateIpv4('172.16.0.1'), true);
    assert.equal(isPrivateIpv4('169.254.169.254'), true);
    assert.equal(isPrivateIpv4('100.64.0.1'), true);
    assert.equal(isPrivateIpv4('0.0.0.0'), true);
    assert.equal(isPrivateIpv4('8.8.8.8'), false);
    assert.equal(isPrivateIpv4('1.1.1.1'), false);
  });
});

describe('isPrivateIpv6', () => {
  it('flags loopback, ULA, and link-local', () => {
    assert.equal(isPrivateIpv6('::1'), true);
    assert.equal(isPrivateIpv6('fc00::1'), true);
    assert.equal(isPrivateIpv6('fd12:3456::1'), true);
    assert.equal(isPrivateIpv6('fe80::1'), true);
    assert.equal(isPrivateIpv6('2001:4860:4860::8888'), false);
  });

  it('flags IPv4-mapped private addresses', () => {
    assert.equal(isPrivateIpv6('::ffff:127.0.0.1'), true);
    assert.equal(isPrivateIpv6('::ffff:169.254.169.254'), true);
    assert.equal(isPrivateIp('::ffff:8.8.8.8'), false);
  });
});

describe('assertPublicHttpUrl', () => {
  it('accepts public https URLs', () => {
    const url = assertPublicHttpUrl('https://example.com/path');
    assert.equal(url.hostname, 'example.com');
  });

  it('rejects non-http schemes, credentials, and private hosts', () => {
    assert.throws(() => assertPublicHttpUrl('ftp://example.com'), UnsafeUrlError);
    assert.throws(() => assertPublicHttpUrl('https://user:pass@example.com'), UnsafeUrlError);
    assert.throws(() => assertPublicHttpUrl('http://localhost/admin'), UnsafeUrlError);
    assert.throws(() => assertPublicHttpUrl('http://127.0.0.1/'), UnsafeUrlError);
    assert.throws(
      () => assertPublicHttpUrl('http://169.254.169.254/latest/meta-data'),
      UnsafeUrlError,
    );
    assert.throws(() => assertPublicHttpUrl('http://192.168.0.1/'), UnsafeUrlError);
    assert.throws(() => assertPublicHttpUrl('http://metadata.google.internal/'), UnsafeUrlError);
    assert.throws(() => assertPublicHttpUrl('http://foo.local/'), UnsafeUrlError);
  });
});
