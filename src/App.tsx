import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Pocetna from "./stranice/Pocetna/Pocetna";
import Futer from "./komponente/Futer/Futer";
import { NavigacijaProvajder } from "./kontekst/Navigacija/NavigacijaKontekst";
import NavigacijaPracenje from "./kontekst/Navigacija/NavigacijaPracenje";
import { ModalProvajder } from "./kontekst/Modal/ModalKontekst";
import { AutorizacijaProvajder } from "./kontekst/Autorizacija/AutorizacijaKontekst";
import Heder from "./komponente/Heder/Heder";
import { KorisnikProvajder } from "./kontekst/Korisnik/KorisnikKontekst";
import VaseInformacije from "./stranice/VaseInformacije/VaseInformacije";
import PregledOsiguranja from "./stranice/PregledOsiguranja/PregledOsiguranja";

function App() {
  return (
    <>
      <BrowserRouter>
        <AutorizacijaProvajder>
          <NavigacijaProvajder>
            <NavigacijaPracenje />
            <KorisnikProvajder>
              <ModalProvajder>
                <Heder />
                <Routes>
                  <Route path="/pocetna" element={<Pocetna />} />
                  <Route
                    path="/vase-informacije"
                    element={<VaseInformacije />}
                  />
                  <Route
                    path="/pregled-osiguranja"
                    element={<PregledOsiguranja />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to="/pocetna" replace />}
                  />
                </Routes>
                <Futer />
              </ModalProvajder>
            </KorisnikProvajder>
          </NavigacijaProvajder>
        </AutorizacijaProvajder>
      </BrowserRouter>
    </>
  );
}

export default App;
