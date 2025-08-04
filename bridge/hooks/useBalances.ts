import { useMemo, useState, useEffect } from 'react';
import { erc20Abi, formatEther } from 'viem';
import { useAccount, useBalance, useReadContract } from 'wagmi';

import type { ChainId } from '../constants/types';
import { TokenIndex } from '../constants/types';

import { getTokenAddress } from '../constants/chains';

export function useBalances(chainId: ChainId, tokenIndex: TokenIndex) {
  const { address } = useAccount();
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | undefined>(undefined);

  // native token
  const isNativeToken = tokenIndex === TokenIndex.OAS;
  const queryOption = { enabled: isNativeToken };
  const { data: BalanceData } = useBalance({ address, chainId, query: queryOption });

  const Balance = useMemo(() => formatEther(BalanceData?.value || BigInt(0)), [ BalanceData ]);

  // Load token address asynchronously
  useEffect(() => {
    const loadTokenAddress = async () => {
      const address = await getTokenAddress(chainId, tokenIndex);
      setTokenAddress(address);
    };
    loadTokenAddress();
  }, [chainId, tokenIndex]);

  // token balance
  const { data: TokenBalanceRaw } = useReadContract({
    chainId,
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [ address || '0x' ],
    query: { enabled: !!tokenAddress },
  });
  const TokenBalance = useMemo(() => formatEther(TokenBalanceRaw || BigInt(0)), [ TokenBalanceRaw ]);

  return isNativeToken ? Balance : TokenBalance;
}
