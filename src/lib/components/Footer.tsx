import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="container mt-8 p-10 mx-auto bg-base-300/50 footer text-base-content">
      <div className="leading-loose">
        <Image src="/svg/Logo.svg" width={64} height={64} alt="Logo"></Image>
        <p>maltesphotography.de</p>
        <p className="text-xs">
          Website by
          <Link href="https://github.com/jakob-kruse">
            <a className="text-accent"> Jakob Kruse</a>
          </Link>
        </p>
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
        <Link href="https://www.flickr.com/photos/maltes_photography">
          <a className="link link-hover">Flickr</a>
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
      <script data-host="https://my-analytics.eu" data-dnt="false" src="https://my-analytics.eu/js/script.js" id="ZwSg9rf6GA" async defer></script>
    </footer>
  );
};

export default Footer;
