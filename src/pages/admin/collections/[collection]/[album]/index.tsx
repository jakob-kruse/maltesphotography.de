import { Album, AlbumWithRelations, UpdateAlbum } from '$lib/api/schemas/album';
import { CollectionWithRelations } from '$lib/api/schemas/collection';
import FileRenderer from '$lib/components/FileRenderer';
import { client } from '$lib/http';
import { prisma } from '$lib/prisma';
import { ApiResponseData } from '$lib/util';
import {
  ArrowLeftIcon,
  DotsVerticalIcon,
  PlusIcon,
} from '@heroicons/react/outline';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

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
          cover: true,
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

const AdminFileListPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ collection, album }) => {
  const [files, setFiles] = useState(album.files);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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

  async function setCover(fileId: string, ofCollection: boolean) {
    const url = ofCollection
      ? `collections/${collection.id}`
      : `albums/${album.id}`;
    await client.patch(url, {
      json: {
        coverId: fileId,
      },
    });

    router.reload();
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="my-6">
          <Link href={`/admin/collections/${collection.urlName}`}>
            <a className="flex items-center gap-2 font-mono uppercase btn btn-circle btn-sm">
              <ArrowLeftIcon className="w-4 h-4"></ArrowLeftIcon>
            </a>
          </Link>
        </div>
        <Link href={`/collections/${collection.urlName}/${album.urlName}`}>
          <a className="my-2 badge">
            /collections/{collection.urlName}/{album.urlName}
          </a>
        </Link>

        <h1 className="flex items-center gap-4 mb-4 text-2xl font-bold">
          {album.title}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="gap-2 mb-8 shadow-sm card card-bordered form-control"
        >
          {album.cover && (
            <figure className="bg-base-300">
              <FileRenderer
                file={album.cover}
                alt={`Cover of ${album.title}`}
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

        <div className="w-full overflow-auto shadow-sm card card-bordered">
          <div className="card-body">
            <h2 className="card-title">Files</h2>
            <table className="table w-full mb-16 h-ful">
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
                {files.length === 0 ? (
                  <tr className="text-center">
                    <td colSpan={3}>No files yet</td>
                  </tr>
                ) : (
                  files.map((file) => (
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
                            className="z-10 p-2 shadow dropdown-content menu bg-base-100 rounded-box w-52"
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
                            <li onClick={() => setCover(file.id, false)}>
                              <a>Set Album Cover</a>
                            </li>
                            <li onClick={() => setCover(file.id, true)}>
                              <a>Set Collection Cover</a>
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

export default AdminFileListPage;
