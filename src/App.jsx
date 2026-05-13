import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MangaDetail from './pages/MangaDetail';
import Reader from './pages/Reader';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateManga from './pages/CreateManga';
import AddChapter from './pages/AddChapter';
import NovelEditor from './pages/NovelEditor';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manga/:id" element={<MangaDetail />} />
            <Route path="/read/:id/:chapterId" element={<Reader />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-manga" element={<CreateManga />} />
            <Route path="/dashboard/add-chapter/:id" element={<AddChapter />} />
            <Route path="/dashboard/novel-editor/:id" element={<NovelEditor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
