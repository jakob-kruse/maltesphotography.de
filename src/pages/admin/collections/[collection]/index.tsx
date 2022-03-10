import {
  Collection,
  CollectionWithRelations,
  UpdateCollection,
} from '$lib/api/schemas/collection';
import { File } from '$lib/api/schemas/file';
import FileRenderer from '$lib/components/FileRenderer';
import { client } from '$lib/http';
import { prisma } from '$lib/prisma';
import { ApiResponseData } from '$lib/util';
import {
  ArrowLeftIcon,
  DotsVerticalIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

export const collectionQueryParams = z.object({
  collection: z.string(),
});

export const getServerSideProps: GetServerSideProps<{
  collection: CollectionWithRelations;
}> = async ({ query }) => {
  const validationResult = await collectionQueryParams.safeParse(query);

  if (!validationResult.success) {
    return {
      notFound: true,
    };
  }

  const { collection: collectionUrlName } = validationResult.data;

  const collection = await prisma.collection.findFirst({
    where: {
      urlName: collectionUrlName,
    },
    include: {
      albums: true,
      cover: true,
    },
  });

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

const AdminCollectionPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ collection }) => {
  const [albums, setAlbums] = useState(collection.albums);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateCollection>({
    defaultValues: {
      title: collection.title,
      description: collection.description,
    },
  });

  const onSubmit: SubmitHandler<UpdateCollection> = async (data) => {
    const response = await client
      .patch(`collections/${collection.id}`, {
        json: data,
      })
      .json<ApiResponseData<Collection>>();

    router.push(`/admin/collections/${response.data.urlName}`);
  };

  async function deleteAlbum(albumId: string) {
    const previousAlbums = [...albums];

    setAlbums(albums.filter((a) => a.id !== albumId));
    try {
      await client.delete(`albums/${albumId}`);
    } catch (error) {
      setAlbums(previousAlbums);
      console.log(error);
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="my-6">
          <Link href="/admin/collections">
            <a className="flex items-center gap-2 font-mono uppercase btn btn-circle btn-sm">
              <ArrowLeftIcon className="w-4 h-4"></ArrowLeftIcon>
            </a>
          </Link>
        </div>
        <Link href={`/collections/${collection.urlName}`}>
          <a className="my-2 badge">/collections/{collection.urlName}</a>
        </Link>

        <h1 className="flex items-center gap-4 mb-4 text-2xl font-bold">
          {collection.title}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="gap-2 mb-8 shadow-sm card card-bordered form-control"
        >
          {collection.cover && (
            <figure className="bg-base-300">
              <FileRenderer
                file={collection.cover}
                alt={`Cover of ${collection.title}`}
                objectFit="contain"
              ></FileRenderer>
            </figure>
          )}
          <div className="card-body">
            <h2 className="card-title">Basic information</h2>

            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              className="input input-bordered"
              placeholder="Enter title"
              {...register('title')}
            />
            {errors.title && (
              <span className="text-sm text-error">{errors.title.message}</span>
            )}

            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered"
              placeholder="Enter description"
              {...register('description')}
            />

            {errors.description && (
              <span className="text-sm text-error">
                {errors.description.message}
              </span>
            )}

            <div className="justify-end card-actions">
              <button type="submit" className="btn" disabled={!isDirty}>
                Save
              </button>
            </div>
          </div>
        </form>

        <div className="w-full overflow-x-auto shadow-sm card card-bordered">
          <div className="card-body">
            <h2 className="card-title">Albums</h2>
            <table className="table w-full mb-16 h-ful">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>URL Name</th>
                  <th className="w-[1%]">
                    <Link
                      href={`/admin/collections/${collection.urlName}/create`}
                    >
                      <a className="btn btn-square btn-ghost">
                        <PlusIcon className="w-5 h-5"></PlusIcon>
                      </a>
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {albums.length === 0 ? (
                  <div className="py-3 pl-2">
                    <p>No albums yet</p>
                  </div>
                ) : (
                  albums.map((album) => (
                    <tr key={album.id}>
                      <td>
                        <Link
                          href={`/admin/collections/${collection.urlName}/${album.urlName}`}
                        >
                          {album.title}
                        </Link>
                      </td>
                      <td>{album.urlName}</td>
                      <td>
                        <div className="dropdown dropdown-left">
                          <button className="btn btn-square btn-ghost">
                            <DotsVerticalIcon className="w-5 h-5"></DotsVerticalIcon>
                          </button>
                          <ul
                            tabIndex={0}
                            className="p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52"
                          >
                            <li>
                              <Link
                                href={`/admin/collections/${collection.urlName}/${album.urlName}`}
                              >
                                <a>Edit</a>
                              </Link>
                            </li>
                            <li onClick={() => deleteAlbum(album.id)}>
                              <a>Delete</a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCollectionPage;
