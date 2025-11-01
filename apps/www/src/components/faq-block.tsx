import React from 'react';
import { useTranslations } from 'next-intl';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface Faq {
  question: string;
  answer: string;
}

export function FaqBlock() {
  const t = useTranslations('HomePage.faqBlock');
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
