import React, { useEffect, useState, useRef } from 'react';
import carImage from '../../images/carpixel.png';
import roadImage from '../../images/road.webp';
import waterImage from '../../images/water.png';
import grassImage from '../../images/grass.png';
import './players.css';
import Chicken from './chicken'

const Movement = () => {
  const [seed, setSeed] = useState();
  const randomSeed = useRef("");
  const [map, setMap] = useState([]);
  const canvasRef = useRef(null); // Ref for the canvas element
  
  const [keyPressed, setKeyPressed] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  const terrainImageCache = useRef({});
  const [imagesLoaded, setImagesLoaded] = useState(false);


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

  //creates the initial seed
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
    

  //regenerate a new canvas
  function updateCanvas() {
    if (map.length > 0 && Object.keys(terrainImageCache.current).length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      const tileSize = 50;
  
      map.forEach((terrain, i) => {
        const img = terrainImageCache.current[terrain];
        const y = i * tileSize + scrollOffset;
        let x = 0;
  
        while (x < canvas.width) {
          ctx.drawImage(img, x, y, tileSize, tileSize);
          x += tileSize;
        }
      });
    }
  }
  

  const moveCanvas = (key) => {
    switch (key) {
      case 'w':
        setScrollOffset(prev => prev + 20);
        break;
      case 's':
        setScrollOffset(prev => prev - 20);
        break;
    }
  };
  
  useEffect(() => {
    if (map.length > 0 && imagesLoaded) {
      updateCanvas();
    }
  }, [map, scrollOffset, imagesLoaded]);
    

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
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        loadImages();
      </div>
      <Chicken></Chicken>
    </div>
  );
};

export default Movement;