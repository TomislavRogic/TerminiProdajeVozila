import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavbarTerminiProdajeVozila from './components/NavbarTerminiProdajeVozila';
import { Container} from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import { RouteNames } from './constants';
import Pocetna from './pages/Pocetna';
import OsobePregled from './pages/osobe/OsobePregled';
import OsobePromjena from './pages/osobe/OsobePromjena';
import OsobeDodaj from './pages/osobe/OsobeDodaj';
import VozilaPregled from './pages/vozila/VozilaPregled';
import VozilaPromjena from './pages/vozila/VozilaPromjena';
import VozilaDodaj from './pages/vozila/VozilaDodaj';
import TerminiPregled from './pages/termini/TerminiPregled';
import TerminiDodaj from './pages/termini/TerminiDodaj';
import TerminiPromjena from './pages/termini/TerminiPromjena'; 

function App() {
  return (
    <>
      <Container>
        <NavbarTerminiProdajeVozila />
        <Routes>
          <Route path={RouteNames.HOME} element={<Pocetna />} />
          <Route path={RouteNames.OSOBA_PREGLED} element={<OsobePregled />} />
          <Route path={RouteNames.OSOBA_DODAJ} element={<OsobeDodaj />} />
          <Route path={RouteNames.OSOBA_PROMJENA} element={<OsobePromjena />} />

          <Route path={RouteNames.VOZILA_PREGLED} element={<VozilaPregled />} />
          <Route path={RouteNames.VOZILA_DODAJ} element={<VozilaDodaj />} />
          <Route path={RouteNames.VOZILA_PROMJENA} element={<VozilaPromjena />} />

          <Route path={RouteNames.TERMINI_PREGLED} element={<TerminiPregled />} />
          <Route path={RouteNames.TERMINI_DODAJ} element={<TerminiDodaj />} />
          <Route path={RouteNames.TERMINI_PROMJENA} element={<TerminiPromjena />} />
         
          
        </Routes>
        <hr />
        &copy; Tomislav Rogić 2024
      </Container>
    </>
  );
}

export default App;