import type { LucideIcon } from 'lucide-react';

interface AgentCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
}

export function AgentCard({ icon: Icon, name, description }: AgentCardProps) {
  return (
    <div className='group flex flex-col gap-3 rounded-xl border border-line-subtle p-6 transition-colors duration-200 hover:bg-card hover:border-accent-primary'>
      <div className='flex items-center gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary dark:bg-canvas-surface '>
          <Icon className='h-5 w-5 text-white transition-transform duration-200 group-hover:scale-125 ' />
        </div>
        <h3 className='text-sm font-semibold text-fg-primary'>{name}</h3>
      </div>
      <p className='text-sm leading-relaxed text-fg-secondary font-medium'>
        {description}
      </p>
      <div className='flex flex-1 items-end gap-1.5'>
        <span className='text-[11px] font-medium px-2 py-0.5 rounded bg-secondary'>
          Tag-1
        </span>
        <span className='text-[11px] font-medium px-2 py-0.5 rounded bg-secondary'>
          Tag-2
        </span>
      </div>
    </div>
  );
}
