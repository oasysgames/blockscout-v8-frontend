import React from 'react';

import { PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Button } from 'toolkit/chakra/button';

import NetworkMenuContent from './NetworkMenuContent';
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
        <Button
          marginLeft="auto"
          overflow="hidden"
          width={{ base: '36px', lg: isCollapsed === false ? '36px' : '0px', xl: isCollapsed ? '0px' : '36px' }}
          variant={ menu.open ? 'solid' : 'outline' }
          onClick={ menu.onToggle }
        >
          Menu
        </Button>
      </PopoverTrigger>
      <NetworkMenuContent items={ menu.data } tabs={ menu.availableTabs }/>
    </PopoverRoot>
  );
};

export default React.memo(NetworkMenu);
