import NavButtonLink from './nav-button-link';
import NavLink from './nav-link';

export default function Navbar() {
  return (
    <>
      <div className="flex gap-4">
        <NavLink href="home" text="Home" />
        <NavLink href="gallery" text="Gallery" />
        <NavLink href="setup" text="Setup" />
        <NavLink href="contact" text="Contact" />
      </div>
      <div className="flex items-center justify-between gap-10 py-4 md:gap-6">
        <NavButtonLink text="Resume" target="_self" type="secondary" ring={false} href="/resume" />
        <NavButtonLink text="Blog" target="_self" type="primary" ring={false} href="/blog" />
      </div>
    </>
  );
}
