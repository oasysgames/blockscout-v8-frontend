import React from 'react';

import type { WithdrawalsItem } from 'types/api/withdrawals';
import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';

import config from 'configs/app';
import { currencyUnits } from 'lib/units';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import CurrencyValue from 'ui/shared/CurrencyValue';
import { Skeleton } from 'toolkit/chakra/skeleton';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import {
  TableCell as Td,
  TableRow as Tr,
} from 'toolkit/chakra/table'; // Custom components

// Extend the types to include our custom properties
interface ExtendedWithdrawalsItem extends WithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedAddressWithdrawalsItem extends AddressWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedBlockWithdrawalsItem extends BlockWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

type Props = {
  item: ExtendedWithdrawalsItem | ExtendedAddressWithdrawalsItem | ExtendedBlockWithdrawalsItem;
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
};

// Helper function to truncate long strings
const truncateMiddle = (str: string, startChars = 6, endChars = 4, separator = '...') => {
  if (str.length <= startChars + endChars) {
    return str;
  }

  const start = str.substring(0, startChars);
  const end = str.substring(str.length - endChars);

  return `${start}${separator}${end}`;
};

// Type guards
const hasBlockNumber = (item: any): item is { block_number: number } =>
  'block_number' in item;

const hasReceiver = (item: any): item is { receiver: any } =>
  'receiver' in item;

const hasTxHash = (item: any): item is { tx_hash: string } =>
  'tx_hash' in item;

const hasTimestamp = (item: any): item is { timestamp: string } =>
  'timestamp' in item;

// Helper function to convert timestamp from seconds to milliseconds if needed
const formatTimestamp = (timestamp: string): number => {
  // If timestamp is a numeric string and less than year 2100 in seconds (4102444800)
  // it's likely in seconds and needs to be converted to milliseconds
  const numericTimestamp = Number(timestamp);
  if (!isNaN(numericTimestamp) && numericTimestamp < 4102444800) {
    return numericTimestamp * 1000;
  }
  return numericTimestamp;
};

const OasysL1ChainWithdrawalsTableItem = ({ item, view, isLoading }: Props) => {
  const isAddress = view === 'address';
  const isBlock = view === 'block';

  return (
    <Tr>
      {!isAddress && (
        <Td>
          <Skeleton loading={ isLoading } display="inline-block">
            {hasBlockNumber(item) ? item.block_number : '-'}
          s</Skeleton>
        </Td>
      )}
      {!isAddress && (
        <Td>
          {item.transactionHash ? (
            <TxEntity
              isLoading={isLoading}
              hash={item.transactionHash}
              truncation="constant_long"
              noIcon
              fontSize="sm"
            />
          ) : (
            <Skeleton loading={ isLoading } display="inline-block">
              -
            </Skeleton>
          )}
        </Td>
      )}
      <Td>
        <Skeleton loading={ isLoading } display="inline-block">
          {item.chainName || '-'}
        </Skeleton>
      </Td>
      {!isBlock && hasBlockNumber(item) && (
        <Td>
          <BlockEntity
            number={item.block_number}
            isLoading={isLoading}
            fontSize="sm"
          />
        </Td>
      )}
      {!isAddress && hasReceiver(item) && (
        <Td>
          <AddressEntity
            address={item.receiver}
            isLoading={isLoading}
            truncation="constant"
            fontSize="sm"
          />
        </Td>
      )}
      {!isBlock && hasTimestamp(item) && (
        <Td>
          <TimeWithTooltip
            timestamp={formatTimestamp(item.timestamp)}
            isLoading={isLoading}
            display="inline-block"
          />
        </Td>
      )}
      <Td>
        <CurrencyValue
          value={item.amount}
          currency={currencyUnits.ether}
          isLoading={isLoading}
        />
      </Td>
    </Tr>
  );
};

export default OasysL1ChainWithdrawalsTableItem;
