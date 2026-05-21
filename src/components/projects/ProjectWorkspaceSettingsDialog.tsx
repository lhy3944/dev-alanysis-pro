"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectWorkspaceSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectWorkspaceSettingsDialog({
  open,
  onOpenChange,
}: ProjectWorkspaceSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>프로젝트 설정</DialogTitle>
        </DialogHeader>
        <div className="text-fg-muted py-4 text-center text-sm">
          프로젝트 설정 기능은 추후 제공될 예정입니다.
        </div>
      </DialogContent>
    </Dialog>
  );
}
