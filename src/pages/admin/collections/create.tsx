import { Collection, CreateCollection } from '$lib/api/schemas/collection';
import { client } from '$lib/http';
import { ApiResponseData } from '$lib/util';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';

const AdminCollectionsCreatePage = () => {
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
        className="gap-2 shadow-sm card card-bordered form-control"
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

export default AdminCollectionsCreatePage;
