import DropBox from './DropBox';
import { useContext } from 'react';
import { RecipeFormContext } from '../../RecipeFormContext';
import Image from './Image';

function ImageDropzone() {
  const { image } = useContext(RecipeFormContext);

  return (
    <div style={{ maxWidth: '100%', height: '30vw', position: 'relative' }}>
      {image && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
          }}
        >
          <Image src={image as string} />
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}
      >
        <DropBox transparent={Boolean(image)} />
      </div>
    </div>
  );
}

export default ImageDropzone;
