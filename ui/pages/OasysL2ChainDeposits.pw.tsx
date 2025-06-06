import React from 'react';

import { data as withdrawalsData } from 'mocks/optimism/withdrawals';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import OasysL2ChainDeposits from './OasysL2ChainDeposits';

test('base view +@mobile', async({ render, mockEnvs, mockTextAd, mockApiResponse }) => {
  await mockEnvs(ENVS_MAP.beaconChain);
  await mockTextAd();
  await mockApiResponse('general:optimistic_l2_withdrawals', withdrawalsData);
    await mockApiResponse('general:optimistic_l2_txn_batches_count', 397);
  const component = await render(<OasysL2ChainDeposits/>);
  await expect(component).toHaveScreenshot();
});
