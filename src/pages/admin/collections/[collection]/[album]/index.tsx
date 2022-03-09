import { Album, AlbumWithRelations, UpdateAlbum } from '$lib/api/schemas/album';
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
import albums from '$pages/api/albums';
import {
  ArrowLeftIcon,
  DotsVerticalIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import { errors } from 'formidable';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { register } from 'ts-node';
import { isDirty, z } from 'zod';

import { collectionQueryParams } from '..';

export const albumQueryParams = collectionQueryParams.extend({
  album: z.string(),
});

export const getServerSideProps: GetServerSideProps<{
  collection: CollectionWithRelations;
  album: AlbumWithRelations;
}> = async ({ params }) => {
  const safeParams = albumQueryParams.safeParse(params);
  if (!safeParams.success) {
    return {
      notFound: true,
    };
  }

  const collection = await prisma.collection.findFirst({
    where: {
      urlName: safeParams.data.collection,
    },
    include: {
      albums: {
        where: {
          urlName: safeParams.data.album,
        },
        include: {
          collection: true,
          files: true,
        },
      },
    },
  });

  if (!collection) {
    return {
      notFound: true,
    };
  }

  const album = collection?.albums?.[0] as AlbumWithRelations;

  if (!album) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
      album,
    },
  };
};

const AdminCollectionAlbumPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ collection, album }) => {
  const [files, setFiles] = useState(album.files);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<UpdateAlbum>({
    defaultValues: {
      title: album.title,
      description: album.description,
      collectionId: collection.id,
    },
  });

  const onSubmit: SubmitHandler<UpdateAlbum> = async (data) => {
    const response = await client
      .patch(`albums/${album.id}`, {
        json: data,
      })
      .json<ApiResponseData<Album>>();

    await router.push(
      `/admin/collections/${collection.urlName}/${response.data.urlName}`
    );
  };

  async function deleteFile(fileId: string) {
    const previousFiles = [...files];

    setFiles(files.filter((file) => file.id !== fileId));
    try {
      await client.delete(`files/${fileId}`);
    } catch (error) {
      setFiles(previousFiles);
      console.log(error);
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="my-6">
          <Link href={`/admin/collections/${collection.urlName}`}>
            <a className="font-mono uppercase flex items-center gap-2 btn btn-circle btn-sm">
              <ArrowLeftIcon className="w-4 h-4"></ArrowLeftIcon>
            </a>
          </Link>
        </div>
        <Link href={`/collections/${collection.urlName}/${album.urlName}`}>
          <a className="badge my-2">
            /collections/{collection.urlName}/{album.urlName}
          </a>
        </Link>

        <h1 className="text-2xl font-bold mb-4 flex items-center gap-4">
          {album.title}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card card-bordered form-control shadow-sm gap-2"
        >
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
              <span className="text-error text-sm">{errors.title.message}</span>
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
              <span className="text-error text-sm">
                {errors.description.message}
              </span>
            )}

            <div className="card-actions justify-end">
              <button type="submit" className="btn" disabled={!isDirty}>
                Save
              </button>
            </div>
          </div>
        </form>

        <div className="overflow-x-auto w-full card card-bordered shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Files</h2>
            <table className="table w-full h-ful mb-16">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>URL Name</th>
                  <th className="w-[1%]">
                    <Link
                      href={`/admin/collections/${collection.urlName}/${album.urlName}/create`}
                    >
                      <a className="btn btn-square btn-ghost">
                        <PlusIcon className="w-5 h-5"></PlusIcon>
                      </a>
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <Link
                        href={`/admin/collections/${collection.urlName}/${album.urlName}/${file.urlName}`}
                      >
                        {file.title}
                      </Link>
                    </td>
                    <td>{file.urlName}</td>
                    <td>
                      <div className="dropdown dropdown-left">
                        <button className="btn btn-square btn-ghost">
                          <DotsVerticalIcon className="w-5 h-5"></DotsVerticalIcon>
                        </button>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                        >
                          <li>
                            <Link
                              href={`/admin/collections/${collection.urlName}/${album.urlName}/${file.urlName}`}
                            >
                              <a>Edit</a>
                            </Link>
                          </li>
                          <li onClick={() => deleteFile(file.id)}>
                            <a>Delete</a>
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
      </div>
    </>
  );
};

export default AdminCollectionAlbumPage;
