import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const SaakuruVerse = /*#__PURE__*/ defineChain({
  id: ChainId.SAAKURU,
  verseVersion: 1,
  name: 'Saakuru Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.saakuru.network' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'Saakuru Verse scan',
      url: 'https://explorer.saakuru.network',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS]: {
        address: '0x4FfA6d5745C2E78361ae91a36312524284F3D812',
      },
    },
  },
  erc20Addresses: {},
});
