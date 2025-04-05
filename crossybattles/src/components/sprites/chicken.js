import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Example side effect
    console.log('Component mounted');
    return () => {
      console.log('Component unmounted');
    };
  }, []);

  return (
    <div className="p-4 rounded-2xl shadow bg-white">
      <h1 className="text-xl font-bold mb-2">Hello from MyComponent</h1>
      <p className="text-gray-700">This is a reusable component template.</p>
    </div>
  );
};

export default MyComponent;
