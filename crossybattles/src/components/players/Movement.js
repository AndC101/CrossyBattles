import React, { useEffect, useState, useRef } from 'react';
import carImage from '../../images/carpixel.png';
import roadImage from '../../images/road.webp';
import waterImage from '../../images/mud.webp';
import grassImage from '../../images/pixelgrass.png';
import './players.css';
import Chicken from './chicken'

const Movement = ({move, seed}) => {
  const randomSeed = useRef("");
  const [map, setMap] = useState([]);
  const canvasRef = useRef(null); // Ref for the canvas element
  const [position, setPosition] = useState({ x: 600, y: 570 });

  const [keyPressed, setKeyPressed] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const terrainImageCache = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const offScreenRef = useRef(null); // Ref for the canvas element
  const [selectedObstacle, setSelectedObstacle] = useState("none"); // State to store the selected obstacle
  const [carMoving, setCarMoving] = useState(false);
    const carImg = new Image();
    carImg.src = carImage;

  const cars = [];
  

  // Handle keydown event
  const handleKeyDown = (e) => {
    // Only move if no key is being held down (no repeated keypresses)
    if (!keyPressed) {
      setKeyPressed(true); // Mark the key as pressed
      moveCanvas(e.key);

    }
  };

  // Handle keyup event to reset the keyPressed state
  const handleKeyUp = () => {
    setKeyPressed(false); // Allow the key to be pressed again after release
  };
  
  
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
    ['road', 'grass', 'grass'],
    ['grass', 'water', 'road'],
    ['road', 'road', 'grass'],
    ['road','water', 'grass'],
    ['road', 'road', 'grass']
  ];

  //generates a random seed for landscape
  function nextSeed(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 31;

    return (a * seed + c) % m;
  }

  //generates the terrain randomly
  function generateTerrain() {
    let div = 2147483647 / TERRAIN_TEMPLATES.length;
    let index = Math.floor(randomSeed.current / div);
    let ret = [];
    ret = ret.concat(TERRAIN_TEMPLATES[index]);
    randomSeed.current = nextSeed(randomSeed.current);
    return ret;
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    //clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyPressed]);

  useEffect(() => {
    if (seed !== null) {
      console.log("chicken seed: " + seed!==null);
      randomSeed.current = seed;

      let ret = [];
      for (let i = 0; i < 10; i++) {
        ret = ret.concat(generateTerrain());
      }
      setMap(ret);

      TERRAIN_TEMPLATES.sort(function (x, y) {
        return x.length - y.length;
      });
    }
  }, [seed]);

  //generates a new seed/map
  useEffect(() => {
    if (randomSeed.current !== undefined && imagesLoaded) {
      let ret = [];
      for (let i = 0; i < 10; i++) {
        ret = ret.concat(generateTerrain());
      }
      setMap(ret);
    }
  }, [seed, imagesLoaded]);
  
  //load terrain images into cache
  useEffect(() => {
    const loadImages = async () => {
      const promises = Object.entries(TERRAIN_IMAGES).map(([terrain, src]) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            terrainImageCache.current[terrain] = img;
            resolve();
          };
        });
      });
  
      await Promise.all(promises);
      setImagesLoaded(true);
    };
  
    loadImages();
  }, []);

  useEffect(() => {
    console.log("updating canvas");
    if (map.length > 0 && seed !== null) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // const offScreenCanvas = offScreenRef.current;
      // const offScreenCtx = offScreenCanvas.getContext('2d');
      // offScreenCanvas.width = canvas.width;
      // offScreenCanvas.height = canvas.height;

      const tileSize = 60;
      let x = 0;
      let y = 0;
      const tilesPerRow = Math.floor(canvas.width / tileSize);

      // Preload all images
      const imagePromises = map.map((terrain) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = TERRAIN_IMAGES[terrain];
          img.onload = () => resolve({img, terrain});
        });
      });

      Promise.all(imagePromises).then((images) => {
        images.forEach((data, i) => {
          const {img} = data;
          let x = 0;
          const y = i * tileSize + scrollOffset; // Calculate y position
          while (x < canvas.width) {
            ctx.drawImage(img, x, y, tileSize, tileSize); // Draw the image
            // offScreenCtx.drawImage(img, x, y, tileSize, tileSize); // Draw the terrain
            x += tileSize; // Move to the next tile position
          }

        });
      });
    }
  }, [map, scrollOffset, imagesLoaded]);

  const moveCanvas = (key) => {
    switch (key) {
      case 'w':
        setScrollOffset(prev => prev + 40);
        move({ x: position.x, y: position.y - 40});
        setPosition({ x: position.x, y: position.y - 40})
        break;
      case 's':
        setScrollOffset(prev => prev - 40);
        move({ x: position.x, y: position.y + 40});
        setPosition({ x: position.x, y: position.y + 40})
        break;
    }
  };
    

  // Move the canvas based on the pressed key
  // const moveCanvas = (key) => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   switch (key) {
  //     case 'w': //moves up, the canvas wil move down
  //       ctx.translate(0, 20);
  //       updateCanvas();
  //       console.log("w pressed");
  //       break;
  //     case 's':
  //       ctx.translate(0, -20);
  //       updateCanvas();
  //       console.log("s pressed");
  //       break;
  //   }
  // };


  return (
    <div className="driver-screen">
      <div className="game-board">
        {/*<canvas ref={offScreenRef} style={{display: "none"}} width={window.innerWidth} height={window.innerHeight}></canvas>*/}
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        loadImages();
      </div>
      <Chicken move={move} position={position} setPosition={setPosition}/>
    </div>
  );
};

export default Movement;  