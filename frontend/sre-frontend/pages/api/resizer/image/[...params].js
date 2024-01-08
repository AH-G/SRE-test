import fetch from 'node-fetch';
import {parse} from 'url';

export default async function handler(req, res) {

const initialurl = req.url;
//   console.log(`initial url is ${initialurl}`)
  const tempurl = initialurl.split('/').slice(4);
  let width = '';
  let quality = '';
  const resizingParameters = tempurl[0].split(',')
  width = resizingParameters.find(param => param.startsWith("width="))?.split('=')[1];
  quality = resizingParameters.find(param => param.startsWith("quality="))?.split('=')[1];
  

  let newimageurl = tempurl.slice(1);
   
  if (newimageurl[0] == 'http:') {
    newimageurl[0] = 'http:/';
  }
  else if (newimageurl[0] == 'https:') {
    newimageurl[0] = 'https:/';
  }

  newimageurl = newimageurl.join('/');
  
//   const params = req.query.params;
//   console.log(`this is params ${params}`);
//   const resize_parameters = params.find(param => param.includes("width=") && param.includes("quality=")).split(',');
//   console.log(`this is resize_parameters ${resize_parameters[0]}`)

  // There is some error handling that needs to be done for the wrong API calls.
  // Extract parameters (assuming URL format: /resizer/image/width=80/quality=75/https://s3.example.com/bucket/image.png)
  // Extract width and quality
  // const width = resize_parameters.find(param => param.startsWith("width="))?.split('=')[1];
  // const quality = resize_parameters.find(param => param.startsWith("quality="))?.split('=')[1];
  
//   const checkingurl = params.slice(1)
//   if (params[1] == 'http:') {
//     params[1] = 'http://'
//   }
//   else if (params[1] == 'https:') {
//     params[1] = 'https://'
//   }
//   console.log(`params[1] is ${params[1]}`)
//   const url = params.filter(param => !param.includes("width=") && !param.includes("quality="));
//   console.log(`this url params and the remamining parameters ${url}`);
//   const imageUrl = checkingurl.join('/'); // Joining remaining parts for the URL
//   console.log(`the url is ${imageUrl}`);
  const backendIP = process.env.NEXT_PUBLIC_BACKEND_IP
  // Construct the URL for the backend service
  const backendUrl = `http://${backendIP}/resizer/image/width=${width},quality=${quality}/${newimageurl}`;
//   console.log("this is the api route")
//   console.log(`this is width == ${width}`)
//   console.log(`this is quality == ${quality}`)
//   console.log(backendUrl)
  try {
    // Fetch the image from the backend service
    const backendResponse = await fetch(backendUrl);

    // Check if the image was fetched successfully
    if (!backendResponse.ok) {
      throw new Error(`Failed to fetch image: ${backendResponse.statusText}`);
    }

    // Get the image buffer
    const imageBuffer = await backendResponse.buffer();

    // Set the appropriate content type (assuming JPEG - adjust as needed)
    res.setHeader("Content-Type", "image/jpeg");

    // Send the image buffer to the client
    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing image" });
  }
}
