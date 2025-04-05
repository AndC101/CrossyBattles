import React, { useEffect, useState, useRef } from 'react';
import carImage from '../../images/car.webp';
import roadImage from '../../images/road.webp';
import waterImage from '../../images/water.png';
import grassImage from '../../images/grass.png';
import './players.css';

const Driver = () => {
  const [seed, setSeed] = useState();
  const [randomSeed, setRandomSeed] = useState();
  const [map, setMap] = useState([]);
  const canvasRef = useRef(null); // Ref for the canvas element

  const TERRAIN_IMAGES = {
    road: roadImage,
    grass: grassImage,
    water: waterImage,
  };

  const TERRAIN_TEMPLATES = [
    ['grass', 'grass', 'grass'],
    ['water', 'water'],
    ['road', 'road'],
  ];

  function nextSeed(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;

    return (a * seed + c) % m;
  }

  function generateTerrain() {
    let div = 2147483647 / TERRAIN_TEMPLATES.length;
    let index = Math.floor(randomSeed / div);
    console.log(index);
    let ret = [];
    ret = ret.concat(TERRAIN_TEMPLATES[index]);
    setRandomSeed(nextSeed(randomSeed));
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
    setRandomSeed(hash >>> 0);

    TERRAIN_TEMPLATES.sort(function (x, y) {
      return x.length - y.length;
    });
  }, []);

  useEffect(() => {
    if(randomSeed != undefined) setMap(generateTerrain());
  }, [seed]);

  useEffect(() => {
    if (map.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const tileSize = 50;
      let x = 0;
      let y = 0;

      map.forEach((terrain, i) => {
        const img = new Image();
        img.src = TERRAIN_IMAGES[terrain];
        img.onload = () => {
          console.log("image drawn");
          while(x < canvas.width) {
            ctx.drawImage(img, x, y, tileSize, tileSize);
            x += tileSize;
          }
          if (x >= canvas.width) {
            x = 0;
            y += tileSize;
          }
        };
      });
    }
  }, [map]);

  return (
    <div className="driver-screen">
      <div className="game-board">
        <canvas ref={canvasRef} width={500} height={500}></canvas>
      </div>
      <div className="sidebar">
        <img src={carImage} alt="Car"></img>
      </div>
    </div>
  );
};

export default Driver;