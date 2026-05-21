'use client';

import { AppsDropdown } from '@/components/overlay/AppsDropdown';
import { LabsDialog, LabsTrigger } from '@/components/overlay/LabsDialog';
import { Logo } from '@/components/shared/Logo';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { SettingsDialog } from '@/components/overlay/SettingsDialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { headerTabsConfig, SIDEBAR_ACTIONS } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [labsOpen, setLabsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const actionHandlers: Record<string, () => void> = {
    settings: () => setSettingsOpen(true),
  };

  const BOTTOM_ICONS = SIDEBAR_ACTIONS
    .filter((action) => action.id !== 'project')
    .map((action) => ({
      ...action,
      onClick: actionHandlers[action.id] ?? (() => {}),
    }));

  return (
    <>
      <Drawer direction="left" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-icon-default hover:text-icon-active hover:bg-canvas-surface"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-[280px] sm:w-[320px] p-0 flex flex-col border-r-line-primary bg-canvas-primary h-full">
          <DrawerHeader className="p-4 border-b border-line-primary text-left">
            <DrawerTitle asChild>
              <div
                onClick={() => setOpen(false)}
                className="cursor-pointer inline-block"
              >
                <Logo showName={true} />
              </div>
            </DrawerTitle>
            <DrawerDescription />
          </DrawerHeader>
          {/* Navigation */}
          <div className="flex flex-col py-4 flex-1">
            {headerTabsConfig.map((tab) => {
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors hover:bg-canvas-secondary hover:text-fg-primary',
                    isActive
                      ? 'bg-canvas-surface text-accent-primary border-r-4 border-accent-primary'
                      : 'text-fg-secondary',
                  )}
                >
                  <tab.icon
                    className={cn('h-5 w-5', isActive && 'text-accent-primary')}
                  />
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Bottom */}
          <div className="p-4 border-t border-line-primary flex items-center gap-2">
            {BOTTOM_ICONS.map(({ id, icon: Icon, label, onClick }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-icon-default hover:text-icon-active"
                    onClick={onClick}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{label}</TooltipContent>
              </Tooltip>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <AppsDropdown contentClassName="fixed bottom-20 left-4 right-4 !w-auto origin-bottom" />
              <LabsTrigger onClick={() => setLabsOpen(true)} />
              <ThemeToggle
                checked={resolvedTheme === 'dark'}
                onCheckedChange={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
              />
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <LabsDialog open={labsOpen} onOpenChange={setLabsOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
