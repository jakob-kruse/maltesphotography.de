import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="footer p-10 text-base-content container mx-auto">
      <div>
        <Image src="/svg/Logo.svg" width={64} height={64} alt="Logo"></Image>
        <p>maltesphotography.de</p>
      </div>
      <div>
        <span className="footer-title">Social Media</span>
        <Link href="https://www.instagram.com/maltes_photography/">
          <a className="link link-hover">Instagram</a>
        </Link>
        <Link href="https://twitter.com/malteofficial">
          <a className="link link-hover">Twitter</a>
        </Link>
        <Link href="https://www.youtube.com/channel/UCew0fMSDrj2tiOCtBO9MfPw">
          <a className="link link-hover">Youtube</a>
        </Link>
        <Link href="https://www.facebook.com/maltes_photography-108059430670518/">
          <a className="link link-hover">Facebook</a>
        </Link>
      </div>

      <div>
        <span className="footer-title">Legal</span>
        <Link href="/privacy-policy">
          <a className="link link-hover">Privacy policy</a>
        </Link>
        <Link href="/imprint">
          <a className="link link-hover">Impressum</a>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
