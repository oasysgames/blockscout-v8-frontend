import type CspDev from 'csp-dev';

export function ad(): CspDev.DirectiveDescriptor {
  return {
    'connect-src': [
      // coinzilla
      'coinzilla.com',
      '*.coinzilla.com',
      'https://request-global.czilladx.com',

      // adbutler
      'servedbyadbutler.com',

      // slise
      '*.slise.xyz',

      // hype
      'api.hypelab.com',
      '*.ixncdn.com',
      '*.cloudfront.net',
    ],
    'frame-src': [
      // coinzilla
      'https://request-global.czilladx.com',
    ],
    'script-src': [
      // coinzilla
      'coinzillatag.com',
    ],
    'img-src': [
      // coinzilla
      'cdn.coinzilla.io',
    ],
    'font-src': [
      // coinzilla
      'https://request-global.czilladx.com',
    ],
  };
}
