import { FormError } from '$lib/components/form/FormError';
import { TrashIcon } from '@heroicons/react/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { Collection } from '@prisma/client';
import Link from 'next/link';
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CardProps = {
  title: string;
  subtitle?: string;
  actions?: ReactElement[];
  content?: ReactElement;
};

function Card({ title, subtitle, actions, content }: CardProps) {
  return (
    <div className="overflow-hidden bg-white sm:rounded-lg sm:shadow">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="ml-4 mt-4 flex-shrink-0">{actions}</div>}
        </div>
      </div>
      {content}
    </div>
  );
}

export function AdminEditCollectionBase({
  collection,
  deleteCollection,
  saveCollection,
}: {
  collection: Collection;
  deleteCollection: (id: string) => void;
  saveCollection: (collection: z.infer<typeof UpdateCollectionSchema>) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof UpdateCollectionSchema>>({
    resolver: zodResolver(UpdateCollectionSchema),
    defaultValues: collection,
  });

  function del() {
    deleteCollection(collection.id);
  }

  function save(data: z.infer<typeof UpdateCollectionSchema>) {
    saveCollection(data);
  }

  const form = (
    <form
      className="space-y-8 divide-y divide-gray-200 px-6"
      onSubmit={handleSubmit(save)}
    >
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="mt-6 space-y-6 sm:mt-5 sm:space-y-5">
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
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
                  className={`block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
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

      {/* <ImageGrid></ImageGrid> */}

      <div className="flex justify-between py-5">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-red-600 p-2 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={del}
        >
          <TrashIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div>
          <Link href="/admin/collections">
            <a className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
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

  return (
    <Card
      title="Basic Information"
      subtitle="Edit basic information about the collection"
      content={form}
    ></Card>
  );
}
