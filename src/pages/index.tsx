import { Collection } from '$lib/api/schemas/collection';
import Footer from '$lib/components/frontend/Footer';
import Navbar from '$lib/components/frontend/Navbar';
import { prisma } from '$lib/prisma';
import { ChevronDownIcon } from '@heroicons/react/outline';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps<{
  collections: Collection[];
}> = async () => {
  const collections = await prisma.collection.findMany({});

  return {
    props: {
      collections,
    },
  };
};

function Home({
  collections,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Navbar>
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn gap-2 btn-ghost rounded-btn">
            Collections
            <ChevronDownIcon className="w-5 h-5"></ChevronDownIcon>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-28"
          >
            {collections.map((collection) => (
              <li key={collection.id}>
                <Link href={`/collections/${collection.urlName}`}>
                  <a>{collection.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Navbar>

      <div className="fixed w-screen h-screen top-0 left-0 -z-10 bg-gradient-to-t from-red-100 to-transparent"></div>

      <div className="container mx-auto">
        <div className="hero min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hey!</h1>
              <p className="py-6">
                Ich bin ein passionierter Reisender und Fotograf. Außerdem
                interessiere ich mich für Technik. In der folgenden Übersicht
                kannst du dir meine Seite anschauen. Viel Spaß!
              </p>
              <Link href="/collections">
                <a className="btn btn-primary">View Collections</a>
              </Link>
            </div>
          </div>
        </div>

        <Footer></Footer>
      </div>
    </>
  );
}

export default Home;
