"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  ExternalLink,
  FlaskConical,
  GitBranch,
  Home,
  Info,
  Microscope,
  Search,
  Shield,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useState } from "react";
import { Button } from "../ui/button";

interface LabsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const labFeatures = [
  {
    name: "AISE-DEEPWiki",
    description:
      "Git 정보을 입력하면 해당 저장소 소스를 분석해 자동으로 wiki 페이지를 생성해주는 서비스.",
    tag: "Beta",
    link: "#",
    icon: BookOpen,
    iconColor: "bg-blue-500/10 text-blue-500",
  },
  {
    name: "HS-Excel-Analysis",
    description:
      "HS사업부 엑셀파일로부터 코드 diff 이미지 추출·변경 전/후 코드 인식까지 자동화해 변경점 요약 및 Impact Analysis를 도출하는 서비스.",
    tag: "Alpha",
    link: "#",
    icon: Microscope,
    iconColor: "bg-green-500/10 text-green-500",
  },
  {
    name: "Red Team Agent",
    description: "보고서 비평 AI 에이전트.",
    tag: "Beta",
    link: "#",
    icon: ShieldAlert,
    iconColor: "bg-red-500/10 text-red-500",
  },
  {
    name: "BlockChain",
    description: "스마트 컨트랙트 및 분산 원장을 관리하고 분석하는 에이전트.",
    tag: "Beta",
    link: "#",
    icon: GitBranch,
    iconColor: "bg-purple-500/10 text-purple-500",
  },
  {
    name: "SAIS 프레임워크",
    description:
      "보안 아키텍처 및 인프라 표준을 통합 분석하는 프레임워크 에이전트.",
    tag: "Experimental",
    link: "#",
    icon: Shield,
    iconColor: "bg-teal-500/10 text-teal-500",
  },
  {
    name: "스마트홈 허브",
    description: "가정 내 IoT 기기들을 지능적으로 제어하고 모니터링합니다.",
    tag: "Experimental",
    link: "#",
    icon: Home,
    iconColor: "bg-orange-500/10 text-orange-500",
  },
  {
    name: "닭꼬치 Research",
    description: "다양한 리서치 주제를 빠르고 심도있게 탐색하는 연구 에이전트.",
    tag: "Experimental",
    link: "#",
    icon: Search,
    iconColor: "bg-yellow-500/10 text-yellow-500",
  },
  {
    name: "MCP Server Tester",
    description:
      "MCP(Model Context Protocol) 서버 기능을 검증하고 테스트합니다.",
    tag: "Experimental",
    link: "#",
    icon: Terminal,
    iconColor: "bg-cyan-500/10 text-cyan-500",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export function LabsDialog({ open, onOpenChange }: LabsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSearchQuery("");
    }
    onOpenChange(newOpen);
  };

  const filteredFeatures = labFeatures.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[1200px] sm:max-w-[1200px] w-[90vw] sm:w-[90vw] md:w-[80vw] lg:w-full h-[80vh] flex flex-col gap-0 p-0 overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-4 text-left">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-fg-primary">
            <FlaskConical className="h-5 w-5 text-accent-primary" />
            Labs
          </DialogTitle>
          <DialogDescription className="text-fg-secondary">
            실험적 기능을 미리 체험해보세요.
          </DialogDescription>
        </DialogHeader>
        {/* Sticky filter + count bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-6 shrink-0">
          <div className="relative w-full sm:flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-fg-secondary pointer-events-none z-10" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색"
              className="pl-8 h-10"
            />
          </div>
          <span className="text-xs text-fg-secondary whitespace-nowrap">
            <span className="text-fg-primary font-semibold mr-1">
              {labFeatures.length}
            </span>
            개의 실험이 세상을 바꿀 준비를 하고 있습니다.
          </span>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {filteredFeatures.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <Info className="w-8 h-8 text-accent-primary" />
                <span className="text-sm">검색 결과가 없습니다.</span>
              </div>
            </div>
          )}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredFeatures.map((feature) => (
              <motion.button
                key={feature.name}
                variants={cardVariants}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open(feature.link || "#", "_blank")}
                className="group flex flex-col justify-between rounded-xl border border-line-primary p-5 transition-colors duration-200 cursor-pointer text-left hover:bg-canvas-secondary focus:outline-none h-full"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-fg-primary">
                        {feature.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-fg-secondary">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0"
                        >
                          {feature.tag}
                        </Badge>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded-lg ${feature.iconColor} shrink-0`}
                    >
                      <feature.icon className="w-6 h-6 group-hover:scale-125 transition-transform duration-200" />
                    </div>
                  </div>
                  <span className="text-sm text-fg-secondary leading-relaxed line-clamp-3">
                    {feature.description}
                  </span>
                </div>
                <div className="mt-4 flex justify-end">
                  <ExternalLink className="w-4 h-4 text-fg-secondary opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all duration-200" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LabsTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          variant={"ghost"}
          className="text-icon-default hover:text-icon-active transition-colors"
        >
          <FlaskConical className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Labs</TooltipContent>
    </Tooltip>
  );
}
