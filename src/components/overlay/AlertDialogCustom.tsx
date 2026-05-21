"use client";

import { CircleCheck, CircleAlert, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AlertType = "success" | "warning" | "info";

interface AlertDialogCustomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: AlertType;
  title: string;
  description: string;
}

const alertConfig: Record<AlertType, { icon: typeof CircleCheck; className: string }> = {
  success: { icon: CircleCheck, className: "text-accent-primary" },
  warning: { icon: CircleAlert, className: "text-amber-500" },
  info: { icon: Info, className: "text-blue-500" },
};

export function AlertDialogCustom({
  open,
  onOpenChange,
  type = "info",
  title,
  description,
}: AlertDialogCustomProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px]">
        <DialogHeader className="flex flex-col items-center gap-3 text-center">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-canvas-surface ${config.className}`}>
            <Icon className="h-6 w-6" />
          </div>
          <DialogTitle className="text-fg-primary">{title}</DialogTitle>
          <DialogDescription className="text-fg-secondary">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-center">
          <Button onClick={() => onOpenChange(false)}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
