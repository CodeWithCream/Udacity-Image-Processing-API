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

        const imageToProcess = await this.getImageToProcess(imageName);
        console.log('Image to process:', imageToProcess);

        const processedImagePath = await this.createImageThumb(
          imageToProcess,
          width,
          height
        );
        console.log(`Image ${processedImagePath} returned.`);

        return resolve(processedImagePath);
      } catch (error) {
        console.log(error);
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

  private async getImageToProcess(imageName: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
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
        reject(new NotFoundError(`Image ${imageName} not found`));
      } else {
        const imageToProcess: string = existingImages[0];
        imageExtension = path.parse(imageToProcess).ext;
        const fullImagePath: string = path.resolve(
          `${this.imagesDirectoryPath}/${this.fullDirectoryName}/${imageToProcess}`
        );

        return resolve(fullImagePath);
      }
    });
  }

  private async createImageThumb(
    imagePath: string,
    width: number,
    height: number
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const parsedImagePath = path.parse(imagePath);
        const imageNameWithoutExtension = parsedImagePath.name;
        const imageExtension = parsedImagePath.ext;

        const processedImagePath: string = path.resolve(
          `${this.imagesDirectoryPath}/${this.thumbDirectoryName}/${imageNameWithoutExtension}_${width}_${height}${imageExtension}`
        );

        console.log('Processed image path:', processedImagePath);

        if (await this.fileExists(processedImagePath)) {
          console.log(`Image ${processedImagePath} exists.`);
          return resolve(processedImagePath);
        }

        //create new image
        await this.createFileThumb(
          imagePath,
          width,
          height,
          processedImagePath
        );
        resolve(processedImagePath);
      } catch (error) {
        reject(error);
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
        await sharp(imagePath).resize(width, height).toFile(processedImagePath);
        console.log(`File ${processedImagePath} created.`);
        return resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
