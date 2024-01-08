import React from 'react';

const ImageDisplay = ( { imageUrl } ) => {
    // console.log("this is in the Image display function ")
  return (
    <div>
      <img src={`/api/resizer/image/width=1000,quality=75/${imageUrl}`} />
      <img src={`/api/resizer/image/width=750,quality=75/${imageUrl}`} />
      <img src={`/api/resizer/image/width=500,quality=75/${imageUrl}`} />
    </div>
  );
}

export default ImageDisplay;