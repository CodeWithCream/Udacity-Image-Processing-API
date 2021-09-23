# Udacity-Image-Processing-API
This project is created for the Udacity Full Stack Javascript Developer Nanodegree Program. 

## Description
The project consists of the Node.js project serving the API to handle resizing and serving resized images. The purpose of the API is to place images into your frontend with the size set via URL parameters but also to store resized images and serve properly scaled versions of your images to the frontend to reduce page load size.

## Requirements
The API can only serve existing images:
- encenadaport.jpg
- fjord.jpg
- icelandwaterfall.jpg
- palmtunnel.jpg
- santamonica.jpg

Images cannot be uploaded through the API, but it can be added to the project manually by uploading it into the `/images/full` directory. 

## Usage
To use an API, frist you have to build and start the aplication:

```
npm run build
```
```
npm run start:dev //if you want to test typescript code
```
or 
```
npm run start:prod //if you want to test built code
```


If you want to make your life easier you can use:
```
npm run build-and-run-dev
```
or 
```
npm run build-and-run-prod
```

To use an API just enter the URL in the browser or create GET request in the Postman.
```
http://localhost:3001/api/images?imagename={image_name}&width={width}&height={height}
```

Example: http://{url}/api/images?imagename=fjord&width=100&height=100

## Testing

To run all tests, execute existing script
```
npm run build-and-test
```



