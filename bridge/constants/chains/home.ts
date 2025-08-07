import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const HOMEVerse = defineChain({
  id: ChainId.HOME,
  name: 'HOME Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.mainnet.oasys.homeverse.games' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'HOME Verse scan',
      url: 'https://explorer.oasys.homeverse.games',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x9245e19eB88de2534E03E764FB2a5f194e6d97AD',
      },
    },
  },
});
