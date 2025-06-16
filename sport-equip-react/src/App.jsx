import { Routes, Route, Link } from 'react-router-dom';
import Equipment from './pages/Equipment';
import Register from './pages/Register';
import Login from './pages/Login';
import UpdateEquipment from './pages/UpdateEquipment.jsx';

function Home() {
  return (
    <div
      style={{
        height: "20vh",
        width: '75vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingLeft: '25rem',
        paddingBottom: '10rem',
      }}
    >
      <h1 className="display-4 text-primary">Vitajte v aplikácii na požičiavanie športového vybavenia!</h1>
      <p className="lead text-muted">
        Tu si môžete prezerať, upravovať a spravovať športové vybavenie podľa svojich potrieb.
      </p>
      <p className="text-secondary">
        Naša aplikácia vám umožňuje vybrať si to najlepšie vybavenie pre vaše športové aktivity a spravovať ho jednoducho a rýchlo. Pripojte sa a začnite si užívať šport už teraz!
      </p>
      <div className="d-flex justify-content-center">
        <div className="btn-group" role="group" aria-label="Basic example">
          <Link to="/equipment" className="btn btn-primary btn-lg mx-2">
            Prezrite si vybavenie
          </Link>
          <Link to="/register" className="btn btn-primary btn-lg mx-2">
            Registrujte sa
          </Link>
          <Link to="/login" className="btn btn-primary btn-lg mx-2">
            Prihláste sa
          </Link>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand text-white fw-bold" to="/">Športové vybavenie</Link>
          <div className="navbar-nav ms-auto">
            <Link className="nav-link text-white" to="/equipment">Vybavenie</Link>
            <Link className="nav-link text-white" to="/login">Prihlásenie</Link>
            <Link className="nav-link text-white" to="/register">Registrácia</Link>
          </div>
        </div>
      </nav>

      <main className="container mt-5 pt-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/update/:id" element={<UpdateEquipment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

      </main>
    </>
  );
}

export default App;
