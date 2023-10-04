import { DragEvent, useCallback, useContext } from 'react';

import { DropzoneOptions, useDropzone } from 'react-dropzone';
import cx from 'classnames';

import styles from './dropbox.module.css';
import { RecipeFormContext } from '../../RecipeFormContext';

import { InsertPhotoOutlined as InsertPhotoOutlinedIcon } from '@mui/icons-material';
import { Typography } from '@mui/material';

function DropBox({ transparent }: { transparent?: boolean }) {
  const { image, setImage } = useContext(RecipeFormContext);

  const onDrop: DropzoneOptions['onDrop'] = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.map((file, index) => {
        const reader = new FileReader();

        reader.onload = function (e) {
          setImage(e.target?.result ?? null);
        };

        reader.readAsDataURL(file);
        return file;
      });
    },
    [setImage]
  );

  const {
    getRootProps,
    getInputProps,
    open,
    isDragAccept,
    isFocused,
    isDragReject,
    isDragActive,
  } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    noKeyboard: true,
  });

  const dragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const dragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const dragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
  };

  const fileDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      onDrop(Array.from(files), [], e);
    }
  };

  return (
    <section
      onClick={open}
      onDragOver={dragOver}
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDrop={fileDrop}
      style={{ cursor: 'pointer', height: '100%' }}
    >
      <div
        {...getRootProps({
          className: cx(styles.dropbox, {
            [styles.transparent]: transparent,
            [styles.isDragAccept]: isDragAccept,
            [styles.isFocused]: isFocused,
            [styles.isFocused]: isDragActive,
            [styles.isDragReject]: isDragReject,
          }),
        })}
      >
        <input {...getInputProps()} />
        <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          <InsertPhotoOutlinedIcon />
          <Typography>{`${image === '' ? 'Add' : 'Change'} Image`}</Typography>
        </div>
      </div>
    </section>
  );
}

export default DropBox;
