import { defineChain } from 'viem';
import { oasys } from 'viem/chains';

import { ChainId, TokenIndex } from '../types';

export const Oasys = defineChain({
  ...oasys,
  id: ChainId.OASYS,
  name: 'Oasys Mainnet',
  rpcUrls: {
    'default': {
      http: [ 'https://rpc.mainnet.oasys.games' ],
    },
  },
  erc20Addresses: {},
});
