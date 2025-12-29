import UnderlineText from './underline-text';

export default function HighlightBlock() {
  return (
    <div className="border-glow-stroke flex flex-col gap-4 rounded-xl border ">
      <p className="text-2xl font-semibold text-white ">Hey, I am Devvrat 👋.</p>
      <p className="text-xl font-semibold text-white ">
        I am a full stack developer. <UnderlineText>Product Strategist</UnderlineText>
      </p>
    </div>
  );
}
