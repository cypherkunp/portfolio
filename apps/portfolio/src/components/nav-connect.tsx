import { GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react';
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Button } from './ui/button';

export default function NavConnect() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="p-0 text-white hover:text-gray-300">
          @Connect
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit border-gray-700 bg-gray-800">
        <div className="flex space-x-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
          >
            <GithubIcon className="h-6 w-6" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
          >
            <LinkedinIcon className="h-6 w-6" />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300"
          >
            <TwitterIcon className="h-6 w-6" />
          </a>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
