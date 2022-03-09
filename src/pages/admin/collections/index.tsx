import { Collection } from '$lib/api/schemas/collection';
import { client } from '$lib/http';
import { prisma } from '$lib/prisma';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

export const getServerSideProps: GetServerSideProps<{
  collections: Collection[];
}> = async () => {
  const collections = await prisma.collection.findMany();

  return {
    props: {
      collections,
    },
  };
};

const CollectionIndexPage = ({
  collections: _collections,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [collections, setCollections] = useState(_collections);

  async function deleteCollection(collectionId: string) {
    const previousCollections = [...collections];

    setCollections(collections.filter((c) => c.id !== collectionId));
    try {
      await client.delete(`collections/${collectionId}`);
    } catch (error) {
      setCollections(previousCollections);
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Link href={`/admin/collections/create`}>
          <a className="btn">New</a>
        </Link>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="table w-full h-ful mb-16">
          <thead>
            <tr>
              <th>Title</th>
              <th>URL Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id}>
                <td>
                  <Link href={`/admin/collections/${collection.urlName}`}>
                    {collection.title}
                  </Link>
                </td>
                <td>{collection.urlName}</td>
                <td className="w-[1%]">
                  <div className="dropdown dropdown-left">
                    <button className="btn btn-square btn-ghost">
                      <DotsVerticalIcon className="w-5 h-5"></DotsVerticalIcon>
                    </button>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                    >
                      <li>
                        <Link href={`/admin/collections/${collection.urlName}`}>
                          <a>Edit</a>
                        </Link>
                      </li>
                      <li>
                        <a onClick={() => deleteCollection(collection.id)}>
                          Delete
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionIndexPage;
