import {
  Collection,
  CreateCollection,
  CreateCollectionSchema,
} from '$lib/api/schemas/collection';
import { client } from '$lib/http';
import { ApiResponse, ApiResponseData, setErrors } from '$lib/util';
import { zodResolver } from '@hookform/resolvers/zod';
import { HTTPError } from 'ky';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import slugify from 'slugify';
import { ZodError } from 'zod';

const AdminCreateCollectionPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, ...formState },
  } = useForm<CreateCollection>({
    // resolver: zodResolver(CreateCollectionSchema),
  });

  const onSubmit: SubmitHandler<CreateCollection> = async (data) => {
    const { data: collection }: ApiResponseData<Collection> = await client
      .post('collections', {
        json: data,
      })
      .json();

    await router.push(`/admin/collections/${collection.urlName}`);
  };

  return (
    <div className="container mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card card-bordered form-control shadow-sm gap-2"
      >
        <div className="card-body">
          <h2 className="card-title">Create collection</h2>
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
            <button type="submit" className="btn">
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateCollectionPage;
