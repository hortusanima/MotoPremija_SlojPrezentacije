import React, { useState } from "react";
import {
  AzuriranMotociklDTO,
  azurirajMotocikl,
} from "../../servisi/MotociklServis";
import { ApiGreska } from "../../pomocneFunkcije/servisneFunkcije";
import { useAutorizacija } from "../../kontekst/Autorizacija/AutorizacijaKontekst";
import { useModal } from "../../kontekst/Modal/ModalKontekst";

export const IzmenaMotocikla: React.FC = () => {
  const [podaci, setPodaci] = useState<AzuriranMotociklDTO>({
    brendModel: "",
    godinaProizvodnje: 2026,
  });

  const [porukaGreske, setPorukaGreske] = useState<string>("");
  const [ucitavanje, setUcitavanje] = useState<boolean>(false);

  const { token } = useAutorizacija();
  const { otvoriModal } = useModal();

  const brendModelValidan = (bm: string): boolean =>
    bm.trim() !== "" && bm.length <= 30;

  const godinaValidna = (godina: number): boolean =>
    godina >= 1999 && godina <= 2026;

  const dugmeOnemoguceno =
    !brendModelValidan(podaci.brendModel) ||
    !godinaValidna(podaci.godinaProizvodnje) ||
    ucitavanje;

  const upravljajPromenom = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setPodaci((prev: AzuriranMotociklDTO) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const upravljajAzuriranjem = async (e: React.FormEvent) => {
    e.preventDefault();
    setPorukaGreske("");
    setUcitavanje(true);

    try {
      const odgovor = await azurirajMotocikl(podaci, token);

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
            setPorukaGreske("Niste autorizovani.");
            break;
          case 404:
            setPorukaGreske("Motocikl nije pronađen.");
            break;
          case 500:
            setPorukaGreske("Serverska greška.");
            break;
          default:
            setPorukaGreske("Nepoznata greška.");
            break;
        }
      } else {
        otvoriModal("uspesno-izmenjen-motocikl");
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
        <h2 className="naslov">Izmeni motocikl</h2>

        <form onSubmit={upravljajAzuriranjem} className="forma">
          <div>
            <label htmlFor="brendModel" className="labela">
              Novi brend i model:
            </label>
            <input
              type="text"
              id="brendModel"
              name="brendModel"
              value={podaci.brendModel}
              onChange={upravljajPromenom}
              placeholder="npr. Honda CB650R"
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
              Nova godina proizvodnje:
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

          <button type="submit" disabled={dugmeOnemoguceno} className="dugme">
            {ucitavanje ? "Izmena..." : "Sačuvaj izmene"}
          </button>
        </form>

        {porukaGreske && <p className="forma__greska">{porukaGreske}</p>}
      </div>
    </>
  );
};
