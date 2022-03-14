import { Album, CreateAlbum } from '$lib/api/schemas/album';
import { Collection, CreateCollection } from '$lib/api/schemas/collection';
import { client } from '$lib/http';
import { prisma } from '$lib/prisma';
import { ApiResponseData } from '$lib/util';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

import { collectionQueryParams } from '.';

export const getServerSideProps: GetServerSideProps<{
  collection: Collection;
}> = async ({ query }) => {
  const { collection: collectionUrlName } = collectionQueryParams.parse(query);

  if (!collectionUrlName) {
    return {
      notFound: true,
    };
  }

  const collection = await prisma.collection.findFirst({
    where: {
      urlName: collectionUrlName,
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

const AdminAlbumsCreatePage = ({
  collection,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<CreateCollection>({
    // resolver: zodResolver(CreateCollectionSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit: SubmitHandler<CreateCollection> = async (data) => {
    const response = await client
      .post('albums', {
        json: {
          ...data,
          collectionId: collection.id,
        } as CreateAlbum,
      })
      .json<ApiResponseData<Album>>();

    await router.push(
      `/admin/collections/${collection.urlName}/${response.data.urlName}`
    );
  };

  return (
    <div className="container mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="gap-2 shadow-sm card card-bordered form-control"
      >
        <div className="card-body">
          <h2 className="card-title">Create album in {collection.title}</h2>
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
            <button type="submit" className="btn">
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAlbumsCreatePage;
