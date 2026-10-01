import { createContext, useContext, useState } from "react";

export interface NavigacijaKontekstProps {
  trenutnaPutanja: string;
  azurirajPutanju: (path: string) => void;
  lokacija?: Location;
}

export interface NavigacijaProvajderProps {
  children: React.ReactNode;
}

const NavigacijaKontekst = createContext<NavigacijaKontekstProps | undefined>(
  undefined,
);

export const NavigacijaProvajder: React.FC<NavigacijaProvajderProps> = ({
  children,
}) => {
  const [trenutnaPutanja, setTrenutnaPutanja] = useState<string>("/");

  const azurirajPutanju = (path: string) => {
    setTrenutnaPutanja(path);
  };

  const value: NavigacijaKontekstProps = {
    trenutnaPutanja,
    azurirajPutanju,
  };

  return (
    <NavigacijaKontekst.Provider value={value}>
      {children}
    </NavigacijaKontekst.Provider>
  );
};

export const usePutanju = (): NavigacijaKontekstProps => {
  const kontekst = useContext(NavigacijaKontekst);
  if (kontekst === undefined) {
    throw new Error(
      "usePutanju mora biti korišćena unutar NavigacijaProvajdera",
    );
  }
  return kontekst;
};
