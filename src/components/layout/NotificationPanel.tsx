'use client';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePanelStore } from '@/stores/panel-store';
import { ArrowRight, Bell } from 'lucide-react';

export function NotificationPanel() {
  const notificationOpen = usePanelStore((s) => s.notificationOpen);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      usePanelStore.setState({ notificationOpen: false });
    }
  };

  return (
    <Drawer
      open={notificationOpen}
      onOpenChange={handleOpenChange}
      direction='right'
    >
      <DrawerContent className='w-80 sm:max-w-80'>
        <DrawerDescription />
        <DrawerHeader className='flex flex-row items-center justify-between border-b border-muted px-4 py-5'>
          <div className='flex items-center gap-2'>
            <Bell className='h-5 w-5 text-fg-primary' />
            <DrawerTitle className='text-sm font-semibold text-fg-primary'>
              Notifications
            </DrawerTitle>
          </div>
          <DrawerClose className='text-icon-default hover:text-icon-active transition-colors text-sm'>
            <ArrowRight className='h-5 w-5' />
          </DrawerClose>
        </DrawerHeader>
        <ScrollArea className='flex-1'>
          <div className='flex h-full min-h-[200px] items-center justify-center'>
            <span className='text-sm text-fg-muted'>No notifications</span>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
