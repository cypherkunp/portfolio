import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/accordion';
import { useTranslations } from 'next-intl';

interface Faq {
  question: string;
  answer: string;
}

export function FaqBlock() {
  const t = useTranslations('Blocks.faqBlock');
  const faqData = t.raw('list') as unknown as Faq[];

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqData.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-decoration-none text-left text-sm">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
