import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import config from 'configs/app';
import { ChainId } from '../types';

export const SandVerse = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: ChainId.SANDVERSE_TESTNET,
  name: 'SAND Verse',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.sandverse.oasys.games' ],
    },
  },
  blockExplorers: {
    'default': {
      name: 'Sand Verse scan',
      url: '',
    },
  },
  contracts: {
    ...chainConfig.contracts,
    l1StandardBridge: {
      [ChainId.OASYS_TESTNET]: {
        address: config.verse.bridge.l1BridgeAddress as `0x${string}`,
      },
    },
  },
  erc20Addresses: {},
});

