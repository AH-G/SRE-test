import React from 'react'
import Image_display from '/components/image-display.js'
import { httpRequestCount } from '/components/metrics.js';

function index({ backendIp, imageUrl}) {
  return (
    <div>
      {/* <Image_display backendIp={backendIp} imageUrl={imageUrl} />       */}
      <Image_display imageUrl={imageUrl} />
    </div>
  )
}

export async function getServerSideProps() {
  // Get the environment variables from the server environment
  const backendIp = process.env.NEXT_PUBLIC_BACKEND_IP;
  const imageUrl  = process.env.NEXT_PUBLIC_IMAGE_URL;
  //console.log("this is the main index function")
  //console.log(backendIp);
  //console.log(imageUrl);
  httpRequestCount.inc({ path: 'index' });
  // Return them as props
  return {
    props: {
      backendIp, // Send this as a prop to the component
      imageUrl,  // Send this as a prop to the component
    },
  };
}

export default index
