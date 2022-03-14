import { AlbumWithRelations } from '$lib/api/schemas/album';
import { CollectionWithRelations } from '$lib/api/schemas/collection';
import { File, UpdateFile } from '$lib/api/schemas/file';
import FileRenderer from '$lib/components/FileRenderer';
import { client } from '$lib/http';
import { prisma } from '$lib/prisma';
import { ArrowLeftIcon } from '@heroicons/react/outline';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { isDirty, z } from 'zod';

import { albumQueryParams } from '.';

export const fileQueryParams = albumQueryParams.extend({
  file: z.string(),
});

export const getServerSideProps: GetServerSideProps<{
  collection: CollectionWithRelations;
  album: AlbumWithRelations;
  file: File;
}> = async ({ query }) => {
  const queryValidationResult = fileQueryParams.safeParse(query);

  if (!queryValidationResult.success) {
    return {
      notFound: true,
    };
  }

  const {
    collection: collectionUrlName,
    album: albumUrlName,
    file: fileUrlName,
  } = queryValidationResult.data;

  const collection = await prisma.collection.findFirst({
    where: {
      urlName: collectionUrlName,
    },
    include: {
      albums: {
        where: {
          urlName: albumUrlName,
        },
        include: {
          files: {
            where: {
              urlName: fileUrlName,
            },
          },
        },
      },
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
      album: collection.albums[0] as AlbumWithRelations,
      file: collection.albums[0].files[0] as File,
    },
  };
};

const AdminViewFilePage = ({
  collection,
  album,
  file,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, ...formState },
  } = useForm<UpdateFile>({
    // resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      title: file.title,
      description: file.description,
      albumId: album.id,
      featured: file.featured,
    },
  });

  const onSubmit: SubmitHandler<UpdateFile> = async (data) => {
    await client
      .patch(`files/${file.id}`, {
        json: data,
      })
      .json();

    await router.push(
      `/admin/collections/${collection.urlName}/${album.urlName}`
    );
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="my-6">
          <Link
            href={`/admin/collections/${collection.urlName}/${album.urlName}`}
          >
            <a className="flex items-center gap-2 font-mono uppercase btn btn-circle btn-sm">
              <ArrowLeftIcon className="w-4 h-4"></ArrowLeftIcon>
            </a>
          </Link>
        </div>

        <h1 className="flex items-center gap-4 mb-4 text-2xl font-bold ">
          {file.title}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="gap-2 shadow-sm card card-bordered form-control"
        >
          {file && (
            <figure>
              <FileRenderer file={file}></FileRenderer>
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

            <label className="cursor-pointer label">
              <span className="label-text">Featured on Homepage</span>
              <input
                type="checkbox"
                className="checkbox"
                {...register('featured')}
              />
            </label>

            <div className="justify-end card-actions">
              <button type="submit" className="btn" disabled={!isDirty}>
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default AdminViewFilePage;
