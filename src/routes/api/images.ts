import express from 'express';
import { ArgumentError } from '../../exceptions/ArgumentError';
import { imageServiceSingleton } from '../../services/imageService';

const routes = express.Router();

routes.get('/', (req, res) => {
  const imageName: string = req.query.imagename as string;
  const width: number = parseInt(req.query.width as string, 10);
  const height: number = parseInt(req.query.height as string, 10);

  try {
    const response: string = imageServiceSingleton.processImage(
      imageName,
      width,
      height
    );

    res.sendFile(response);
  } catch (e) {
    console.log("Error details: " + e);
    switch (true) {
      case e instanceof ArgumentError:
        return res.status(400).send((e as Error).message);
      default:
        return res.status(500).send((e as Error).message);
    }
  }
});

export default routes;
