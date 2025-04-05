import React, { useEffect, useState } from 'react'
import carImage from '../../images/car.webp'; // Update this path to the correct location of your car image
import Road from '../land-types/Road';
import Water from '../land-types/Water';
import Grass from '../land-types/Grass';
import TrainTrack from '../land-types/TrainTrack';
import './players.css';
function Driver() {
  const mapLength = 100;
  const [seed, setSeed] = useState();
  const [map, setMap] = useState([]);

  const TERRAIN_TEMPLATES = [
    [<Grass></Grass>,<Grass></Grass>,<Grass></Grass>,<Grass></Grass>],
    [<Water></Water>,<Water></Water>],
    [<Road></Road>,<Grass></Grass>,<Road></Road>],
  ]

  function nextSeed(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;

    return (a * seed + c) % m;
  }

  function generateTerrain(){
    
    let ret = [];
    ret.concat();

    return ret;
  }

  useEffect(() => {
    TERRAIN_TEMPLATES.sort(function(x, y) {
      return x.length - y.length;
    });
    setMap(generateTerrain());
  }, [])

  useEffect(() => {
    const t = performance.now(); 
    const r = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const combined = t.toString() + r.toString();

    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32-bit integer
    }
    
    setSeed(hash >>> 0);
  },[])

  useEffect(() => {
    console.log("Map generated: ", map);
  },[map])

  return (
    <div className="driver-screen">
      <div className="game-board">
        <canvas>

        </canvas>
      </div>
      <div className="sidebar">
        <img src={carImage}></img>
      </div>
    </div>
  )
}

export default Driver
