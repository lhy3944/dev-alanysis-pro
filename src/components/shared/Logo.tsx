"use client";

import Link from "next/link";

interface LogoProps {
  showName?: boolean;
}

export function Logo({ showName = false }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2">
      {/* 라이트 모드 로고 */}
      {/* <Image
        src="/logo_icon_light.png"
        alt="AISE logo"
        width={36}
        height={36}
        priority
        className="dark:hidden size-6 sm:size-9"
      /> */}

      {/* 다크 모드 로고 */}
      {/* <Image
        src="/logo_icon.png"
        alt="AISE logo"
        width={36}
        height={36}
        priority
        className="hidden dark:block size-6 sm:size-9"
      /> */}
      <div className="flex items-center gap-1.5 ml-1 select-none">
        <span className="text-sm sm:text-xl font-bold tracking-tight text-fg-primary">
          DevAnalysis
        </span>
        <span className="rounded-[4px] bg-accent-primary p-1.5 py-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-canvas-primary leading-none">
          pro
        </span>
      </div>
    </Link>
  );
}
