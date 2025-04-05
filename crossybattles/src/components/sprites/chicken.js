import React, { useState, useEffect } from 'react';

function App() {
  // State to store the position of the chicken
  const [position, setPosition] = useState({ x: 100, y: 100 });

  // Handle keyboard events
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'w': // Move up
        setPosition((prevPosition) => ({ ...prevPosition, y: prevPosition.y - 10 }));
        break;
      case 'a': // Move left
        setPosition((prevPosition) => ({ ...prevPosition, x: prevPosition.x - 10 }));
        break;
      case 's': // Move down
        setPosition((prevPosition) => ({ ...prevPosition, y: prevPosition.y + 10 }));
        break;
      case 'd': // Move right
        setPosition((prevPosition) => ({ ...prevPosition, x: prevPosition.x + 10 }));
        break;
      default:
        break;
    }
  };

  // Add event listener for keydown event
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="App">
      {/* Image of the chicken */}
      <img
        src="./chicken.png" // Replace with your chicken image path
        alt="Chicken"
        style={{
          position: 'absolute',
          top: `${position.y}px`,
          left: `${position.x}px`,
          transition: 'top 0.1s, left 0.1s', // Optional: for smooth movement
        }}
      />
    </div>
  );
}

export default App;
