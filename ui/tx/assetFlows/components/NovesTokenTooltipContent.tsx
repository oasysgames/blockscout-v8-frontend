import { Box, Text } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import type { NovesNft, NovesToken } from 'types/api/noves';

import config from 'configs/app';
import { HEX_REGEXP } from 'toolkit/utils/regexp';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  amount?: string;
  token: NovesToken | NovesNft | undefined;
}

const NovesTokenTooltipContent: FC<Props> = ({ token, amount }) => {
  if (!token) {
    return null;
  }

  let symbol = token.symbol;
  let tokenName = token.name;
  // in case tokens is updated name
  const updatedAddress = config.verse.tokens.updatedAddress.toLowerCase();
  if (updatedAddress.length > 0 && token.address.toLowerCase().includes(updatedAddress)) {
    tokenName = config.verse.tokens.updatedName;
    symbol = config.verse.tokens.updatedSymbol;
  }

  const showTokenName = symbol !== tokenName;
  const showTokenAddress = HEX_REGEXP.test(token.address);

  return (
    <Box color={{ _light: 'white', _dark: 'blackAlpha.900' }} display="flex" flexDir="column" alignItems="center" gap={ 1 }>
      <Text as="p" color="inherit" fontWeight="semibold">
        <Text color="inherit" as="span">
          { amount }
        </Text>
        <Text color="inherit" as="span" ml={ 1 }>
          { symbol }
        </Text>
      </Text>

      { showTokenName && (
        <Text as="p" color="inherit" fontWeight="semibold" mt="6px">
          { token.name }
        </Text>
      ) }

      { showTokenAddress && (
        <Box display="flex" alignItems="center">
          <Text color="inherit" fontWeight="normal">
            { token.address }
          </Text>
          <CopyToClipboard text={ token.address }/>
        </Box>
      ) }

    </Box>
  );
};

export default React.memo(NovesTokenTooltipContent);
