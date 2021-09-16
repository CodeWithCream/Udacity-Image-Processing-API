import fs from 'fs';
import path from 'path';
import { ArgumentError } from '../../exceptions/ArgumentError';
import { imageServiceSingleton } from '../../services/imageService';

describe('Test image service', () => {
  describe('Test image processing', () => {
    const defaultImageName = 'test_delete';
    const defaultWidth = 10;
    const defaultHeight = 10;
    const defaultExtension = '.png';

    function getImageFilePath(
      imageName: string,
      width: number,
      height: number,
      extension: string
    ): string {
      return path.resolve(
        `${__dirname}/../../../images/thumb/${imageName}_${width}_${height}${extension}`
      );
    }

    function fileExists(filePath: string): boolean {
      let exists = false;

      fs.access(filePath, fs.constants.F_OK, (error) => {
        if (!error) {
          exists = true;
        }
        exists = false;
      });

      return exists;
    }

    beforeEach(() => {
      //delete created file if exists from the previous test
      const imagePath = getImageFilePath(
        defaultImageName,
        defaultWidth,
        defaultHeight,
        defaultExtension
      );

      if (fileExists(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    it('calls process image with existing image and valid size', () => {
      const imagePath = imageServiceSingleton.processImage(
        defaultImageName,
        defaultWidth,
        defaultHeight
      );

      expect(
        imagePath ===
          getImageFilePath(
            defaultImageName,
            defaultWidth,
            defaultHeight,
            defaultExtension
          ) && fileExists(imagePath)
      ).toBeTrue();
    });

    it('calls process image with non existing image', () => {
      const nonExistingImageName = 'non_existing_image';

      expect(() => {
        imageServiceSingleton.processImage(
          nonExistingImageName,
          defaultWidth,
          defaultHeight
        );
      }).toThrowError('NotFoundError');
    });

    it('calls process image with extension when two images of the same name exist', () => {
      const imageName = 'test_copy';
      const extension = '.png';
      const fullImageName = imageName + extension;

      const imagePath = imageServiceSingleton.processImage(
        fullImageName,
        defaultWidth,
        defaultHeight
      );

      expect(
        imagePath ===
          getImageFilePath(imageName, defaultWidth, defaultHeight, extension) &&
          fileExists(imagePath)
      ).toBeTrue();
    });

    it('calls process image when two images of the same name exist', () => {
      const imageName = 'test_copy';

      const imagePath = imageServiceSingleton.processImage(
        imageName,
        defaultWidth,
        defaultHeight
      );

      expect(
        imagePath ===
          getImageFilePath(imageName, defaultWidth, defaultHeight, '.jpg') &&
          fileExists(imagePath)
      ).toBeTrue();
    });

    it('calls process image twice', () => {
      const imagePathFirst = imageServiceSingleton.processImage(
        defaultImageName,
        defaultWidth,
        defaultHeight
      );

      const imagePathSecond = imageServiceSingleton.processImage(
        defaultImageName,
        defaultWidth,
        defaultHeight
      );

      expect(imagePathSecond).toEqual(imagePathFirst);
    });

    it('calls process image with size larger than original', () => {
      const largeWidth = 1000;
      const largeHeight = 1000;

      const imagePath = imageServiceSingleton.processImage(
        defaultImageName,
        largeWidth,
        largeHeight
      );
      expect(
        imagePath ===
          getImageFilePath(
            defaultImageName,
            largeWidth,
            largeHeight,
            defaultExtension
          ) && fileExists(imagePath)
      ).toBeTrue();
    });
  });
});
