import type { Address } from 'viem';
import type { Chain } from 'viem/chains';

import { ChainId, TokenIndex } from '../types';
import { DefiVerse } from './defi';
import { GeekVerse } from './geek';
import { GesoVerse } from './geso';
import { HOMEVerse } from './home';
import { MCHVerse } from './mch';
import { Oasys } from './oasys';
import { SaakuruVerse } from './saakuru';
import { SandVerse } from './sand';
import { OasysTestnet } from './oasystestnet';
import { TCGVerse } from './tcg';
import { XPLAVerse } from './xpla';
import { YooldoVerse } from './yooldo';
import verseConfig from '../../../configs/app/verse';

export const CHAINS: { [k in ChainId]: Chain } = {
  [ChainId.OASYS]: Oasys,
  [ChainId.OASYS_TESTNET]: OasysTestnet,
  [ChainId.SANDVERSE_TESTNET]: SandVerse,
  [ChainId.TCG]: TCGVerse,
  [ChainId.MCH]: MCHVerse,
  [ChainId.SAAKURU]: SaakuruVerse,
  [ChainId.XPLA]: XPLAVerse,
  [ChainId.HOME]: HOMEVerse,
  [ChainId.DEFI]: DefiVerse,
  [ChainId.YOOLDO]: YooldoVerse,
  [ChainId.GEEK]: GeekVerse,
  [ChainId.GESO]: GesoVerse,
};

export const L2MainnetChainIds = [
  ChainId.TCG,
  ChainId.MCH,
  ChainId.SAAKURU,
  ChainId.XPLA,
  ChainId.HOME,
  ChainId.DEFI,
  ChainId.YOOLDO,
  ChainId.GEEK,
  ChainId.GESO,
];

export function getChainInfo(ind: ChainId): Chain {
  const chain = CHAINS[ind];
  return chain;
}

export {
  Oasys,
  OasysTestnet,
  SandVerse,
  TCGVerse,
  MCHVerse,
  SaakuruVerse,
  XPLAVerse,
  HOMEVerse,
  DefiVerse,
  YooldoVerse,
  GeekVerse,
  GesoVerse,
};

interface ChainWithERC20Address {
  erc20Addresses?: Partial<{ [k in TokenIndex]: Address }>;
}

export async function getTokenAddress(chainId: ChainId, tokenIndex: TokenIndex): Promise<Address | undefined> {
  // Ensure bridge token list is loaded
  await verseConfig.bridgeTokens.ensureLoaded();
  
  // Try to get from dynamic bridge token list first
  const bridgeErc20Addresses = verseConfig.bridgeTokens.erc20Addresses;
  if (bridgeErc20Addresses && bridgeErc20Addresses[tokenIndex]) {
    return bridgeErc20Addresses[tokenIndex] as Address;
  }

  // Fallback to chain config
  const chainErc20Addresses =
		(getChainInfo(chainId) as ChainWithERC20Address).erc20Addresses || {};

  return chainErc20Addresses[tokenIndex];
}

export async function getTokenList(
  l1ChainId: ChainId,
  l2ChainId: ChainId,
  excludeTokens: Array<TokenIndex> = [],
): Promise<Array<TokenIndex>> {
  // TODO check l1ChainId is l1, l2ChainId is l2
  const list: Array<TokenIndex> = [ TokenIndex.OAS ];

  // Ensure bridge token list is loaded
  await verseConfig.bridgeTokens.ensureLoaded();

  // Try to get from dynamic bridge token list first
  const bridgeErc20Addresses = verseConfig.bridgeTokens.erc20Addresses;
  
  if (bridgeErc20Addresses && Object.keys(bridgeErc20Addresses).length > 0) {
    // Use bridge token list if available
    const bridgeTokenIndexes = Object.keys(bridgeErc20Addresses).map((k) => Number(k) as TokenIndex);
    
    for (const tokenIndex of bridgeTokenIndexes) {
      if (!excludeTokens.includes(tokenIndex)) {
        list.push(tokenIndex);
      }
    }
  } else {
    // Fallback to chain config
    const l1Erc20Addresses = (getChainInfo(l1ChainId) as ChainWithERC20Address).erc20Addresses || {};
    const l2Erc20Addresses = (getChainInfo(l2ChainId) as ChainWithERC20Address).erc20Addresses || {};

    const l1TokenIndexes = Object.keys(l1Erc20Addresses).map((k) => Number(k) as TokenIndex);

    for (const tokenIndex of l1TokenIndexes) {
      if (
        !excludeTokens.includes(tokenIndex) &&
				l1Erc20Addresses[tokenIndex] &&
				l2Erc20Addresses[tokenIndex]
      ) {
        list.push(tokenIndex);
      }
    }
  }

  return list;
}

interface ChainWithVerseVersion {
  verseVersion?: 0 | 1
}

export function getVerseVersion(chainId: ChainId) {
  return (getChainInfo(chainId) as ChainWithVerseVersion).verseVersion
}
