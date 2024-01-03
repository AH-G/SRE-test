import React from 'react'

function image_display() {
  return (
    <div>
      <img src='http://localhost:8080/resizer/image/width=1000,quality=75/https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-legend-of-zelda-breath-of-the-wild-2/3/38/Link2.png?width=1024'/>
      <img src='http://localhost:8080/resizer/image/width=750,quality=75/https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-legend-of-zelda-breath-of-the-wild-2/3/38/Link2.png?width=1024'/>
      <img src='http://localhost:8080/resizer/image/width=500,quality=75/https://oyster.ignimgs.com/mediawiki/apis.ign.com/the-legend-of-zelda-breath-of-the-wild-2/3/38/Link2.png?width=1024'/>
    </div>
  )
}

export default image_display
