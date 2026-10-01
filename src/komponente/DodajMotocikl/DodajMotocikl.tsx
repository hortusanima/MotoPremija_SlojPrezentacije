import React, { useState } from "react";
import {
  MotociklDTO,
  PrimarnaUpotreba,
  dodajMotocikl,
} from "../../servisi/MotociklServis";
import { ApiGreska } from "../../pomocneFunkcije/servisneFunkcije";
import { useAutorizacija } from "../../kontekst/Autorizacija/AutorizacijaKontekst";
import { useModal } from "../../kontekst/Modal/ModalKontekst";

export const DodajMotocikl: React.FC = () => {
  const [podaci, setPodaci] = useState<MotociklDTO>({
    brendModel: "",
    godinaProizvodnje: 2026,
    brSaobracajneDozvole: "",
    primarnaUpotreba: PrimarnaUpotreba.LICNA,
  });

  const [porukaGreske, setPorukaGreske] = useState<string>("");
  const [ucitavanje, setUcitavanje] = useState<boolean>(false);
  const { token } = useAutorizacija();
  const { otvoriModal } = useModal();

  const brendModelValidan = (bm: string): boolean =>
    bm.trim() !== "" && bm.length <= 30;

  const godinaValidna = (godina: number): boolean =>
    godina >= 1999 && godina <= 2026;

  const saobracajnaValidna = (br: string): boolean => br.length === 6;

  const dugmeOnemoguceno =
    !brendModelValidan(podaci.brendModel) ||
    !godinaValidna(podaci.godinaProizvodnje) ||
    !saobracajnaValidna(podaci.brSaobracajneDozvole) ||
    ucitavanje;

  const upravljajPromenom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setPodaci((prev: MotociklDTO) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const upravljajSlanjem = async (e: React.FormEvent) => {
    e.preventDefault();
    setPorukaGreske("");
    setUcitavanje(true);

    try {
      const odgovor = await dodajMotocikl(podaci, token);

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
            setPorukaGreske("Niste autorizovani. Prijavite se ponovo.");
            break;
          case 409:
            setPorukaGreske("Motocikl je već upisan za ovaj profil.");
            break;
          case 500:
            setPorukaGreske("Serverska greška.");
            break;
          default:
            setPorukaGreske("Nepoznata greška.");
            break;
        }
      } else {
        otvoriModal("uspesno-dodat-motocikl");
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
        <h2 className="naslov">Dodaj motocikl</h2>

        <form onSubmit={upravljajSlanjem} className="forma">
          <div>
            <label htmlFor="brendModel" className="labela">
              Brend i model:
            </label>
            <input
              type="text"
              id="brendModel"
              name="brendModel"
              value={podaci.brendModel}
              onChange={upravljajPromenom}
              placeholder="npr. Yamaha MT-07"
              className="ulaz"
              required
            />
            {podaci.brendModel !== "" &&
              !brendModelValidan(podaci.brendModel) && (
                <small className="greska">
                  Brend i model mogu imati najviše 30 karaktera.
                </small>
              )}
          </div>

          <div>
            <label htmlFor="godinaProizvodnje" className="labela">
              Godina proizvodnje:
            </label>
            <input
              type="number"
              id="godinaProizvodnje"
              name="godinaProizvodnje"
              value={podaci.godinaProizvodnje || ""}
              onChange={upravljajPromenom}
              min={1999}
              max={2026}
              className="ulaz"
              required
            />
            {!godinaValidna(podaci.godinaProizvodnje) && (
              <small className="greska">
                Godina proizvodnje mora biti između 1999. i 2026.
              </small>
            )}
          </div>

          <div>
            <label htmlFor="brSaobracajneDozvole" className="labela">
              Broj saobraćajne dozvole:
            </label>
            <input
              type="text"
              id="brSaobracajneDozvole"
              name="brSaobracajneDozvole"
              value={podaci.brSaobracajneDozvole}
              onChange={upravljajPromenom}
              placeholder="6 karaktera"
              className="ulaz"
              required
            />
            {podaci.brSaobracajneDozvole !== "" &&
              !saobracajnaValidna(podaci.brSaobracajneDozvole) && (
                <small className="greska">
                  Broj saobraćajne dozvole mora imati tačno 6 karaktera.
                </small>
              )}
          </div>

          <div>
            <label className="labela">Primarna upotreba:</label>
            <div className="radio">
              <label className="radio__labela">
                <input
                  type="radio"
                  className="radio__dugme"
                  name="primarnaUpotreba"
                  value={PrimarnaUpotreba.LICNA}
                  checked={podaci.primarnaUpotreba === PrimarnaUpotreba.LICNA}
                  onChange={upravljajPromenom}
                />
                Lična
              </label>

              <label className="radio__labela">
                <input
                  type="radio"
                  name="primarnaUpotreba"
                  value={PrimarnaUpotreba.POSLOVNA}
                  checked={
                    podaci.primarnaUpotreba === PrimarnaUpotreba.POSLOVNA
                  }
                  className="radio__dugme"
                  onChange={upravljajPromenom}
                />
                Poslovna
              </label>

              <label className="radio__labela">
                <input
                  type="radio"
                  name="primarnaUpotreba"
                  value={PrimarnaUpotreba.DOSTAVLJACKA}
                  checked={
                    podaci.primarnaUpotreba === PrimarnaUpotreba.DOSTAVLJACKA
                  }
                  className="radio__dugme"
                  onChange={upravljajPromenom}
                />
                Dostavljačka
              </label>
            </div>
          </div>

          <button type="submit" disabled={dugmeOnemoguceno} className="dugme">
            {ucitavanje ? "Dodavanje..." : "Dodaj motocikl"}
          </button>
        </form>

        {porukaGreske && <p className="forma__greska">{porukaGreske}</p>}
      </div>
    </>
  );
};
