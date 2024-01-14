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
  

  const backendIP = process.env.NEXT_PUBLIC_BACKEND_IP
  // Construct the URL for the backend service
  const backendUrl = `http://${backendIP}/resizer/image/width=${width},quality=${quality}/${newimageurl}`;

  try {
    // Fetch the image from the backend service
    const backendResponse = await fetch(backendUrl);

    // Check if the image was fetched successfully
    if (!backendResponse.ok) {
      throw new Error(`Failed to fetch image: ${backendResponse.statusText}`);
    }

    // Get the image buffer
    const imageBuffer = await backendResponse.buffer();

    res.setHeader("Content-Type", "image/jpeg");

    // Send the image buffer to the client
    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing image" });
  }
}
