import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AgentDomain } from "@/types/agent";

interface AgentDeepLinkButtonProps {
  projectId: string;
  commitId: string | undefined;
  domain: AgentDomain;
  /** 기본 "더보기". 명시적으로 다른 label 을 주고 싶을 때만 사용. */
  label?: string;
  className?: string;
}

const DOMAIN_ROUTES: Record<AgentDomain, string> = {
  "code-impact": "code-impact",
  requirement: "requirement",
  "unit-test": "unit-test",
  "system-test": "system-test",
};

export function AgentDeepLinkButton({
  projectId,
  commitId,
  domain,
  label = "더보기",
  className,
}: AgentDeepLinkButtonProps) {
  const href = commitId
    ? `/projects/${projectId}/${DOMAIN_ROUTES[domain]}?commit=${commitId}`
    : `/projects/${projectId}/${DOMAIN_ROUTES[domain]}`;
  return (
    <Button
      asChild
      variant="ghost"
      size="xs"
      className={cn(
        "text-fg-muted hover:text-fg-primary hover:bg-transparent dark:hover:bg-transparent -mr-1.5 px-1.5 font-medium transition-colors",
        className,
      )}
    >
      <Link href={href}>
        {label}
        <ChevronRight className="size-3" />
      </Link>
    </Button>
  );
}
