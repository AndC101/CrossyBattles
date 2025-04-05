import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyComponent from './components/MyComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my-component" element={<MyComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
