import React from 'react'
import roadImage from '../../images/road.webp'; 

import { useState } from 'react';



function TrainTrack() {
  const [road, setRoad] = useState(["r","r", "r", "r", "r", "r", "r", "r", "r", "r"]);

  function generateRoad(){
    let ret = [];
    for(let i = 0; i < road.length; i++){
      if(road[i] == "r"){
        ret.push(<img src={roadImage} alt="road"/>)
      }
    }
    return ret;
  }

  return (
    <div className="land-type road">
      {generateRoad()}
    </div>
  )
}

export default TrainTrack
