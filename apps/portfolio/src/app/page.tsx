import { ClientOnly } from '@/components/client-only';
import Feature from '@/components/feature';
import Marquee from '@/components/marquee';
import ContentBlock from '@/components/content-block';
import { RESUME_DATA } from '@/data/resume-data';
import useCustomCursor from '@/hooks/use-custom-cursor';
import { Metadata } from 'next';
import { Section } from '@/components/section';

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} | ${RESUME_DATA.about}`,
  description: RESUME_DATA.summary,
};

export default function Page() {
  return (
    <main className="flex flex-col items-start justify-start gap-20">
      <Section>
        <ContentBlock
          title="Devvrat Shukla"
          description={'I am a full stack developer. Product Strategist'}
        />
      </Section>
      <Feature flag="enable">
        <section className="w-full"></section>
      </Feature>
    </main>
  );
}
