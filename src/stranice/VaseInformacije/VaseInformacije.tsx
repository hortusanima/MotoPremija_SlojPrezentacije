import React, { useEffect, useState } from "react";
import { useAutorizacija } from "../../kontekst/Autorizacija/AutorizacijaKontekst";
import { useKorisnik } from "../../kontekst/Korisnik/KorisnikKontekst";
import { useModal } from "../../kontekst/Modal/ModalKontekst";
import { MotociklDTO, vratiMotocikl } from "../../servisi/MotociklServis";
import "./vaseInformacije.css";

const VaseInformacije: React.FC = () => {
  const { autorizovan, token } = useAutorizacija();
  const { korisnik } = useKorisnik();
  const { otvoriModal, otvorenModal } = useModal();

  const [motocikl, setMotocikl] = useState<MotociklDTO | null>(null);
  const [greskaMotocikl, setGreskaMotocikl] = useState<boolean>(false);

  useEffect(() => {
    const ucitajMotocikl = async () => {
      if (!autorizovan || !token) {
        setMotocikl(null);
        return;
      }

      try {
        const odgovor = await vratiMotocikl(token);

        if (odgovor && !("status" in odgovor)) {
          setMotocikl(odgovor as MotociklDTO);
          setGreskaMotocikl(false);
        } else {
          setMotocikl(null);
          setGreskaMotocikl(true);
        }
      } catch (error) {
        setMotocikl(null);
        setGreskaMotocikl(true);
      }
    };

    ucitajMotocikl();
  }, [autorizovan, token, otvorenModal]);

  const postojeciKorisnik = autorizovan && korisnik;

  return (
    <main className="vaseInformacije">
      <h1 className="naslov">Vaše informacije</h1>

      {!postojeciKorisnik && (
        <>
          <p className="strana__greska">
            Korisnik treba da se prijavi kako bi video svoje podatke.
          </p>
          <button className="dugme" onClick={() => otvoriModal("prijava")}>
            Prijavi se
          </button>
        </>
      )}

      {postojeciKorisnik && (
        <div className="vaseInformacije__sve">
          <div className="vaseInformacije__osiguranik">
            <h2 className="podnaslov">Podaci o osiguraniku</h2>
            <p>
              <b>Ime i prezime:</b>{" "}
              {postojeciKorisnik ? `${korisnik.ime} ${korisnik.prezime}` : "/"}
            </p>
            <p>
              <b>JMBG:</b> {postojeciKorisnik ? korisnik.jmbg : "/"}
            </p>
            <p>
              <b>Broj vozačke dozvole:</b>{" "}
              {postojeciKorisnik ? korisnik.brVozackeDozvole : "/"}
            </p>
          </div>

          {motocikl ? (
            <div className="vaseInformacije__motocikl">
              <h2 className="podnaslov">Podaci o motociklu</h2>
              <p>
                <b>Brend i model:</b> {motocikl.brendModel}
              </p>
              <p>
                <b>Godina proizvodnje:</b> {motocikl.godinaProizvodnje}
              </p>
              <p>
                <b>Broj saobraćajne dozvole:</b> {motocikl.brSaobracajneDozvole}
              </p>
              <p>
                <b>Primarna upotreba:</b> {motocikl.primarnaUpotreba}
              </p>

              <button
                type="button"
                className="dugme"
                onClick={() => otvoriModal("izmeni-motocikl")}
              >
                Izmeni motocikl
              </button>
            </div>
          ) : (
            <div className="vaseInformacije__motocikl-prazno">
              <button
                type="button"
                className="dugme"
                disabled={!autorizovan}
                onClick={() => otvoriModal("dodaj-motocikl")}
              >
                Dodaj motocikl
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default VaseInformacije;
