import { Album, AlbumWithRelations } from '$lib/api/schemas/album';
import { Collection } from '$lib/api/schemas/collection';
import FileRenderer from '$lib/components/FileRenderer';
import Footer from '$lib/components/Footer';
import ImageCard from '$lib/components/ImageCard';
import Navbar from '$lib/components/Navbar';
import { prisma } from '$lib/prisma';
import { combineClasses } from '$lib/util';
import {
  FolderIcon,
  FolderOpenIcon,
  MenuIcon,
  PhotographIcon,
  UserRemoveIcon,
  XIcon,
} from '@heroicons/react/outline';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  A11y,
  Controller,
  Navigation,
  Pagination,
  Scrollbar,
  Virtual,
} from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { z } from 'zod';

const AlbumPageParams = z.object({
  collection: z.string(),
  album: z.string(),
});

export const getServerSideProps: GetServerSideProps<{
  collection: Collection;
  album: AlbumWithRelations;
}> = async ({ params }) => {
  const safeParams = AlbumPageParams.safeParse(params);
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
          files: {
            where: {
              internal: false,
            },
          },
        },
      },
    },
  });

  if (!collection || collection?.albums.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
      album: collection.albums[0],
    },
  };
};
const CollectionAlbumPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ album, collection }) => {
  const [swiperController, setSwiperController] = useState<any>();
  const [currentSlide, setCurrentSlide] = useState(-1);

  useEffect(() => {
    swiperController?.slideTo(currentSlide, 0);
  }, [swiperController, currentSlide]);

  return (
    <>
      <Navbar></Navbar>

      {currentSlide !== -1 && (
        <Swiper
          modules={[Navigation, Pagination, Virtual, Controller]}
          virtual={true}
          centeredSlides={true}
          pagination={true}
          navigation={true}
          onKeyPress={(event) => {
            console.log(event);
          }}
          controller={{
            by: swiperController,
          }}
          onSwiper={setSwiperController}
          className="fixed overflow-hidden top-0 left-0 right-0 bottom-0 bg-black/40"
        >
          {album.files.map((file, index) => (
            <SwiperSlide key={file.id} virtualIndex={index}>
              <FileRenderer
                file={file}
                alt={file.title}
                layout="fill"
                objectFit="contain"
              />
            </SwiperSlide>
          ))}
          <button
            className="btn btn-circle absolute top-0 right-0 text-white m-4 z-10"
            onClick={() => setCurrentSlide(-1)}
          >
            <XIcon className="w-5 h-5"></XIcon>
          </button>
        </Swiper>
      )}

      <div className="container mx-auto space-y-4 px-8 min-h-screen">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href="/collections">
                <a>
                  <FolderOpenIcon className="w-5 h-5 mr-1"></FolderOpenIcon>
                  Collections
                </a>
              </Link>
            </li>
            <li>
              <Link href={`/collections/${collection.urlName}`}>
                <a>
                  <FolderIcon className="w-5 h-5 mr-1"></FolderIcon>
                  {collection.title}
                </a>
              </Link>
            </li>
            <li>
              <PhotographIcon className="w-5 h-5 mr-1"></PhotographIcon>
              {album.title}
            </li>
          </ul>
        </div>
        <h1 className="text-3xl text-neutral font-bold">{album.title}</h1>
        <div
          className={combineClasses(
            'grid grid-cols-1 gap-4',
            // Only show the grid if there are multiple albums
            album.files.length > 1 ? 'lg:grid-cols-2 2xl:grid-cols-3' : ''
          )}
        >
          {album.files.map((file, index) => (
            <div
              className="card card-compact bg-base-100 shadow-xl"
              key={file.id}
            >
              <figure
                className="bg-base-300"
                onClick={() => setCurrentSlide(index)}
              >
                <FileRenderer file={file} objectFit="contain"></FileRenderer>
              </figure>
              <div className="card-body">
                <h2 className="card-title">{file.title}</h2>
                <p>{file.description || 'No description'}</p>
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentSlide(index)}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default CollectionAlbumPage;
