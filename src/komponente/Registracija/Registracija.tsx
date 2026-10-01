import React, { useState } from "react";
import {
  RegistracijaDTO,
  registrujKorisnika,
} from "../../servisi/KorisnikServis";
import { ApiGreska } from "../../pomocneFunkcije/servisneFunkcije";
import { Modal } from "../Modal/Modal";
import { useModal } from "../../kontekst/Modal/ModalKontekst";

export const Registracija: React.FC = () => {
  const [podaci, setPodaci] = useState<RegistracijaDTO>({
    ime: "",
    prezime: "",
    imejl: "",
    jmbg: "",
    adresa: "",
    brVozackeDozvole: "",
    telefon: 0,
    lozinka: "",
  });

  const [porukaGreske, setPorukaGreske] = useState<string>("");
  const [ucitavanje, setUcitavanje] = useState<boolean>(false);
  const { otvorenModal, otvoriModal, zatvoriModal } = useModal();

  const imejlValidan = (imejl: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(imejl) && imejl.length <= 30;
  };

  const imeValidno = (ime: string): boolean =>
    ime.trim() !== "" && ime.length <= 30;

  const prezimeValidno = (prezime: string): boolean =>
    prezime.trim() !== "" && prezime.length <= 30;

  const jmbgValidan = (jmbg: string): boolean => /^\d{13}$/.test(jmbg); // Tačno 13 cifara

  const adresaValidna = (adresa: string): boolean =>
    adresa.trim() !== "" && adresa.length <= 50;

  const vozackaValidna = (broj: string): boolean => broj.length === 9; // Tačno 9 karaktera

  const telefonValidan = (telefon: number): boolean =>
    telefon > 0 && !isNaN(telefon);

  const lozinkaValidna = (lozinka: string): boolean => lozinka.trim() !== "";

  const dugmeOnemoguceno =
    !imeValidno(podaci.ime) ||
    !prezimeValidno(podaci.prezime) ||
    !imejlValidan(podaci.imejl) ||
    !jmbgValidan(podaci.jmbg) ||
    !adresaValidna(podaci.adresa) ||
    !telefonValidan(podaci.telefon) ||
    !vozackaValidna(podaci.brVozackeDozvole) ||
    !lozinkaValidna(podaci.lozinka) ||
    ucitavanje;

  const upravljajPromenom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setPodaci((prev: RegistracijaDTO) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const upravljajRegistracijom = async (e: React.FormEvent) => {
    e.preventDefault();
    setPorukaGreske("");
    setUcitavanje(true);

    try {
      const odgovor = await registrujKorisnika(podaci);

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
          case 409:
            setPorukaGreske("Korisnik već postoji.");
            break;
          case 500:
            setPorukaGreske("Serverska greška.");
            break;
          default:
            setPorukaGreske("Nepoznata greška.");
            break;
        }
      } else {
        otvoriModal("uspesna-registracija");
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
        <h2 className="naslov">Registracija</h2>

        <form onSubmit={upravljajRegistracijom} className="forma">
          <div>
            <label htmlFor="ime" className="labela">
              Ime:
            </label>
            <input
              type="text"
              id="ime"
              name="ime"
              value={podaci.ime}
              onChange={upravljajPromenom}
              className="ulaz"
              placeholder="Vaše ime"
              required
            />
            {podaci.ime !== "" && !imeValidno(podaci.ime) && (
              <small className="greska">
                Ime može imati najviše 30 karaktera.
              </small>
            )}
          </div>

          <div>
            <label htmlFor="prezime" className="labela">
              Prezime:
            </label>
            <input
              type="text"
              id="prezime"
              name="prezime"
              value={podaci.prezime}
              onChange={upravljajPromenom}
              className="ulaz"
              placeholder="Vaše prezime"
              required
            />
            {podaci.prezime !== "" && !prezimeValidno(podaci.prezime) && (
              <small className="greska">
                Prezime može imati najviše 30 karaktera.
              </small>
            )}
          </div>

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
                Unesite ispravan imejl (maksimalno 30 karaktera).
              </small>
            )}
          </div>

          <div>
            <label htmlFor="jmbg" className="labela">
              JMBG:
            </label>
            <input
              type="text"
              id="jmbg"
              name="jmbg"
              value={podaci.jmbg}
              onChange={upravljajPromenom}
              placeholder="13 cifara"
              className="ulaz"
              required
            />
            {podaci.jmbg !== "" && !jmbgValidan(podaci.jmbg) && (
              <small className="greska">
                JMBG mora sadržati tačno 13 cifara.
              </small>
            )}
          </div>

          <div>
            <label htmlFor="adresa" className="labela">
              Adresa:
            </label>
            <input
              type="text"
              id="adresa"
              name="adresa"
              value={podaci.adresa}
              onChange={upravljajPromenom}
              className="ulaz"
              placeholder="Vaša ulica i broj"
              required
            />
            {podaci.adresa !== "" && !adresaValidna(podaci.adresa) && (
              <small className="greska">
                Adresa može imati najviše 50 karaktera.
              </small>
            )}
          </div>

          <div>
            <label htmlFor="brVozackeDozvole" className="labela">
              Broj vozačke dozvole:
            </label>
            <input
              type="text"
              id="brVozackeDozvole"
              name="brVozackeDozvole"
              value={podaci.brVozackeDozvole}
              onChange={upravljajPromenom}
              placeholder="9 karaktera"
              className="ulaz"
              required
            />
            {podaci.brVozackeDozvole !== "" &&
              !vozackaValidna(podaci.brVozackeDozvole) && (
                <small className="greska">
                  Broj vozačke dozvole mora imati tačno 9 karaktera.
                </small>
              )}
          </div>

          <div>
            <label htmlFor="telefon" className="labela">
              Telefon:
            </label>
            <input
              type="number"
              id="telefon"
              name="telefon"
              value={podaci.telefon || ""}
              onChange={upravljajPromenom}
              placeholder="(+)381601234567"
              className="ulaz"
              required
            />
            {podaci.telefon !== 0 && !telefonValidan(podaci.telefon) && (
              <small className="greska">Unesite ispravan broj telefona.</small>
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
              className="ulaz"
              placeholder="Kreirajte lozinku"
              required
            />
          </div>

          <button type="submit" disabled={dugmeOnemoguceno} className="dugme">
            {ucitavanje ? "Registracija u toku..." : "Registruj se"}
          </button>
        </form>

        {porukaGreske && <p className="forma__greska">{porukaGreske}</p>}
      </div>

      <Modal
        otvoren={otvorenModal("uspesna-registracija")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <p className="forma__uspeh">Uspešna registracija!</p>
      </Modal>
    </>
  );
};
