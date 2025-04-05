import React, { useState, useEffect } from 'react';
function Chicken() {

  // State to store the mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // State to store the position of the chicken
  const [position, setPosition] = useState({ x: 600, y: 530 });

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
          newX = Math.max(prevPosition.x - 20, 0);
          break;
        // case 's': // Move down
        //   newY = Math.min(prevPosition.y + 20, window.innerHeight - 100);
        //   break;
        case 'd': // Move right
          newX = Math.min(prevPosition.x + 20, window.innerWidth - 100);
          break;
        default:
          break;
      }

      return { x: newX, y: newY };
    });
  };

  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX, // Horizontal position of the mouse
      y: e.clientY, // Vertical position of the mouse
    });

    // Optionally log the mouse position to the console
    console.log(`Mouse position: X: ${e.clientX}, Y: ${e.clientY}`);
  };


  // Set up event listeners for keydown and keyup
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove); // Track mouse movement

    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove); // Clean up mousemove

    };
  }, [keyPressed]); // Re-run effect when keyPressed changes

  return (

    <div className="App">
      <img
        src = '/images/chicken (1).png' // Path to your chicken image
        alt="Chicken"
        style={{
          position: 'absolute',
          top: `${position.y}px`,
          left: `${position.x}px`,
          transition: 'top 0.1s, left 0.1s', // Optional: smooth movement
        }}
      />
    </div>
  );
}

export default Chicken;
