import { prisma } from '$lib/prisma';
import AdminLayout from '$pages/admin/layout';
import { PencilIcon, PlusIcon, TemplateIcon } from '@heroicons/react/solid';
import { Collection } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import type { ReactElement } from 'react';

function EmptyState() {
  return (
    <div className="my-4 text-center">
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
          <a className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
          className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
        >
          <div className="flex-1 truncate p-6">
            <h3 className="truncate text-sm font-medium text-gray-900">
              {collection.name}
            </h3>
            <p className="mt-1 truncate text-sm text-gray-500">
              {collection.description || 'No description'}
            </p>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <Link href={`/admin/collections/${collection.id}/layout`}>
                  <a className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">
                    <TemplateIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-3">Layout</span>
                  </a>
                </Link>
              </div>
              <div className="flex w-0 flex-1">
                <Link href={`/admin/collections/${collection.id}/edit`}>
                  <a className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500">
                    <PencilIcon
                      className="h-5 w-5 text-gray-400"
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
      <div className="mb-5 border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Collections
        </h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Link href="/admin/collections/create">
            <a className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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
