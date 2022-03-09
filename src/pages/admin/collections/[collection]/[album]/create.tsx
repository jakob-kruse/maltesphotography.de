import { AlbumWithRelations, CreateAlbum } from '$lib/api/schemas/album';
import {
  CollectionWithRelations,
  CreateCollection,
} from '$lib/api/schemas/collection';
import { client } from '$lib/http';
import { prisma } from '$lib/prisma';
import { ensureQueryParam } from '$lib/util';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { albumQueryParams } from '.';

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

const AdminCreateFilePage = ({
  collection,
  album,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, ...formState },
  } = useForm<CreateCollection>({
    // resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {},
  });

  const [selectedFile, setSelectedFile] = useState();

  const onChangeFile = (event: FormEvent) => {
    setSelectedFile((event.target as HTMLFormElement).files[0]);
  };

  const onSubmit: SubmitHandler<CreateCollection> = async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    formData.append('albumId', album.id);
    formData.append('file', selectedFile as unknown as Blob);

    await client.post('files', {
      body: formData,
    });

    await router.push(
      `/admin/collections/${collection.urlName}/${album.urlName}`
    );
  };

  return (
    <div className="container mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card card-bordered form-control shadow-sm gap-2"
      >
        <div className="card-body">
          <h2 className="card-title">Create file in {album.title}</h2>
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

          <input
            type="file"
            name="picture"
            accept="image/*"
            onChange={onChangeFile}
          />

          <div className="card-actions justify-end">
            <button type="submit" className="btn">
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateFilePage;
