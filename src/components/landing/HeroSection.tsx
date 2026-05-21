import { Button } from "@/components/ui/button";
import { BookOpen, Play } from "lucide-react";
import Link from "next/link";
import { AuroraText } from "../ui/aurora-text";
import { TextAnimate } from "../ui/text-animate";

export function HeroSection() {
  return (
    <section className="flex flex-col items-center gap-7 px-12 py-12">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-center text-6xl font-semibold tracking-wide text-fg-primary">
          DevAnalysis
          <AuroraText className="absolute bottom-0 left-3">PRO</AuroraText>
        </h1>
        <div className="max-w-[560px] text-center text-md font-semibold leading-relaxed text-fg-secondary">
          <TextAnimate animation="slideLeft" by="character">
            AI 에이전트와 함께 개발 프로세스를 최적화하여
          </TextAnimate>
          <TextAnimate animation="slideLeft" by="character">
            더 빠르고 효율적으로 진행하세요.
          </TextAnimate>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button asChild size="lg" className="gap-2 rounded-lg px-7">
          <Link href="/chat">
            <Play className="h-4 w-4" />
            Get Started
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          className="gap-2 rounded-lg px-7"
          variant={"outline"}
        >
          <Link href="/chat">
            <BookOpen className="h-4 w-4" />
            Documentation
          </Link>
        </Button>
        {/* <Button
          variant='outline'
          size='lg'
          className='gap-2 rounded-lg border-line-primary px-7'
        >
          <Play className='h-4 w-4' />
          Watch Demo
        </Button> */}
      </div>
    </section>
  );
}
