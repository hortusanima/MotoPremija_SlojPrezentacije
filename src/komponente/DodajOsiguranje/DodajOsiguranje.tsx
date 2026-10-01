import React, { useEffect, useState } from "react";
import {
  TipOsiguranjaDTO,
  vratiTipoveOsiguranja,
} from "../../servisi/TipOsiguranjaServis";
import { kreirajOsiguranje } from "../../servisi/OsiguranjeServis";
import { ApiGreska } from "../../pomocneFunkcije/servisneFunkcije";
import { useAutorizacija } from "../../kontekst/Autorizacija/AutorizacijaKontekst";
import { Modal } from "../Modal/Modal";
import { useModal } from "../../kontekst/Modal/ModalKontekst";

export const DodajOsiguranje: React.FC = () => {
  const [tipoviOsiguranja, setTipoviOsiguranja] = useState<TipOsiguranjaDTO[]>(
    [],
  );
  const [izabraniTip, setIzabraniTip] = useState<string>("");

  const [ucitavanjeTipova, setUcitavanjeTipova] = useState<boolean>(true);
  const [ucitavanjeSlanja, setUcitavanjeSlanja] = useState<boolean>(false);
  const [porukaGreske, setPorukaGreske] = useState<string>("");

  const { token } = useAutorizacija();
  const { otvorenModal, otvoriModal, zatvoriModal } = useModal();

  useEffect(() => {
    const ucitajTipove = async () => {
      setUcitavanjeTipova(true);
      try {
        const odgovor = await vratiTipoveOsiguranja(token);

        if (!("status" in odgovor)) {
          setTipoviOsiguranja(odgovor as TipOsiguranjaDTO[]);
        } else {
          setPorukaGreske("Neuspešno učitavanje tipova osiguranja.");
        }
      } catch (error) {
        setPorukaGreske("Greška pri komunikaciji sa serverom.");
      } finally {
        setUcitavanjeTipova(false);
      }
    };

    ucitajTipove();
  }, [token]);

  // Validacija: tip mora biti izabran i slanje ne sme biti u toku
  const dugmeOnemoguceno =
    izabraniTip.trim() === "" || ucitavanjeTipova || ucitavanjeSlanja;

  const upravljajPromenom = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIzabraniTip(e.target.value);
  };

  const upravljajSlanjem = async (e: React.FormEvent) => {
    e.preventDefault();
    setPorukaGreske("");
    setUcitavanjeSlanja(true);

    try {
      const odgovor = await kreirajOsiguranje(izabraniTip, token);

      if (
        odgovor &&
        "status" in odgovor &&
        typeof odgovor.status === "number" &&
        odgovor.status >= 400
      ) {
        const greska = odgovor as ApiGreska;

        switch (greska.status) {
          case 400:
            setPorukaGreske("Podaci nisu dobro uneti.");
            break;
          case 401:
            setPorukaGreske("Niste autorizovani.");
            break;
          case 404:
            setPorukaGreske(
              "Motocikl nije pronađen. Morate prvo dodati motocikl.",
            );
            break;
          case 409:
            setPorukaGreske("Osiguranje ovog tipa je već napravljeno.");
            break;
          case 500:
            setPorukaGreske("Serverska greška.");
            break;
          default:
            setPorukaGreske("Nepoznata greška.");
            break;
        }
      } else {
        otvoriModal("uspesno-dodato-osiguranje");
      }
    } catch (error) {
      setPorukaGreske("Nepoznata greška.");
    } finally {
      setUcitavanjeSlanja(false);
    }
  };

  return (
    <>
      <div className="forma-kontejner">
        <h2 className="naslov">Dodaj osiguranje</h2>

        <form onSubmit={upravljajSlanjem} className="forma">
          <div>
            <label htmlFor="nazivOsiguranja" className="labela">
              Izaberite tip osiguranja:
            </label>
            <select
              id="nazivOsiguranja"
              name="nazivOsiguranja"
              value={izabraniTip}
              onChange={upravljajPromenom}
              disabled={ucitavanjeTipova}
              className="ulaz"
              required
            >
              {ucitavanjeTipova ? (
                <option value="">Učitavaju se tipovi...</option>
              ) : (
                <>
                  <option value="">-- Izaberite tip osiguranja --</option>
                  {tipoviOsiguranja.map((tip, index) => (
                    <option key={index} value={tip.nazivOsiguranja}>
                      {tip.nazivOsiguranja}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <button type="submit" disabled={dugmeOnemoguceno} className="dugme">
            {ucitavanjeSlanja ? "Dodavanje..." : "Sačuvaj osiguranje"}
          </button>
        </form>

        {porukaGreske && <p className="forma__greska">{porukaGreske}</p>}
      </div>
    </>
  );
};
