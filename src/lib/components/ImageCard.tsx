import { File } from '$lib/api/schemas/file';
import { FC } from 'react';

import FileRenderer from './FileRenderer';

const ImageCard: FC<{
  file: File;
  cover?: File;
  onImageClick?: () => void;
  onButtonClick?: () => void;
}> = ({ file, cover, onImageClick, onButtonClick }) => {
  return (
    <>
      <div
        className={`card card-compact bg-base-100 shadow-xl ${
          cover ? 'image-full' : ''
        }`}
      >
        <figure className="bg-base-300" onClick={onImageClick || void 0}>
          <FileRenderer file={cover ?? file} objectFit="contain"></FileRenderer>
        </figure>
        <div className="card-body">
          <h2 className="card-title">{file.title}</h2>
          <p>{file.description || 'No description'}</p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={onButtonClick || void 0}
            >
              View
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageCard;
