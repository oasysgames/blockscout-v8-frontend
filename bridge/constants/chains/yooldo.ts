import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const YooldoVerse = defineChain({
  id: ChainId.YOOLDO,
  name: 'Yooldo Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.yooldo-verse.xyz' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'Yooldo Verse scan',
      url: 'https://explorer.yooldo-verse.xyz',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0xf6944626a2EA29615e05f3AC9Ab2568e8E004e9D',
      },
    },
  },
  erc20Addresses: {},
});
