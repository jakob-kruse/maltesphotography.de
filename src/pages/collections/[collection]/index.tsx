import { AlbumWithRelations } from '$lib/api/schemas/album';
import { CollectionWithRelations } from '$lib/api/schemas/collection';
import FileRenderer from '$lib/components/FileRenderer';
import Footer from '$lib/components/Footer';
import Navbar from '$lib/components/Navbar';
import { prisma } from '$lib/prisma';
import { combineClasses, ensureQueryParam } from '$lib/util';
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/outline';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps<{
  collection: CollectionWithRelations & { albums: AlbumWithRelations[] };
}> = async ({ query }) => {
  const collectionUrlName = ensureQueryParam(query.collection);
  if (!collectionUrlName) {
    return {
      notFound: true,
    };
  }

  const collection = (await prisma.collection.findFirst({
    where: {
      urlName: collectionUrlName,
    },
    include: {
      albums: {
        include: {
          cover: true,
        },
      },
    },
  })) as unknown as CollectionWithRelations & { albums: AlbumWithRelations[] };

  if (!collection) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
    },
  };
};

const AlbumsListPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ collection }) => {
  return (
    <>
      <Navbar />

      <NextSeo
        title={collection.title}
        description={collection.description || 'No description'}
      />

      <div className="container min-h-screen px-8 mx-auto space-y-4">
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
        <h1 className="pb-6 text-6xl font-bold">{collection.title}</h1>
        <div
          className={combineClasses(
            'grid grid-cols-1 gap-4',
            // Only show the grid if there are multiple albums
            collection.albums.length > 1 ? 'lg:grid-cols-2 2xl:grid-cols-3' : ''
          )}
        >
          {collection.albums.length === 0 ? (
            <p className="text-xl text-neutral">
              This collection does not have any albums
            </p>
          ) : (
            collection.albums.map((album: AlbumWithRelations) => (
              <div
                className={`card bg-base-100 text-white min-h-[256px] shadow-sm hover:shadow-md ${
                  album.cover ? 'image-full' : 'bg-neutral'
                }`}
                key={album.id}
              >
                {album.cover && (
                  <figure className="w-1/2">
                    <FileRenderer
                      file={album.cover!}
                      alt={`Cover of ${album.title}`}
                      layout="fill"
                    ></FileRenderer>
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="text-2xl card-title">
                    <Link
                      href={`/collections/${collection.urlName}/${album.urlName}`}
                    >
                      {album.title}
                    </Link>
                  </h2>
                  <p className="font-light text-gray-300">
                    {album.description || 'No description'}
                  </p>
                  <div className="justify-end card-actions">
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

export default AlbumsListPage;
