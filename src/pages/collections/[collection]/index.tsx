import { CollectionWithRelations } from '$lib/api/schemas/collection';
import { File } from '$lib/api/schemas/file';
import FileRenderer from '$lib/components/FileRenderer';
import Footer from '$lib/components/Footer';
import Navbar from '$lib/components/Navbar';
import { prisma } from '$lib/prisma';
import { combineClasses, ensureQueryParam } from '$lib/util';
import { FolderIcon, FolderOpenIcon, MenuIcon } from '@heroicons/react/outline';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps<{
  collection: CollectionWithRelations;
  covers: Record<string, File | null>;
}> = async ({ query }) => {
  const collectionUrlName = ensureQueryParam(query.collection);
  if (!collectionUrlName) {
    return {
      notFound: true,
    };
  }

  const collection = await prisma.collection.findFirst({
    where: {
      urlName: collectionUrlName,
    },
    include: {
      albums: true,
    },
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  const covers: Record<string, File | null> = {};

  for (const album of collection.albums) {
    if (album.coverId) {
      covers[album.id] = await prisma.file.findFirst({
        where: {
          id: album.coverId,
          internal: false,
        },
      });
    }
  }

  return {
    props: {
      collection,
      covers,
    },
  };
};

const CollectionPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ collection, covers }) => {
  return (
    <>
      <Navbar />

      <div className="container mx-auto space-y-4 px-8 min-h-screen">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href="/collections">
                <a>
                  <FolderOpenIcon className="w-5 h-5 mr-1"></FolderOpenIcon>
                  Collections
                </a>
              </Link>
            </li>
            <li>
              <FolderIcon className="w-5 h-5 mr-1"></FolderIcon>
              {collection.title}
            </li>
          </ul>
        </div>
        <h1 className="text-6xl pb-6 text-neutral font-bold">
          {collection.title}
        </h1>
        <div
          className={combineClasses(
            'grid grid-cols-1 gap-4',
            // Only show the grid if there are multiple albums
            collection.albums.length > 1 ? 'lg:grid-cols-2 2xl:grid-cols-3' : ''
          )}
        >
          {collection.albums.length === 0 ? (
            <p className="text-neutral text-xl">
              This collection does not have any albums
            </p>
          ) : (
            collection.albums.map((album) => (
              <div
                className={`card bg-base-100 text-white min-h-[256px] shadow-md hover:shadow-xl ${
                  !!covers[album.id] ? 'image-full' : 'bg-neutral'
                }`}
                key={album.id}
              >
                {covers[album.id] && (
                  <figure className="w-1/2">
                    <FileRenderer
                      file={covers[album.id]!}
                      alt={`Cover of ${album.title}`}
                      layout="fill"
                    ></FileRenderer>
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title text-2xl">
                    <Link
                      href={`/collections/${collection.urlName}/${album.urlName}`}
                    >
                      {album.title}
                    </Link>
                  </h2>
                  <p className="font-light text-gray-300">
                    {album.description || 'No description'}
                  </p>
                  <div className="card-actions justify-end">
                    <Link
                      href={`/collections/${collection.urlName}/${album.urlName}`}
                    >
                      <a className="btn btn-primary">View</a>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer></Footer>
    </>
  );
};

export default CollectionPage;
