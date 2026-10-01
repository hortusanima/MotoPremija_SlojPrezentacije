import React, { createContext, useContext, useState, useEffect } from "react";
import { korisnikAxiosInstanca } from "../../servisi/KorisnikServis";

export interface AutorizacijaKontekstProps {
  autorizovan: boolean;
  token: string | null;
  prijava: (newToken: string) => void;
  odjava: () => void;
}

export interface AutorizacijaProvajderProps {
  children: React.ReactNode;
}

const AutorizacijaKontekst = createContext<AutorizacijaKontekstProps>(
  {} as AutorizacijaKontekstProps,
);

export const AutorizacijaProvajder: React.FC<AutorizacijaProvajderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken");
  });

  const autorizovan = !!token;

  useEffect(() => {
    if (token) {
      korisnikAxiosInstanca.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    }
  }, [token]);

  const prijava = (noviToken: string) => {
    localStorage.setItem("accessToken", noviToken);
    setToken(noviToken);
    korisnikAxiosInstanca.defaults.headers.common["Authorization"] =
      `Bearer ${noviToken}`;
  };

  const odjava = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    delete korisnikAxiosInstanca.defaults.headers.common["Authorization"];
  };

  const contextValue: AutorizacijaKontekstProps = {
    autorizovan,
    token,
    prijava,
    odjava,
  };

  return (
    <AutorizacijaKontekst.Provider value={contextValue}>
      {children}
    </AutorizacijaKontekst.Provider>
  );
};

export const useAutorizacija = () => {
  const kontekst = useContext(AutorizacijaKontekst);
  return kontekst;
};
