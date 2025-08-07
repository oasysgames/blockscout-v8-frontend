import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const MCHVerse = /*#__PURE__*/ defineChain({
  id: ChainId.MCH,
  name: 'MCH Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.oasys.mycryptoheroes.net' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'MCH Verse scan',
      url: 'https://explorer.oasys.mycryptoheroes.net',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0xA16517A9796bAc73eFA7d07269F9818b7978dc2A',
      },
    },
  },
});
