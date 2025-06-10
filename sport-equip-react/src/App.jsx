import { Routes, Route, Link } from 'react-router-dom';
import Equipment from './pages/Equipment';
import Register from './pages/Register';
import Login from './pages/Login';

function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-3">Vitajte v aplikácii na požičanie športového vybavenia</h1>
      <p className="lead">Vyberte si z menu vyššie, čo chcete robiť.</p>
    </div>
  );
}

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">Športové vybavenie</Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/equipment">Vybavenie</Link>
            <Link className="nav-link" to="/login">Prihlásenie</Link>
            <Link className="nav-link" to="/register">Registrácia</Link>
          </div>
        </div>
      </nav>

      <main className="container mt-4 mb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
