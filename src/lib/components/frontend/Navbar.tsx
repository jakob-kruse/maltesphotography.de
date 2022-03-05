import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';

const Navbar: FC = ({ children }) => {
  return (
    <div className="navbar bg-transparent print:hidden">
      <Link href="/">
        <a className="mx-2 cursor-pointer">
          <Image src="/svg/Logo.svg" width={48} height={48} alt="Logo"></Image>
        </a>
      </Link>
      {children}
    </div>
  );
};

export default Navbar;
