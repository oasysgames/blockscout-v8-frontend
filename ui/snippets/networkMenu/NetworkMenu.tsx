import React from 'react';

import { PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

import NetworkMenuButton from './NetworkMenuButton';
import NetworkMenuContentDesktop from './NetworkMenuContentDesktop';
import useNetworkMenu from './useNetworkMenu';
interface Props {
  isCollapsed?: boolean;
}

const NetworkMenu = ({ isCollapsed }: Props) => {

  const menu = useNetworkMenu();

  return (
    <PopoverRoot positioning={{ placement: 'bottom-start', offset: { mainAxis: 6 } }}
      lazyMount
      open={ menu.open }
      onOpenChange={ menu.onOpenChange }>
      <PopoverTrigger>
        <NetworkMenuButton
          marginLeft="auto"
          overflow="hidden"
          width={{ base: '36px', lg: isCollapsed === false ? '36px' : '0px', xl: isCollapsed ? '0px' : '36px' }}
          isActive={ menu.open }
          onClick={ menu.onToggle }
        />
      </PopoverTrigger>
      <NetworkMenuContentDesktop items={ menu.data } tabs={ menu.availableTabs }/>
    </PopoverRoot>
  );
};

export default React.memo(NetworkMenu);
