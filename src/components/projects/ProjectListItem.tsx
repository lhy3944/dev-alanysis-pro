'use client';

import { Badge } from '@/components/ui/badge';
import {
  ANALYSIS_TYPE_COLORS,
  ANALYSIS_TYPE_LABELS,
  LIFECYCLE_COLORS,
  LIFECYCLE_LABELS,
} from '@/constants/project';
import { formatRelativeTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Project } from '@/types/project';
import { Box, Clock, Users } from 'lucide-react';

interface ProjectListItemProps {
  project: Project;
}

export function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <div className='group border-line-primary bg-canvas-surface hover:border-accent-primary/50 flex items-center gap-4 rounded-lg border px-5 py-3.5 transition-all'>
      <div className='bg-accent-primary/10 flex size-9 shrink-0 items-center justify-center rounded-md'>
        <Box className='text-accent-primary size-4' />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-1.5'>
          <h3 className='text-fg-primary truncate text-sm font-semibold'>
            {project.name}
          </h3>
          <Badge
            variant='ghost'
            className={cn(
              LIFECYCLE_COLORS[project.lifecycle_status],
              'hidden shrink-0 px-2 py-0 text-[10px] sm:inline-flex',
            )}
          >
            {LIFECYCLE_LABELS[project.lifecycle_status]}
          </Badge>
          <Badge
            variant='ghost'
            className={cn(
              ANALYSIS_TYPE_COLORS[project.analysis_type],
              'hidden shrink-0 px-2 py-0 text-[10px] sm:inline-flex',
            )}
          >
            {ANALYSIS_TYPE_LABELS[project.analysis_type]}
          </Badge>
        </div>

        <div className='mt-1 flex flex-col gap-0.5 sm:hidden'>
          <div className='flex items-center gap-1'>
            <Badge
              variant='ghost'
              className={cn(LIFECYCLE_COLORS[project.lifecycle_status], 'px-1.5 py-0 text-[10px]')}
            >
              {LIFECYCLE_LABELS[project.lifecycle_status]}
            </Badge>
            <Badge
              variant='ghost'
              className={cn(ANALYSIS_TYPE_COLORS[project.analysis_type], 'px-1.5 py-0 text-[10px]')}
            >
              {ANALYSIS_TYPE_LABELS[project.analysis_type]}
            </Badge>
          </div>
          <span className='text-fg-muted text-[11px]'>
            {formatRelativeTime(project.updated_at)}
          </span>
        </div>

        {project.description && (
          <p className='text-fg-secondary mt-0.5 hidden truncate text-sm sm:block'>
            {project.description}
          </p>
        )}
      </div>

      <div className='text-fg-muted hidden shrink-0 items-center gap-4 text-sm lg:flex'>
        <span className='flex items-center gap-1'>
          <Clock className='size-4' />
          {formatRelativeTime(project.updated_at)}
        </span>
        <span className='flex items-center gap-1'>
          <Users className='size-4' />
          {project.member_count}
        </span>
      </div>
    </div>
  );
}
