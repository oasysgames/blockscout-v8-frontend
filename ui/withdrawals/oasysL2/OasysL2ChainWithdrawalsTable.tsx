import React from 'react';
import type { AddressWithdrawalsItem } from 'types/api/address';
import type { BlockWithdrawalsItem } from 'types/api/block';
import type { WithdrawalsItem } from 'types/api/withdrawals';

import config from 'configs/app';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';

import {
  TableRoot as Table,
  TableBody as Tbody,
  TableColumnHeader as Th,
  TableHeaderSticky as Thead,
  TableRow as Tr,
} from 'toolkit/chakra/table';

import OasysL2ChainWithdrawalsTableItem from './OasysL2ChainWithdrawalsTableItem';

const feature = config.features.beaconChain;

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

// Props for the main table component
type Props = {
  top: number;
  isLoading?: boolean;
} & (
  | {
      items: Array<ExtendedWithdrawalsItem>;
      view: 'list';
    }
  | {
      items: Array<ExtendedAddressWithdrawalsItem>;
      view: 'address';
    }
  | {
      items: Array<ExtendedBlockWithdrawalsItem>;
      view: 'block';
    }
);

const OasysL2ChainWithdrawalsTable = ({ items, isLoading = false, top, view }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  // Return null if the feature is not enabled
  if (!feature.isEnabled) {
    return null;
  }

  // Render table rows dynamically
  const renderRows = () => {
    const slicedItems = items.slice(0, renderedItemsNum);
    return slicedItems.map((item, index) => (
      <OasysL2ChainWithdrawalsTableItem
        key={`${item.index}-${isLoading ? index : ''}`}
        item={item}
        view={view}
        isLoading={isLoading}
      />
    ));
  };

  return (
    <Table tableLayout="auto" minW="950px">
      {/* Table Header */}
      <Thead top={top}>
        <Tr>
          <Th minW="100px">L1 block No</Th>
          {view !== 'address' && <Th w="25%">From</Th>}
          <Th minW="140px">L1 Txn hash</Th>
          {view !== 'block' && <Th w="25%">Age</Th>}
          <Th w="25%">{`Value ${feature.currency.symbol}`}</Th>
        </Tr>
      </Thead>

      {/* Table Body */}
      <Tbody>
        {renderRows()}
        <tr ref={cutRef} />
      </Tbody>
    </Table>
  );
};

export default OasysL2ChainWithdrawalsTable;
