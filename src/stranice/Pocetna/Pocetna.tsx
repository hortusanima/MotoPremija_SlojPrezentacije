import { useAutorizacija } from "../../kontekst/Autorizacija/AutorizacijaKontekst";
import { useModal } from "../../kontekst/Modal/ModalKontekst";
import "./pocetna.css";

const Pocetna: React.FC = () => {
  const { autorizovan } = useAutorizacija();
  const { otvoriModal } = useModal();
  return (
    <>
      <main className="pocetna">
        <h1 className="naslov">Dobro došli u Moto Premije!</h1>
        <p className="pocetna__opis">
          {autorizovan ? (
            <span>Dobrodošli nazad!</span>
          ) : (
            <span>
              Prijavite se ili se registrujte da biste osigurali svoj motocikl.
            </span>
          )}
        </p>
        <div className="pocetna__dugmad-kontejner">
          {autorizovan ? (
            <>
              <button className="dugme">Vaše informacije</button>
              <button className="dugme">Pogledaj polise</button>
            </>
          ) : (
            <>
              <button className="dugme" onClick={() => otvoriModal("prijava")}>
                Prijavi se
              </button>
              <button
                className="dugme"
                onClick={() => otvoriModal("registracija")}
              >
                Registruj se
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Pocetna;
