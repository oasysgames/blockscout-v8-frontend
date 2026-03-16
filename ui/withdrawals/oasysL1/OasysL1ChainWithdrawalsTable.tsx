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
} from 'toolkit/chakra/table'; // Custom components

import OasysL1ChainWithdrawalsTableItem from './OasysL1ChainWithdrawalsTableItem';

const feature = config.features.beaconChain;

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

const OasysL1ChainWithdrawalsTable = ({ items, isLoading = false, top, view }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  if (!feature.isEnabled) {
    return null;
  }

  const renderRows = () => {
    const slicedItems = items.slice(0, renderedItemsNum);
    return slicedItems.map((item, index) => (
      <OasysL1ChainWithdrawalsTableItem
        key={`${item.index}-${isLoading ? index : ''}`}
        item={item}
        view={view}
        isLoading={isLoading}
      />
    ));
  };

  return (
    <Table tableLayout="auto" minW="950px">
      <Thead top={top}>
        <Tr>
          <Th minW="100px">Index</Th>
          <Th minW="140px">Txn hash</Th>
          <Th minW="140px">Verse</Th>
          {view !== 'block' && <Th w="25%">Block</Th>}
          {view !== 'address' && <Th w="25%">To</Th>}
          {view !== 'block' && <Th w="25%">Age</Th>}
          <Th w="25%">{`Value ${feature.currency.symbol}`}</Th>
        </Tr>
      </Thead>

      <Tbody>
        {renderRows()}
        <tr ref={cutRef} />
      </Tbody>
    </Table>
  );
};

export default OasysL1ChainWithdrawalsTable;
