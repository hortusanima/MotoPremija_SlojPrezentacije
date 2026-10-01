import React, { useState } from "react";
import {
  PrijavaDTO,
  PrijavaOdgovor,
  prijaviKorisnika,
  VracenKorisnikDTO,
  vratiKorisnika,
} from "../../servisi/KorisnikServis";
import { ApiGreska } from "../../pomocneFunkcije/servisneFunkcije";
import { useAutorizacija } from "../../kontekst/Autorizacija/AutorizacijaKontekst";
import { useModal } from "../../kontekst/Modal/ModalKontekst";
import { useKorisnik } from "../../kontekst/Korisnik/KorisnikKontekst";

export const Prijava: React.FC = () => {
  const [podaci, setPodaci] = useState<PrijavaDTO>({
    imejl: "",
    lozinka: "",
  });

  const [porukaGreske, setPorukaGreske] = useState<string>("");
  const [ucitavanje, setUcitavanje] = useState<boolean>(false);
  const { prijava } = useAutorizacija();
  const { otvoriModal } = useModal();
  const { postaviKorisnika } = useKorisnik();

  const imejlValidan = (imejl: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(imejl);
  };

  const dugmeOnemoguceno =
    !imejlValidan(podaci.imejl) || podaci.lozinka.trim() === "" || ucitavanje;

  const upravljajPromenom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPodaci((prev: PrijavaDTO) => ({
      ...prev,
      [name]: value,
    }));
  };

  const upravljajPrijavom = async (e: React.FormEvent) => {
    e.preventDefault();
    setPorukaGreske("");
    setUcitavanje(true);

    try {
      const odgovor = await prijaviKorisnika(podaci);

      if (
        odgovor &&
        "status" in odgovor &&
        typeof odgovor.status === "number" &&
        odgovor.status >= 400
      ) {
        const greska = odgovor as ApiGreska;

        switch (greska.status) {
          case 400:
            setPorukaGreske("Podaci nisu u dobrom formatu.");
            break;
          case 401:
            setPorukaGreske("Kredencijali nisu ispravni.");
            break;
          case 500:
            setPorukaGreske("Serverska greška.");
            break;
          default:
            setPorukaGreske("Nepoznata greška.");
            break;
        }
      } else {
        const prijavaUspeh = odgovor as PrijavaOdgovor;

        if (prijavaUspeh.accessToken) {
          const korisnikOdgovor = await vratiKorisnika(
            prijavaUspeh.accessToken,
          );

          if (!("status" in korisnikOdgovor)) {
            postaviKorisnika(korisnikOdgovor as VracenKorisnikDTO);
          }
          otvoriModal("uspesna-prijava");
          prijava(prijavaUspeh.accessToken);
        }
      }
    } catch (error) {
      setPorukaGreske("Nepoznata greška.");
    } finally {
      setUcitavanje(false);
    }
  };

  return (
    <>
      <div className="forma-kontejner">
        <h2 className="naslov">Prijava</h2>

        <form onSubmit={upravljajPrijavom} className="forma">
          <div>
            <label htmlFor="imejl" className="labela">
              Imejl:
            </label>
            <input
              type="email"
              id="imejl"
              name="imejl"
              value={podaci.imejl}
              onChange={upravljajPromenom}
              placeholder="vasmejl@gmail.com"
              className="ulaz"
              required
            />
            {podaci.imejl !== "" && !imejlValidan(podaci.imejl) && (
              <small className="greska">
                Unesite ispravan format imejl adrese.
              </small>
            )}
          </div>

          <div>
            <label htmlFor="lozinka" className="labela">
              Lozinka:
            </label>
            <input
              type="password"
              id="lozinka"
              name="lozinka"
              value={podaci.lozinka}
              onChange={upravljajPromenom}
              placeholder="Unesite lozinku"
              required
              className="ulaz"
            />
          </div>

          <button type="submit" disabled={dugmeOnemoguceno} className="dugme">
            {ucitavanje ? "Prijavljivanje..." : "Prijavi se"}
          </button>
        </form>
        {porukaGreske && <p className="forma__greska">{porukaGreske}</p>}
      </div>
    </>
  );
};
