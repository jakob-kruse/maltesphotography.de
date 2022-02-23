import { FormError } from '$lib/components/form/FormError';
import { client } from '$lib/http';
import AdminLayout from '$pages/admin/layout';
import { CreateCollectionSchema } from '$pages/api/collections/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function CreateCollection() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CreateCollectionSchema>>({
    resolver: zodResolver(CreateCollectionSchema),
  });

  const onSubmit = async (data: z.infer<typeof CreateCollectionSchema>) => {
    const res = await client
      .post('collections', {
        json: data,
      })
      .json();

    router.replace('/admin/collections');
  };

  return (
    <form
      className="space-y-8 divide-y divide-gray-200"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Create a new Collection
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Collections can contain images and other elements
          </p>
        </div>

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
                  className={`flex-1 block w-full min-w-0 rounded-md sm:text-sm border-gray-300 ${
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

      <div className="pt-5">
        <div className="flex justify-end">
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

CreateCollection.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
