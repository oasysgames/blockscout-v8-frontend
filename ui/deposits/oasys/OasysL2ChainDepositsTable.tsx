import React from 'react';

import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'toolkit/chakra/table';
import OasysL2ChainDepositsTableItem from './OasysL2ChainDepositsTableItem';

const feature = config.features.beaconChain;

// Extend the types to include our custom properties
interface ExtendedDepositsItem extends WithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedAddressDepositsItem extends AddressWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

interface ExtendedBlockDepositsItem extends BlockWithdrawalsItem {
  transactionHash?: string;
  chainName?: string;
}

// Define the props for the table item component
type Props = {
  top: number;
  isLoading?: boolean;
} & ({
  items: Array<ExtendedDepositsItem>;
  view: 'list';
} | {
  items: Array<ExtendedAddressDepositsItem>;
  view: 'address';
} | {
  items: Array<ExtendedBlockDepositsItem>;
  view: 'block';
});

const OasysL2ChainDepositsTable = ({ items, isLoading, top, view }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <TableRoot tableLayout="auto" minW="950px">
      <TableHeaderSticky top={top}>
        <TableRow>
          <TableColumnHeader minW="100px">L1 block No</TableColumnHeader>
          <TableColumnHeader minW="140px">L1 Txn hash</TableColumnHeader>
          {view !== 'address' && <TableColumnHeader w="25%">L1 txn origin</TableColumnHeader>}
          {view !== 'address' && <TableColumnHeader w="25%">To</TableColumnHeader>}
          {view !== 'block' && <TableColumnHeader w="25%">Age</TableColumnHeader>}
          <TableColumnHeader w="25%">{`Value ${feature.currency.symbol}`}</TableColumnHeader>
        </TableRow>
      </TableHeaderSticky>
      <TableBody>
        {view === 'list' &&
          (items as Array<ExtendedDepositsItem>)
            .slice(0, renderedItemsNum)
            .map((item, index) => (
              <OasysL2ChainDepositsTableItem
                key={item.index + (isLoading ? String(index) : '')}
                item={item}
                view="list"
                isLoading={isLoading}
              />
            ))}
        {view === 'address' &&
          (items as Array<ExtendedAddressDepositsItem>)
            .slice(0, renderedItemsNum)
            .map((item, index) => (
              <OasysL2ChainDepositsTableItem
                key={item.index + (isLoading ? String(index) : '')}
                item={item}
                view="address"
                isLoading={isLoading}
              />
            ))}
        {view === 'block' &&
          (items as Array<ExtendedBlockDepositsItem>)
            .slice(0, renderedItemsNum)
            .map((item, index) => (
              <OasysL2ChainDepositsTableItem
                key={item.index + (isLoading ? String(index) : '')}
                item={item}
                view="block"
                isLoading={isLoading}
              />
            ))}
        <TableRow ref={cutRef} />
      </TableBody>
    </TableRoot>
  );
};

export default OasysL2ChainDepositsTable;