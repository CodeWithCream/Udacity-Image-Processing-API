import path from 'path';
import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test api responses', () => {
  describe('Test get images', () => {
    const ok = 200;
    const badRequest = 400;
    const notFound = 404;

    const defaultImageName = 'test_save';
    const defaultWidth = 10;
    const defaultHeight = 10;

    it('calls get images with valid parameteres', async () => {
      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(response.status).toBe(ok);
    });

    it('calls get images without filename', async () => {
      const response = await request.get(
        `/api/images?width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with filename empty', async () => {
      const imageName = '';

      const response = await request.get(
        `/api/images?imagename=${imageName}&width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with filename and extension', async () => {
      const imageName = 'test_save.png';

      const response = await request.get(
        `/api/images?imagename=${imageName}&width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(response.status).toBe(ok);
    });

    it('calls get images with invalid filename', async () => {
      const imageName = '>||image';

      const response = await request.get(
        `/api/images?imagename=${imageName}&width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with width empty', async () => {
      const width = '';

      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&width=${width}&height=${defaultHeight}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with height empty', async () => {
      const height = '';
      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&width=${defaultWidth}&height=${height}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images without width', async () => {
      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&height=${defaultHeight}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images without height', async () => {
      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&width=${defaultWidth}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with width 0', async () => {
      const width = 0;
      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&width=${width}&height=${defaultHeight}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with height 0', async () => {
      const height = 0;
      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&width=${defaultWidth}&height=${height}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with width less than 0', async () => {
      const width = -10;
      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&width=${width}&height=${defaultHeight}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with height less than 0', async () => {
      const height = 0;
      const response = await request.get(
        `/api/images?imagename=${defaultImageName}&width=${defaultWidth}&height=${height}`
      );

      expect(response.status).toBe(badRequest);
    });

    it('calls get images with non existing image', async () => {
      const imageName = 'test1';
      const response = await request.get(
        `/api/images?imagename=${imageName}&width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(response.status).toBe(notFound);
    });

    it('calls get images with existing image', async () => {
      const imageName = 'test';
      const extension = '.png';
      await request.get(
        `/api/images?imagename=${imageName}.jpg&width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(
        path.resolve(
          `${__dirname}/../../images/thumb/${imageName}_${defaultWidth}_${defaultHeight}.${extension}`
        )
      ).toBeTruthy();
    });
  });
});
