/* eslint-disable no-async-promise-executor */
import { promises as fsPromises, constants } from 'fs';
import path from 'path';
import { NotFoundError } from '../../exceptions/NotFoundError';
import { ImageService } from '../../services/imageService';

const imagesDirectoryPath = `${__dirname}/../../../test_images`;
const imageServiceImpl = new ImageService(imagesDirectoryPath);

describe('Test image service', () => {
  describe('Test image processing', () => {
    const saveImageName = 'test_save';
    const copyImageName = 'test_copy';
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
        `${imagesDirectoryPath}/thumb/${imageName}_${width}_${height}${extension}`
      );
    }

    async function fileExists(filePath: string): Promise<boolean> {
      return new Promise(async (resolve) => {
        try {
          await fsPromises.access(filePath, constants.F_OK);
          return resolve(true);
        } catch (error) {
          return resolve(false);
        }
      });
    }

    async function deleteFiles(directoryPath: string): Promise<void> {
      return new Promise(async (resolve, reject) => {
        try {
          const files = await fsPromises.readdir(directoryPath);
          let success = true;

          files.forEach(async (file) => {
            const filePath = path.resolve(directoryPath, file);
            console.log(`Deleting file ${filePath}`);
            try {
              await fsPromises.unlink(filePath);
              console.log(`${filePath} deleted.`);
            } catch (error) {
              console.log(error);
              success = false;
            }
          });

          return success ? resolve() : reject();
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    }

    beforeEach(async () => {
      await deleteFiles(path.resolve(imagesDirectoryPath, 'thumb'));
    });

    it('calls process image with existing image and valid size', async () => {
      console.log('test');
      const imagePath = await imageServiceImpl.processImage(
        saveImageName,
        defaultWidth,
        defaultHeight
      );

      console.log('Returned image:' + imagePath);

      const expectedPath = getImageFilePath(
        saveImageName,
        defaultWidth,
        defaultHeight,
        defaultExtension
      );

      expect(imagePath).toEqual(expectedPath);

      expect(await fileExists(imagePath))
        .withContext(`File ${expectedPath} should exist.`)
        .toBeTrue();
    });

    it('calls process image with non existing image', async () => {
      const nonExistingImageName = 'non_existing_image';

      await expectAsync(
        imageServiceImpl.processImage(
          nonExistingImageName,
          defaultWidth,
          defaultHeight
        )
      ).toBeRejectedWith(
        new NotFoundError(`Image ${nonExistingImageName} not found`)
      );
    });

    it('calls process image with extension when two images of the same name exist', async () => {
      const extension = '.png';
      const fullImageName = copyImageName + extension;

      const imagePath = await imageServiceImpl.processImage(
        fullImageName,
        defaultWidth,
        defaultHeight
      );

      const expectedPath = getImageFilePath(
        copyImageName,
        defaultWidth,
        defaultHeight,
        extension
      );

      expect(imagePath).toEqual(expectedPath);

      expect(await fileExists(imagePath))
        .withContext(`File ${expectedPath} should exist.`)
        .toBeTrue();

      console.log('2');
    });

    it('calls process image when two images of the same name exist', async () => {
      const imagePath = await imageServiceImpl.processImage(
        copyImageName,
        defaultWidth,
        defaultHeight
      );

      const expectedPath = getImageFilePath(
        copyImageName,
        defaultWidth,
        defaultHeight,
        '.jpg'
      ); //first one by name

      expect(imagePath).toEqual(expectedPath);

      expect(await fileExists(imagePath))
        .withContext(`File ${expectedPath} should exist.`)
        .toBeTrue();
    });

    it('calls process image twice', async () => {
      const imagePathFirst = await imageServiceImpl.processImage(
        saveImageName,
        defaultWidth,
        defaultHeight
      );

      const imagePathSecond = await imageServiceImpl.processImage(
        saveImageName,
        defaultWidth,
        defaultHeight
      );

      expect(imagePathSecond).toEqual(imagePathFirst);
    });

    it('calls process image with size larger than original', async () => {
      const largeWidth = 1000;
      const largeHeight = 1000;

      const imagePath = await imageServiceImpl.processImage(
        saveImageName,
        largeWidth,
        largeHeight
      );

      const expectedPath = getImageFilePath(
        saveImageName,
        largeWidth,
        largeHeight,
        defaultExtension
      );

      expect(imagePath).toEqual(expectedPath);

      expect(await fileExists(imagePath))
        .withContext(`File ${expectedPath} should exist.`)
        .toBeTrue();
    });
  });
});
