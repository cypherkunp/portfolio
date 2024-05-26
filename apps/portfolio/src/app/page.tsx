import { ClientOnly } from '@/components/client-only';
import Feature from '@/components/feature';
import Marquee from '@/components/marquee';
import QuoteBlock from '@/components/quote-block';
import { RESUME_DATA } from '@/data/resume-data';
import useCustomCursor from '@/hooks/use-custom-cursor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} | ${RESUME_DATA.about}`,
  description: RESUME_DATA.summary,
};

export default function Page() {
  return (
    <main className="gap-100 flex flex-col items-center">
      <section className="relative mt-16">
        <div
          className="from-purple via-lilac to-purple absolute inset-0 z-0 aspect-[1/0.2] w-full transform-gpu
            rounded-[20%] bg-gradient-to-r opacity-[0.2] blur-[80px]"
        ></div>

        <QuoteBlock />
      </section>
      <Feature>
        <section className="w-full">
          <div className="text-warm-white border-1 flex w-full items-center justify-between rounded-lg border-rose-300 p-4">
            <div>
              <div className="text-4xl">15 years</div>
              <div className="text-xs text-gray-400">Experience</div>
            </div>
            <div>
              <div className="text-4xl">React & Node.js</div>
              <div className="text-xs text-gray-400">Core Tech Stack</div>
            </div>
            <div>
              <div className="text-4xl">London</div>
              <div className="text-xs text-gray-400">Location</div>
            </div>
            <div>
              <div className="text-4xl">English & Hindi</div>
              <div className="text-xs text-gray-400">Languages</div>
            </div>
          </div>
          <div className="relative flex w-auto overflow-x-hidden overflow-y-visible"></div>
        </section>
      </Feature>
    </main>
  );
}
