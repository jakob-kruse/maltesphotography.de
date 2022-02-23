import { prisma } from '$lib/prisma';
import AdminLayout from '$pages/admin/layout';
import { PencilIcon, PlusIcon, TemplateIcon } from '@heroicons/react/solid';
import { Collection } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import type { ReactElement } from 'react';

function EmptyState() {
  return (
    <div className="text-center my-4">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No collections</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new collection.
      </p>
      <div className="mt-6">
        <Link href="/admin/collections/create">
          <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Create new Collection
          </a>
        </Link>
      </div>
    </div>
  );
}

function CollectionList({ collections }: { collections: Collection[] }) {
  if (collections.length === 0) {
    return <EmptyState></EmptyState>;
  }
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {collections.map((collection) => (
        <li
          key={collection.id}
          className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
        >
          <div className="flex-1 truncate p-6">
            <h3 className="text-gray-900 text-sm font-medium truncate">
              {collection.name}
            </h3>
            <p className="mt-1 text-gray-500 text-sm truncate">
              {collection.description || 'No description'}
            </p>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="w-0 flex-1 flex">
                <Link href={`/admin/collections/${collection.id}/layout`}>
                  <a className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
                    <TemplateIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-3">Layout</span>
                  </a>
                </Link>
              </div>
              <div className="w-0 flex-1 flex">
                <Link href={`/admin/collections/${collection.id}/edit`}>
                  <a className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
                    <PencilIcon
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-3">Edit</span>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

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
export default function AdminCollections({
  collections,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div className="mb-5 pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Collections
        </h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link href="/admin/collections/create">
            <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Create new Collection
            </a>
          </Link>
        </div>
      </div>

      <CollectionList collections={collections}></CollectionList>
    </>
  );
}

AdminCollections.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
