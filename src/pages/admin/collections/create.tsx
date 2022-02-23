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
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Create a new Collection
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Collections can contain images and other elements
          </p>
        </div>

        <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              htmlFor="collection-name"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Name
            </label>
            <div className="mt-1 sm:col-span-2 sm:mt-0">
              <div className="flex max-w-lg rounded-md shadow-sm">
                <input
                  type="text"
                  id="collection-name"
                  placeholder="Collection name"
                  className={`block w-full min-w-0 flex-1 rounded-md border-gray-300 sm:text-sm ${
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

      <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          htmlFor="about"
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        >
          Description
        </label>
        <div className="mt-1 sm:col-span-2 sm:mt-0">
          <textarea
            id="description"
            rows={3}
            className={`block w-full max-w-lg rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
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
            <a className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              Cancel
            </a>
          </Link>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
