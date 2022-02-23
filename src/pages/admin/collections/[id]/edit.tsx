import { FormError } from '$lib/components/form/FormError';
import { client } from '$lib/http';
import { prisma } from '$lib/prisma';
import AdminLayout from '$pages/admin/layout';
import { UpdateCollectionSchema } from '$pages/api/collections/schema';
import { TrashIcon } from '@heroicons/react/solid';
import { zodResolver } from '@hookform/resolvers/zod';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id;

  if (!id || Array.isArray(id)) {
    return {
      notFound: true,
    };
  }

  const collection = await prisma.collection.findFirst({
    where: {
      id: context.query.id as string,
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

export default function EditCollection({
  collection,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof UpdateCollectionSchema>>({
    resolver: zodResolver(UpdateCollectionSchema),
    defaultValues: collection,
  });

  const onSubmit = async (data: z.infer<typeof UpdateCollectionSchema>) => {
    const res = await client
      .put('collections', {
        json: {
          ...data,
          id: collection.id,
        },
      })
      .json();

    console.log(res);
    router.replace('/admin/collections');
  };

  async function deleteCollection() {
    const res = await client
      .delete('collections', {
        json: {
          id: collection.id,
        },
      })
      .json();

    console.log(res);
    router.replace('/admin/collections');
  }

  return (
    <form
      className="space-y-8 divide-y divide-gray-200"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {`Edit "${collection.name}"`}
        </h3>

        <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="collection-name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Name
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <div className="max-w-lg flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="collection-name"
                  placeholder="Collection name"
                  className={`flex-1 block w-full min-w-0 rounded-md sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 ${
                    errors.name ? 'input-error' : ''
                  }`}
                  {...register('name')}
                />
              </div>
              <FormError error={errors.name}></FormError>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          htmlFor="about"
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          Description
        </label>
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <textarea
            id="description"
            rows={3}
            className={`max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md ${
              errors.description ? 'input-error' : ''
            }`}
            {...register('description')}
          />
          <p className="mt-2 text-sm text-gray-500">Add a short description.</p>
        </div>
        <FormError error={errors.description}></FormError>
      </div>

      <div className="pt-5 flex justify-between">
        <button
          type="button"
          className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={deleteCollection}
        >
          <TrashIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div>
          <Link href="/admin/collections">
            <a className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </a>
          </Link>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

EditCollection.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
