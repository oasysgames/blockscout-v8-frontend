import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const DefiVerse = defineChain({
  id: ChainId.DEFI,
  name: 'DeFiVerse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.defi-verse.org' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'DeFiVerse scan',
      url: 'https://scan.defi-verse.org',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x0cc5366BE800cf73daB2DBfDE031C255a6f1E3cC',
      },
    },
  },
});
