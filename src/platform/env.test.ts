import { describe, expect, it } from 'vitest';
import { parseEndpoint } from './env.js';

describe('parseEndpoint', () => {
  // The committed .env sets this to an empty value on purpose. These cases pin
  // the dark-by-default guarantee: nothing that looks empty may ever be handed
  // to fetch as if it were a URL.
  it('treats the committed empty default as dark', () => {
    expect(parseEndpoint('')).toBeNull();
  });

  it('treats an unset variable as dark', () => {
    expect(parseEndpoint(undefined)).toBeNull();
  });

  it('treats whitespace as dark rather than as a URL', () => {
    expect(parseEndpoint('   ')).toBeNull();
    expect(parseEndpoint('\n\t ')).toBeNull();
  });

  it('returns a configured endpoint, trimmed', () => {
    expect(parseEndpoint('https://example.workers.dev/api/reflect')).toBe(
      'https://example.workers.dev/api/reflect',
    );
    expect(parseEndpoint('  https://example.workers.dev/api/reflect\n')).toBe(
      'https://example.workers.dev/api/reflect',
    );
  });

  it('never returns an empty string, so the dark state is always null', () => {
    for (const raw of ['', ' ', '\t', '\n', undefined]) {
      expect(parseEndpoint(raw)).not.toBe('');
    }
  });
});
