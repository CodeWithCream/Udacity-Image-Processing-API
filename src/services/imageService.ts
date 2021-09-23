/* eslint-disable no-async-promise-executor */
import path from 'path';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ArgumentError } from '../exceptions/ArgumentError';
import { promises as fsPromises, constants } from 'fs';
import sharp from 'sharp';

export class ImageService {
  readonly fullDirectoryName = 'full';
  readonly thumbDirectoryName = 'thumb';
  imagesDirectoryPath: string;

  constructor(imagesDirectoryPath: string) {
    this.imagesDirectoryPath = imagesDirectoryPath;
  }

  public async processImage(
    imageName: string,
    width: number,
    height: number
  ): Promise<string> {
    // eslint-disable-next-line no-async-promise-executor
    const promise: Promise<string> = new Promise(async (resolve, reject) => {
      try {
        console.log(
          `ImageService: name:${imageName}, widht:${width}, height:${height}`
        );

        this.checkArguments(imageName, width, height);

        const imagePath: path.ParsedPath = path.parse(imageName);
        const imageNameWithoutExtension: string = imagePath.name;
        let imageExtension: string = imagePath.ext;

        const existingImages: string[] = await this.getDirectoryFilesOfName(
          `${this.imagesDirectoryPath}/${this.fullDirectoryName}`,
          imageNameWithoutExtension,
          imageExtension
        );

        if (existingImages.length == 0) {
          console.log(`Image ${imageName} does not exist.`);
          throw new NotFoundError(`Image ${imageName} not found`);
        }

        const imageToProcess: string = existingImages[0];
        imageExtension = path.parse(imageToProcess).ext;
        const fullImagePath: string = path.resolve(
          `${this.imagesDirectoryPath}/${this.fullDirectoryName}/${imageToProcess}`
        );

        console.log('Full image Path', fullImagePath);

        const processedImagePath: string = path.resolve(
          `${this.imagesDirectoryPath}/${this.thumbDirectoryName}/${imagePath.name}_${width}_${height}${imageExtension}`
        );

        console.log('Processed image Path', processedImagePath);

        if (await this.fileExists(processedImagePath)) {
          console.log(`Image ${processedImagePath} exists.`);
          console.log(`Image ${processedImagePath} returned.`);
          return resolve(processedImagePath);
        }

        //create new image
        await this.createFileThumb(
          fullImagePath,
          width,
          height,
          processedImagePath
        );
        console.log(`Image ${processedImagePath} returned.`);
        return resolve(processedImagePath);
      } catch (error) {
        reject(error);
      }
    });

    return promise;
  }

  private checkArguments(imageName: string, width: number, height: number) {
    if (!imageName) {
      throw new ArgumentError(`Image name cannot be empty`);
    }
    if (width <= 0) {
      throw new ArgumentError(`Width has to be greater than 0`);
    }
    if (height <= 0) {
      throw new ArgumentError(`Hight has to be greater than 0`);
    }
    if (!Number.isInteger(width) || !Number.isInteger(height)) {
      throw new ArgumentError(`Width and height must be of type integer`);
    }
    const fileRegex = new RegExp(/^[-\w^&'@{}[\],$=!#().%+~ ]+$/);
    if (!fileRegex.test(imageName)) {
      throw new ArgumentError(`Image name '${imageName}' is not valid`);
    }
  }

  private async fileExists(filePath: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        await fsPromises.access(filePath, constants.F_OK);
        return resolve(true);
      } catch (error) {
        return resolve(false);
      }
    });
  }

  private async getDirectoryFilesOfName(
    directoryPath: string,
    name: string,
    extension?: string
  ): Promise<Array<string>> {
    return new Promise(async (resolve) => {
      const foundFiles: Array<string> = Array<string>();

      let index = 0;
      const files = await fsPromises.readdir(directoryPath);
      files.forEach(async (file) => {
        const filePath = path.parse(file);
        if (filePath.name === name) {
          if (!extension || filePath.ext == extension) {
            foundFiles[index++] = file;
            console.log('Found file:', file);
          }
        }
      });

      return resolve(foundFiles);
    });
  }

  private async createFileThumb(
    imagePath: string,
    width: number,
    height: number,
    processedImagePath: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Creating ${processedImagePath}.`);
        //await fsPromises.copyFile(imagePath, processedImagePath);
        await sharp(imagePath).resize(width, height).toFile(processedImagePath);
        console.log(`File ${processedImagePath} created.`);
        return resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
