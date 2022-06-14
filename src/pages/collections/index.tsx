import { CollectionWithRelations } from '$lib/api/schemas/collection';
import FileRenderer from '$lib/components/FileRenderer';
import Footer from '$lib/components/Footer';
import Navbar from '$lib/components/Navbar';
import { prisma } from '$lib/prisma';
import { combineClasses } from '$lib/util';
import { FolderOpenIcon } from '@heroicons/react/outline';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { DefaultSeo } from 'next-seo';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps<{
  collections: CollectionWithRelations[];
}> = async () => {
  const collections = (await prisma.collection.findMany({
    include: {
      cover: true,
    },
  })) as unknown as CollectionWithRelations[];

  return {
    props: {
      collections,
    },
  };
};

const CollectionsListPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ collections }) => {
  return (
    <>
      <DefaultSeo title="Collections" />
      <Navbar />

      <div className="container min-h-screen px-8 mx-auto space-y-4">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <FolderOpenIcon className="w-5 h-5 mr-1"></FolderOpenIcon>
              Collections
            </li>
          </ul>
        </div>

        <h1 className="pb-6 text-6xl font-bold">Collections</h1>
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
                collection.cover ? 'image-full' : 'bg-neutral'
              }`}
              key={collection.id}
            >
              {collection.cover && (
                <figure className="w-1/2">
                  <FileRenderer
                    file={collection.cover!}
                    alt={`Cover of ${collection.title}`}
                    layout="fill"
                  ></FileRenderer>
                </figure>
              )}
              <div className="card-body">
                <h2 className="text-2xl card-title">
                  <Link href={`/collections/${collection.urlName}`}>
                    {collection.title}
                  </Link>
                </h2>
                <p className="font-light text-gray-300">
                  {collection.description || 'No description'}
                </p>
                <div className="justify-end card-actions">
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

export default CollectionsListPage;
