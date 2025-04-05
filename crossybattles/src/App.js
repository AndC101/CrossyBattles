import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chicken from './components/sprites/chicken';
import MainMenu from './MainMenu';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/chicken" element={<Chicken />} />
        <Route path="/" element={<MainMenu />}/>
      </Routes>
    </BrowserRouter>
  );
}

