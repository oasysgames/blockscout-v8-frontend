import { Box, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React, { useState, useCallback } from 'react';

import config from 'configs/app';
import { rightLineArrow, nbsp } from 'toolkit/utils/htmlEntities';
import getCurrencyValue from 'lib/getCurrencyValue';
import { currencyUnits } from 'lib/units';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import { Skeleton } from 'toolkit/chakra/skeleton';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import StickyPaginationWithText from 'ui/shared/StickyPaginationWithText';
import OasysL2ChainWithdrawalsListItem from 'ui/withdrawals/oasysL2/OasysL2ChainWithdrawalsListItem';
import OasysL2ChainWithdrawalsTable from 'ui/withdrawals/oasysL2/OasysL2ChainWithdrawalsTable';
import { useBridgeEvents, EventType } from 'ui/experiment/services/useBridgeEvents';
import { useBridgeEventCounts } from 'ui/experiment/services/useBridgeEventCounts';

const ITEMS_PER_PAGE = 20;

// Extend the WithdrawalsItem type to include custom properties
interface ExtendedWithdrawalsItem {
  index: number;
  validator_index: number;
  receiver: {
    hash: string;
    implementation_name: null;
    implementations: null;
    is_contract: boolean;
    is_verified: boolean;
    name: null;
    ens_domain_name: null;
    private_tags: null;
    public_tags: null;
    watchlist_names: any[];
  };
  amount: string;
  block_number: number;
  timestamp: string;
  tx_hash: string;
  // Custom properties to store the original values
  transactionHash?: string;
  chainName?: string;
}

// Define the props for the list item component
type ListItemProps = {
  item: ExtendedWithdrawalsItem;
  view: 'list' | 'address' | 'block';
  isLoading?: boolean;
  key?: string; // Add key property
};

const OasysL2ChainWithdrawals = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [eventType, setEventType] = useState<EventType>('WITHDRAW');
  const [chainName, setChainName] = useState<string>(config.verse.bridge.l2ChainName);

  // Fetch withdrawal events
  const { data, isLoading, isError, pagination } = useBridgeEvents({
    page: currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    eventType,
    chainName,
  });

  // Fetch withdrawal counts and totals
  const countersQuery = useBridgeEventCounts({
    eventType,
    chainName,
  });

  // Increment the current page
  const handleNextPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage + 1);
  }, []);

  // Decrement the current page
  const handlePrevPage = useCallback(() => {
    setCurrentPage((prevPage) => prevPage - 1);
  }, []);

  // Reset the current page to the first page
  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Transform withdrawal events to match the component's expected format
  const transformedItems = data.map((event, idx) => {
    return {
      // Use blockNumber as index (must be a number)
      index: parseInt(event.blockNumber) || 0,
      // Use a placeholder for validator_index
      validator_index: 0,
      receiver: {
        hash: event.to,
        implementation_name: null,
        implementations: null,
        is_contract: false,
        is_verified: false,
        name: null,
        ens_domain_name: null,
        private_tags: null,
        public_tags: null,
        watchlist_names: [],
      },
      amount: event.amount,
      block_number: parseInt(event.blockNumber) || 0,
      timestamp: event.timestamp,
      tx_hash: event.transactionHash,
      // Store the original values in custom properties
      transactionHash: event.transactionHash,
      chainName: event.chainName,
    } as ExtendedWithdrawalsItem;
  });

  // Define the content to display based on the screen size
  const content = transformedItems.length > 0 ? (
    <>
      {/* Render the list view for small screens */}
      <Box display={{ base: 'block', lg: 'none' }}>
        {transformedItems.map((item, index) => (
          <OasysL2ChainWithdrawalsListItem
            key={item.block_number + String(index)}
            item={item}
            view="list"
            isLoading={isLoading}
          />
        ))}
      </Box>

      {/* Render the table view for large screens */}
      <Box display={{ base: 'none', lg: 'block' }}>
        <OasysL2ChainWithdrawalsTable
          items={transformedItems}
          view="list"
          top={pagination.hasNextPage || pagination.hasPreviousPage ? ACTION_BAR_HEIGHT_DESKTOP : 0}
          isLoading={isLoading}
        />
      </Box>
    </>
  ) : null;

  // Summary text with withdrawal counts and totals
  const text = (() => {
    return (
      <Skeleton loading={ countersQuery.isPlaceholderData || isLoading } display="flex" flexWrap="wrap">
        {countersQuery.data && (
          <Text lineHeight={{ base: '24px', lg: '32px' }}>
            {BigNumber(countersQuery.data.withdrawal_count).toFormat()} withdrawals have been processed
            and {getCurrencyValue({ value: countersQuery.data.withdrawal_sum }).valueStr} {currencyUnits.ether} has been withdrawn
          </Text>
        )}
      </Skeleton>
    );
  })();

  // Create a pagination object compatible with StickyPaginationWithText
  const paginationControl = {
    isVisible: pagination.hasNextPage || pagination.hasPreviousPage,
    currentPage: pagination.currentPage,
    onNextPageClick: handleNextPage,
    onPrevPageClick: handlePrevPage,
    hasNextPage: pagination.hasNextPage,
    hasPrevPage: pagination.hasPreviousPage,
    page: pagination.currentPage,
    resetPage: resetPage,
    hasPages: pagination.hasNextPage || pagination.hasPreviousPage,
    canGoBackwards: pagination.hasPreviousPage,
    isLoading: isLoading,
  };

  const actionBar = <StickyPaginationWithText text={text} pagination={paginationControl} />;

  return (
    <>
      {/* Page title */}
      <PageTitle title={`Withdrawals (L2${nbsp}${rightLineArrow}${nbsp}L1)`} withTextAd />
      {/* Main content display */}
      <DataListDisplay
        isError={isError}
        itemsNum={transformedItems.length}
        emptyText="There are no withdrawals."
        actionBar={actionBar}
      >
        {content}
      </DataListDisplay>
    </>
  );
};

export default OasysL2ChainWithdrawals;
