import React, { useEffect, useState, useRef } from 'react';
import carImage from '../../images/car.webp';
import roadImage from '../../images/road.webp';
import waterImage from '../../images/water.png';
import grassImage from '../../images/grass.png';
import './players.css';
import Chicken from './Chicken'

const Driver = () => {
  const [seed, setSeed] = useState();
  const randomSeed = useRef("");
  const [map, setMap] = useState([]);
  const canvasRef = useRef(null); // Ref for the canvas element
  const [selectedObstacle, setSelectedObstacle] = useState("none"); // State to store the selected obstacle

  const TERRAIN_IMAGES = {
    road: roadImage,
    grass: grassImage,
    water: waterImage,
  };

  const OBSTACLE_IMAGES = {
    car: carImage,
    grass: grassImage,
    water: waterImage,
  };

  const TERRAIN_TEMPLATES = [
    ['grass'],
    ['water'],
    ['road'],
  ];

  function nextSeed(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 31;

    return (a * seed + c) % m;
  }

  function generateTerrain() {
    let div = 2147483647 / TERRAIN_TEMPLATES.length;
    let index = Math.floor(randomSeed.current / div);
    let ret = [];
    ret = ret.concat(TERRAIN_TEMPLATES[index]);
    randomSeed.current = nextSeed(randomSeed.current);
    return ret;
  }

  useEffect(() => {
    const t = performance.now();
    const r = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const combined = t.toString() + r.toString();

    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    hash = Math.abs(hash);
    setSeed(hash >>> 0);
    randomSeed.current = hash >>> 0;

    TERRAIN_TEMPLATES.sort(function (x, y) {
      return x.length - y.length;
    });
  }, []);

  useEffect(() => {
    if(randomSeed.current != undefined){
      let ret = [];
      for(let i = 0; i < 10; i++){
       ret = ret.concat(generateTerrain());
      }
      setMap(ret);
      console.log(map);
      updateCanvas();
    }
  }, [seed]);

  function updateCanvas(){
    if (map.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      const tileSize = 50;
      let x = 0;
      let y = 0;
      const tilesPerRow = Math.floor(canvas.width / tileSize);

      // Preload all images
      const imagePromises = map.map((terrain) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = TERRAIN_IMAGES[terrain];
          img.onload = () => resolve({ img, terrain });
        });
      });

      Promise.all(imagePromises).then((images) => {
        images.forEach((data, i) => {
          const { img } = data;
          let x = 0;
          const y = i * tileSize; // Calculate y position
          while(x < canvas.width){
            ctx.drawImage(img, x, y, tileSize, tileSize); // Draw the image
            x += tileSize; // Move to the next tile position
          }
         
        });
      });

       
    }

     
  }

  return (
    <div className="driver-screen">
      <div className="game-board">
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
      </div>
      <div className="sidebar">
        <img src={carImage} alt="Car"></img>
      </div>
      <Chicken></Chicken>
    </div>
  );
};

export default Driver;