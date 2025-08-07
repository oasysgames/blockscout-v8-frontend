import { defineChain } from 'viem';
import { chainConfig } from 'viem/op-stack';

import { ChainId, TokenIndex } from '../types';

export const OasysTestnet = /*#__PURE__*/ defineChain({
  id: ChainId.OASYS_TESTNET,
  name: 'Oasys Testnet',
  nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.testnet.oasys.games' ],
    },
    'public': {
      http: [ 'https://rpc.testnet.oasys.games' ],
    },
  },
  contracts: {
    ...chainConfig.contracts,
    multicall3: {
      address: '0xCC65BeF5A01140a6fc7eEf4Bd6967228B6137e4b',
    },
  },
  blockExplorers: {
    default: {
      name: 'OasysTestnet',
      url: 'https://explorer.testnet.oasys.games',
      apiUrl: 'https://explorer.testnet.oasys.games/api',
    },
  },
  erc20Addresses: {},
});
