import React, {useEffect, useRef, useState} from 'react';
import carImage from "../images/carpixel.png";
import Chicken from "./players/chicken";
import roadImage from "../images/road.webp";
import grassImage from "../images/grass.png";
import waterImage from "../images/water.png";

const ChickenParent = ({cars, move, seed}) => {
    const randomSeed = useRef("");
    const [map, setMap] = useState([]);
    const canvasRef = useRef(null); // Ref for the canvas element
    const offScreenRef = useRef(null); // Ref for the canvas element
    const [selectedObstacle, setSelectedObstacle] = useState("none"); // State to store the selected obstacle
    // State to store the position of the chicken
    const [position, setPosition] = useState({x: 600, y: 570});

    // Flag to prevent continuous movement while holding the key
    const [keyPressed, setKeyPressed] = useState(false);

    // Handle keydown event
    const handleKeyDown = (e) => {
        // Only move if no key is being held down (no repeated keypresses)
        if (!keyPressed) {
            setKeyPressed(true); // Mark the key as pressed
            moveChicken(e.key);
        }
    };

    // Handle keyup event to reset the keyPressed state
    const handleKeyUp = () => {
        setKeyPressed(false); // Allow the key to be pressed again after release
    };

    // Move the chicken based on the pressed key
    const moveChicken = (key) => {
        setPosition((prevPosition) => {
            let newX = prevPosition.x;
            let newY = prevPosition.y;

            switch (key) {
                // case 'w': // Move up
                //   newY = Math.max(prevPosition.y - 20, 0);
                //   break;
                case 'a': // Move left
                    newX = Math.max(prevPosition.x - 40, 0);
                    break;
                // case 's': // Move down
                //   newY = Math.min(prevPosition.y + 20, window.innerHeight - 100);
                //   break;
                case 'd': // Move right
                    newX = Math.min(prevPosition.x + 40, window.innerWidth - 100);
                    break;
                default:
                    break;
            }
            move({x: newX, y: newY})
            return {x: newX, y: newY};
        });
    };

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
        ['road', 'grass', 'grass'],
        ['water', 'water', 'road'],
        ['road', 'road', 'grass'],
        ['road', 'water', 'grass'],
        ['water', 'road', 'grass']
    ];

    function nextSeed(temp_seed) {
        const a = 1664525;
        const c = 1013904223;
        const m = 2 ** 31;

        return (a * temp_seed + c) % m;
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

    useEffect(() => {
        console.log("updating canvas");
        if (map.length > 0 && seed !== null) {
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
                    img.onload = () => resolve({img, terrain});
                });
            });

            Promise.all(imagePromises).then((images) => {
                images.forEach((data, i) => {
                    const {img} = data;
                    let x = 0;
                    const y = i * tileSize; // Calculate y position
                    while (x < canvas.width) {
                        ctx.drawImage(img, x, y, tileSize, tileSize); // Draw the image
                        offScreenCtx.drawImage(img, x, y, tileSize, tileSize); // Draw the terrain
                        x += tileSize; // Move to the next tile position
                    }

                });
            });
        }
    }, [map]);


    // Set up event listeners for keydown and keyup
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Clean up event listeners
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [keyPressed]); // Re-run effect when keyPressed changes

    return (
        <div className="driver-screen">
            <div className="game-board">
                <canvas ref={offScreenRef} style={{display: "none"}} width={window.innerWidth}
                        height={window.innerHeight}></canvas>
                <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
            </div>
            <Chicken position={position}/>
        </div>
    );
}

export default ChickenParent;
