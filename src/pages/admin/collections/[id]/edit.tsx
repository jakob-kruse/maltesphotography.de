// import { FormError } from '$lib/components/form/FormError';
// import { client } from '$lib/http';
// import AdminLayout from '$pages/admin/layout';
// import { UpdateCollectionSchema } from '$pages/api/collections/schema';
// import { TrashIcon } from '@heroicons/react/solid';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { ReactElement } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
import { AdminEditCollectionBase } from '$lib/components/admin/collections/AdminEditCollection';
import { prisma } from '$lib/prisma';
import AdminLayout from '$pages/admin/layout';
import { Collection } from '@prisma/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { ReactElement } from 'react';

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

// const files = [
//   {
//     title: 'IMG_4985.HEIC',
//     size: '3.9 MB',
//     source:
//       'https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80',
//   },
//   // More files...
// ];

// export function ImageGrid() {
//   return (
//     <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
//       <div>
//         <h3 className="text-lg leading-6 font-medium text-gray-900">Images</h3>
//         <p className="mt-1 max-w-2xl text-sm text-gray-500">
//           All the images in this collection
//         </p>
//       </div>
//       <ul
//         role="list"
//         className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
//       >
//         {files.map((file) => (
//           <li key={file.source} className="relative">
//             <div className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
//               <img
//                 src={file.source}
//                 alt=""
//                 className="object-cover pointer-events-none group-hover:opacity-75"
//               />
//               <button
//                 type="button"
//                 className="absolute inset-0 focus:outline-none"
//               >
//                 <span className="sr-only">View details for {file.title}</span>
//               </button>
//             </div>
//             <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
//               {file.title}
//             </p>
//             <p className="block text-sm font-medium text-gray-500 pointer-events-none">
//               {file.size}
//             </p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default function EditCollection({
//   collection,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<z.infer<typeof UpdateCollectionSchema>>({
//     resolver: zodResolver(UpdateCollectionSchema),
//     defaultValues: collection,
//   });

//   const onSubmit = async (data: z.infer<typeof UpdateCollectionSchema>) => {
//     const res = await client
//       .put('collections', {
//         json: {
//           ...data,
//           id: collection.id,
//         },
//       })
//       .json();

//     router.replace('/admin/collections');
//   };

//   async function deleteCollection() {
//     const res = await client
//       .delete('collections', {
//         json: {
//           id: collection.id,
//         },
//       })
//       .json();

//     router.replace('/admin/collections');
//   }

//   return (
//     <>
//       <form
//         className="space-y-8 divide-y divide-gray-200"
//         onSubmit={handleSubmit(onSubmit)}
//       >
//         <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">
//             {`Edit "${collection.name}"`}
//           </h3>

//           <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
//             <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
//               <label
//                 htmlFor="collection-name"
//                 className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
//               >
//                 Name
//               </label>
//               <div className="mt-1 sm:mt-0 sm:col-span-2">
//                 <div className="max-w-lg flex rounded-md shadow-sm">
//                   <input
//                     type="text"
//                     id="collection-name"
//                     placeholder="Collection name"
//                     className={`flex-1 block w-full min-w-0 rounded-md sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 ${
//                       errors.name ? 'input-error' : ''
//                     }`}
//                     {...register('name')}
//                   />
//                 </div>
//                 <FormError error={errors.name}></FormError>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
//           <label
//             htmlFor="about"
//             className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
//           >
//             Description
//           </label>
//           <div className="mt-1 sm:mt-0 sm:col-span-2">
//             <textarea
//               id="description"
//               rows={3}
//               className={`max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md ${
//                 errors.description ? 'input-error' : ''
//               }`}
//               {...register('description')}
//             />
//             <p className="mt-2 text-sm text-gray-500">
//               Add a short description.
//             </p>
//           </div>
//           <FormError error={errors.description}></FormError>
//         </div>

//         <ImageGrid></ImageGrid>

//         <div className="pt-5 flex justify-between">
//           <button
//             type="button"
//             className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//             onClick={deleteCollection}
//           >
//             <TrashIcon className="h-5 w-5" aria-hidden="true" />
//           </button>

//           <div>
//             <Link href="/admin/collections">
//               <a className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
//                 Cancel
//               </a>
//             </Link>
//             <button
//               type="submit"
//               className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// }

export default function EditCollection({
  collection,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  function deleteCollection(id: string) {
    console.log(id);
  }

  function saveCollection(collection: Collection) {}

  return (
    <AdminEditCollectionBase
      collection={collection}
      deleteCollection={deleteCollection}
      saveCollection={saveCollection}
    ></AdminEditCollectionBase>
  );
}

EditCollection.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
