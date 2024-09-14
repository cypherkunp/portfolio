import React from 'react';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface CalloutProps {
  title: string;
  description: string | string[];
}

export default function Callout({ title, description }: CalloutProps) {
  return (
    <Alert>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-wrap break-words text-sm">
        {Array.isArray(description) ? (
          <ul className="list-disc pl-4">
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          description
        )}
      </AlertDescription>
    </Alert>
  );
}
