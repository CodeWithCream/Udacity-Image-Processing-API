import express from 'express';
import { ArgumentError } from '../../exceptions/ArgumentError';
import { NotFoundError } from '../../exceptions/NotFoundError';
import { ImageService } from '../../services/imageService';

const routes = express.Router();
const imageServiceImpl = new ImageService(`${__dirname}/../../../images`);

routes.get('/', async (req, res) => {
  console.log(req.query);

  const imageName: string = req.query.imagename as string;
  const width: number = parseInt(req.query.width as string, 10);
  const height: number = parseInt(req.query.height as string, 10);

  try {
    const response: string = await imageServiceImpl.processImage(
      imageName,
      width,
      height
    );

    console.log(`Sending file ${response}`);
    res.sendFile(response);
  } catch (e) {
    console.log(e);
    switch (true) {
      case e instanceof ArgumentError:
        return res.status(400).send((e as Error).message);
      case e instanceof NotFoundError:
        return res.status(404).send((e as Error).message);
      default:
        return res.status(500).send((e as Error).message);
    }
  }
});

export default routes;
