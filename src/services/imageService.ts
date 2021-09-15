import { ArgumentError } from '../exceptions/ArgumentError';
import path from 'path';

export class ImageService {
  defaultImageExtension = '.png';

  public processImage(
    imageName: string,
    width: number,
    height: number
  ): string {
    console.log(
      `name:${imageName}, widht:${width}, height:${height}, ${typeof width}`
    );

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
    const fileRegex = new RegExp('^[0-9a-zA-Z ... ]+$');
    if (!fileRegex.test(imageName)) {
      throw new ArgumentError(`Image name '${imageName}' is not valid`);
    }

    const imagePath = path.parse(imageName);
    const imageExtension = imagePath.ext
      ? imagePath.ext
      : this.defaultImageExtension;

    //check if image exists?
    //resize image
    //check if thumb exists

    const fullImagePath: string = path.resolve(
      `${__dirname}/../../images/thumb/${imagePath.name}_${width}_${height}${imageExtension}`
    );
    console.log(`Image ${fullImagePath} prepared.`);
    return fullImagePath;
  }
}

export const imageServiceSingleton = new ImageService();
