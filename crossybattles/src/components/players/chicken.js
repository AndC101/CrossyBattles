import React, {useEffect, useState} from 'react';

const Chicken = ({move, position, disabled, setPosition}) => {
    // State to store the mouse position
    const [mousePosition, setMousePosition] = useState({x: 0, y: 0});
    const [newPos, setPos] = useState({x: 0, y: 0})

    useEffect(() => {
        if(!disabled)
        {
            setPos({x: position.x, y: 570})
        }
        else(
            setPos(position)
        )
    }, [position]);

    // State to store the position of the chicken

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
        if (!disabled) {
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
                move({x: newX, y: newY});
                return {x: newX, y: newY};
            });
        }
    };


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

        <div className="App">
            <img
                src='/images/chicken (1).png' // Path to your chicken image
                alt="Chicken"
                style={{
                    position: 'absolute',
                    top: `${newPos.y}px`,
                    left: `${newPos.x}px`,
                    transition: 'top 0.1s, left 0.1s', // Optional: smooth movement
                }}
            />
        </div>
    );
}

export default Chicken;
