import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const TCGVerse = /*#__PURE__*/ defineChain({
  id: ChainId.TCG,
  name: 'TCG Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rep-rpc.tcgverse.xyz' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'TCG Verse scan',
      url: 'https://explorer.tcgverse.xyz',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0xa34a85ecb19c88d4965EcAfB10019E63050a1098',
      },
    },
  },
});
