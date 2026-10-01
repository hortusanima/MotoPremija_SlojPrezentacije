import React, { useEffect, useState } from "react";
import { useAutorizacija } from "../../kontekst/Autorizacija/AutorizacijaKontekst";
import { useModal } from "../../kontekst/Modal/ModalKontekst";
import {
  VracenoOsiguranjeDTO,
  vratiSvaOsiguranja,
  kreirajDokument,
  DokumentOdgovor,
} from "../../servisi/OsiguranjeServis";
import { ApiGreska } from "../../pomocneFunkcije/servisneFunkcije";
import "./pregledOsiguranja.css";
import { useKorisnik } from "../../kontekst/Korisnik/KorisnikKontekst";

export const PregledOsiguranja: React.FC = () => {
  const { autorizovan, token } = useAutorizacija();
  const { korisnik } = useKorisnik();
  const { otvoriModal, otvorenModal } = useModal();

  const [osiguranja, setOsiguranja] = useState<VracenoOsiguranjeDTO[]>([]);
  const [ucitavanje, setUcitavanje] = useState<boolean>(true);
  const [porukaGreske, setPorukaGreske] = useState<string>("");
  const [ucitavanjeDokumenta, setUcitavanjeDokumenta] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const ucitajOsiguranja = async () => {
      if (!autorizovan || !token) {
        setOsiguranja([]);
        setUcitavanje(false);
        return;
      }

      setUcitavanje(true);
      setPorukaGreske("");

      try {
        const odgovor = await vratiSvaOsiguranja(token);

        if (odgovor && !("status" in odgovor)) {
          setOsiguranja(odgovor as VracenoOsiguranjeDTO[]);
        } else if (
          odgovor &&
          "status" in odgovor &&
          typeof odgovor.status === "number" &&
          odgovor.status >= 400
        ) {
          const greska = odgovor as ApiGreska;
          if (greska.status === 401) {
            setPorukaGreske("Niste autorizovani.");
          } else {
            setPorukaGreske("Greška pri učitavanju osiguranja.");
          }
        } else {
          setOsiguranja([]);
        }
      } catch (error) {
        setPorukaGreske("Greška pri komunikaciji sa serverom.");
      } finally {
        setUcitavanje(false);
      }
    };

    ucitajOsiguranja();
  }, [autorizovan, token, otvorenModal]);

  const postojeciKorisnik = autorizovan && korisnik;

  const preuzmiDokument = async (brPolise: string) => {
    if (!token) return;

    setUcitavanjeDokumenta(brPolise);
    try {
      const odgovor = await kreirajDokument(brPolise, token);

      if (odgovor && !("status" in odgovor)) {
        const uspeh = odgovor as DokumentOdgovor;
        if (uspeh.downloadUrl) {
          window.open(uspeh.downloadUrl, "_blank");
        }
      } else {
        alert("Neuspešno generisanje dokumenta.");
      }
    } catch (error) {
      alert("Došlo je do greške pri preuzimanju dokumenta.");
    } finally {
      setUcitavanjeDokumenta(null);
    }
  };

  return (
    <main className="pregledOsiguranja">
      <h1 className="naslov">Aktivna Osiguranja</h1>

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

      {porukaGreske && <p className="strana__greska">{porukaGreske}</p>}

      {ucitavanje ? (
        <p>Učitavanje osiguranja...</p>
      ) : (
        <>
          {postojeciKorisnik && !porukaGreske && (
            <table className="tabela">
              <thead>
                <tr>
                  <th>Broj polise</th>
                  <th>Godišnja premija</th>
                  <th>Dokument</th>
                </tr>
              </thead>
              <tbody>
                {osiguranja.length > 0 ? (
                  osiguranja.map((o) => (
                    <tr key={o.brPolise}>
                      <td>{o.brPolise}</td>
                      <td>{o.godisnjaPremija} RSD</td>
                      <td>
                        <button
                          type="button"
                          className="dugme dugme--sekundarno"
                          disabled={ucitavanjeDokumenta === o.brPolise}
                          onClick={() => preuzmiDokument(o.brPolise)}
                        >
                          {ucitavanjeDokumenta === o.brPolise
                            ? "Generisanje..."
                            : "Preuzmi dokument"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Nema aktivnih osiguranja.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <div className="pregled-osiguranja__akcije">
            <button
              type="button"
              className="dugme"
              disabled={!autorizovan}
              onClick={() => otvoriModal("dodaj-osiguranje")}
            >
              Dodaj osiguranje
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default PregledOsiguranja;
