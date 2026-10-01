import React, { createContext, useContext, useState, ReactNode } from "react";
import { VracenKorisnikDTO } from "../../servisi/KorisnikServis";

interface KorisnikKontekstTip {
  korisnik: VracenKorisnikDTO | null;
  postaviKorisnika: (korisnik: VracenKorisnikDTO | null) => void;
  odjaviKorisnika: () => void;
}

const KorisnikKontekst = createContext<KorisnikKontekstTip | undefined>(
  undefined,
);

export const KorisnikProvajder: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [korisnik, setKorisnik] = useState<VracenKorisnikDTO | null>(null);

  const postaviKorisnika = (noviKorisnik: VracenKorisnikDTO | null) => {
    setKorisnik(noviKorisnik);
  };

  const odjaviKorisnika = () => {
    setKorisnik(null);
  };

  return (
    <KorisnikKontekst.Provider
      value={{ korisnik, postaviKorisnika, odjaviKorisnika }}
    >
      {children}
    </KorisnikKontekst.Provider>
  );
};

export const useKorisnik = (): KorisnikKontekstTip => {
  const kontekst = useContext(KorisnikKontekst);
  if (!kontekst) {
    throw new Error("useKorisnik mora biti korišćen unutar KorisnikProvajdera");
  }
  return kontekst;
};
