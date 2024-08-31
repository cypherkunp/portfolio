import React from 'react';
import UnderlineText from './underline-text';

export default function ContentBlock() {
  return (
    <div className="border-1 border-glow-stroke flex flex-col gap-4 rounded-xl ">
      <p className="text-2xl font-semibold text-white ">
        Devvrat is an Entrepreneur, who write code and loves to build.
      </p>
      <p className="text-md font-semibold text-white ">
        I am a full stack developer. <UnderlineText>Product Strategist</UnderlineText>
      </p>
    </div>
  );
}
