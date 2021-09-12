import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

const ok = 200;
const badRequest = 400;
const notFound = 404;

const defaultImageName = 'image';
const defaultWidth = 100;
const defaultHeight = 100;

describe('Test api responses', () => {
  describe('Test get images', () => {
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
      const imageName = 'image.png';

      const response = await request.get(
        `/api/images?imagename=${imageName}&width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(response.status).toBe(ok);
    });

    it('calls get images with filename and invalid extension', async () => {
      const imageName = 'image.xyz';

      const response = await request.get(
        `/api/images?imagename=${imageName}&width=${defaultWidth}&height=${defaultHeight}`
      );

      expect(response.status).toBe(notFound);
    });

    it('calls get images with invalid filename', async () => {
      const imageName = '_image';

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
  });
});
