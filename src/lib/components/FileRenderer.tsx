import { File } from '$lib/api/schemas/file';
import Image from 'next/image';
import { FC } from 'react';

const FileRenderer: FC<{
  file: File;
  alt?: string;
  layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}> = ({ file, alt, layout = 'intrinsic', objectFit = 'none' }) => {
  return (
    <Image
      src={`/uploads/${file.fileName}`}
      blurDataURL={`/uploads/thumbnails/${file.fileName}`}
      placeholder="blur"
      width={file.width}
      height={file.height}
      alt={alt || file.title}
      layout={layout}
      objectFit={objectFit}
    />
  );
};

export default FileRenderer;
