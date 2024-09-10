import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import React from 'react';
import { useTranslations } from 'next-intl';

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
          <AccordionTrigger className="text-decoration-none text-left">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
