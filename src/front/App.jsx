import { BrowserRouter, Route, Routes } from "react-router-dom";

//Importamos las paginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegistrerQr from "./components/RegisterQR/RegistrerQr";
import File from "./components/File/File"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<RegistrerQr />} />
                <Route path="/File" element={<File />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
