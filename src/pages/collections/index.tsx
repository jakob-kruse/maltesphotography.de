import { Collection } from '$lib/api/schemas/collection';
import { File } from '$lib/api/schemas/file';
import FileRenderer from '$lib/components/frontend/FileRenderer';
import Footer from '$lib/components/frontend/Footer';
import Navbar from '$lib/components/frontend/Navbar';
import { prisma } from '$lib/prisma';
import { combineClasses } from '$lib/util';
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/outline';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps<{
  collections: Collection[];
  covers: Record<string, File | null>;
}> = async () => {
  const collections = await prisma.collection.findMany();

  const covers: Record<string, File | null> = {};

  for (const collection of collections) {
    if (collection.coverId) {
      covers[collection.id] = await prisma.file.findFirst({
        where: {
          id: collection.coverId,
          internal: false,
        },
      });
    }
  }

  return {
    props: {
      collections,
      covers,
    },
  };
};

const CollectionsPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ collections, covers }) => {
  return (
    <>
      <Navbar />

      <div className="container mx-auto space-y-4 px-8 min-h-screen">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <FolderOpenIcon className="w-5 h-5 mr-1"></FolderOpenIcon>
              Collections
            </li>
          </ul>
        </div>

        <h1 className="text-6xl pb-6 text-neutral font-bold">Collections</h1>
        <div
          className={combineClasses(
            'grid grid-cols-1 gap-4',
            // Only show the grid if there are multiple albums
            collections.length > 1 ? 'lg:grid-cols-2 2xl:grid-cols-3' : ''
          )}
        >
          {collections.map((collection) => (
            <div
              className={`card bg-base-100 text-white min-h-[256px] shadow-sm hover:shadow-md ${
                !!covers[collection.id] ? 'image-full' : 'bg-neutral'
              }`}
              key={collection.id}
            >
              {covers[collection.id] && (
                <figure className="w-1/2">
                  <FileRenderer
                    file={covers[collection.id]!}
                    alt={`Cover of ${collection.title}`}
                    layout="fill"
                  ></FileRenderer>
                </figure>
              )}
              <div className="card-body">
                <h2 className="card-title text-2xl">
                  <Link href={`/collections/${collection.urlName}`}>
                    {collection.title}
                  </Link>
                </h2>
                <p className="font-light text-gray-300">
                  {collection.description || 'No description'}
                </p>
                <div className="card-actions justify-end">
                  <Link href={`/collections/${collection.urlName}`}>
                    <a className="btn btn-primary">View</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer></Footer>
    </>
  );
};

export default CollectionsPage;
