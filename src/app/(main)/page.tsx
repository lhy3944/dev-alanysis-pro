import { HeroSection } from '@/components/landing/HeroSection';
import { AgentShowcase } from '@/components/landing/AgentShowcase';
import { Footer } from '@/components/layout/Footer';
import { OrchestrationShowcase } from '@/components/landing/OrchestrationShowcase';

export default function LandingPage() {
  return (
    <div className='flex min-h-screen flex-col bg-canvas-primary'>
      <main className='flex flex-1 flex-col'>
        <HeroSection />
        <OrchestrationShowcase autoPlay={true} interval={5000} />
        <AgentShowcase />
      </main>
      <Footer />
    </div>
  );
}
