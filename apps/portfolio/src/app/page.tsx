import { ClientOnly } from '@/components/client-only';
import Feature from '@/components/feature';
import Marquee from '@/components/marquee';
import ContentBlock from '@/components/content-block';
import { RESUME_DATA } from '@/data/resume-data';
import useCustomCursor from '@/hooks/use-custom-cursor';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} | ${RESUME_DATA.about}`,
  description: RESUME_DATA.summary,
};

export default function Page() {
  return (
    <main className="gap-100 flex flex-col items-start">
      <section className="relative mt-16">
        <div
          className="from-purple via-lilac to-purple absolute inset-0 z-0 aspect-[1/0.2] w-full transform-gpu
            rounded-[20%] bg-gradient-to-r opacity-[0.2] blur-[80px]"
        ></div>

        <ContentBlock />
      </section>
      <Feature flag="enable">
        <section className="w-full"></section>
      </Feature>
    </main>
  );
}
