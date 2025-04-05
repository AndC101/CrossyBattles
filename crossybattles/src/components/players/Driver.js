import React, { useEffect, useState, useRef } from 'react';
import carImage from '../../images/carpixel.png';
import roadImage from '../../images/road.webp';
import waterImage from '../../images/mud.webp';
import grassImage from '../../images/pixelgrass.png';
import './players.css';
import Chicken from './Chicken'

const Driver = () => {
  const [seed, setSeed] = useState();
  const randomSeed = useRef("");
  const [map, setMap] = useState([]);
  const canvasRef = useRef(null); // Ref for the canvas element
  const offScreenRef = useRef(null); // Ref for the canvas element
  const [selectedObstacle, setSelectedObstacle] = useState("none"); // State to store the selected obstacle
  const [carMoving, setCarMoving] = useState(false);
    const carImg = new Image();
    carImg.src = carImage;

  const cars = [];

  const TERRAIN_IMAGES = {
    "road": roadImage,
    "grass": grassImage,
    "water": waterImage,
  };

  const OBSTACLE_IMAGES = {
    "car": carImage,
    "grass": grassImage,
    "water": waterImage,
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
      updateCanvas();
    }
  }, [seed]);

  function updateCanvas(){
    console.log("updating canvas");
    if (map.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const offScreenCanvas = offScreenRef.current;
      const offScreenCtx = offScreenCanvas.getContext('2d');
      offScreenCanvas.width = canvas.width;
      offScreenCanvas.height = canvas.height; 

      const tileSize = 60;
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
            offScreenCtx.drawImage(img, x, y, tileSize, tileSize); // Draw the terrain
            x += tileSize; // Move to the next tile position
          }
         
        });
      }); 
    }
    

  }

  function updateCars(){
    const ctx = canvasRef.current.getContext('2d');
    if (offScreenRef.current) {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(offScreenRef.current, 0, 0);
      
    }
    

    for(let i = 0; i < cars.length; i++){
      const car = cars[i];
      car.x += (car.speed)/cars.length;
      ctx.drawImage(carImg, car.x, car.y);
    }
    
    window.requestAnimationFrame(updateCars);
  }

  function handleMousePressedCanvas(e){
    let tileSize = 60;
    let row = Math.floor(e.clientY / tileSize);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = OBSTACLE_IMAGES[selectedObstacle];
    img.onload = () => {
      ctx.drawImage(img, 0, row * tileSize, tileSize, tileSize); // Draw the image
    };
    if(selectedObstacle == "car"){
      cars.push({x: 0, y: row * tileSize, time: Date.now, speed: map[row * tileSize] == "road"? 1 : 0.5});
      console.log(cars)
      updateCars();
    }
    
  }

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     for(let i = 0; i < cars.length; i++){
  //       cars[i].x += 1;
  //     }
  //     updateCanvas();
  //     updateCars();
  //   }, 1000 / 60);
  //   return () => clearInterval(intervalId);
  // }, []);

  return (
    <div className="driver-screen">
      <div className="game-board">
        <canvas ref={offScreenRef} style={{display: "none"}} width={window.innerWidth} height={window.innerHeight}></canvas>
        <canvas onClick={(e) => {handleMousePressedCanvas(e)}} ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
      </div>
      <div className="sidebar">
        <img onClick={() => {setSelectedObstacle('car'); console.log(selectedObstacle);}} src={carImage} alt="Car"></img>
      </div>
      <Chicken></Chicken>
    </div>
  );
};

export default Driver;