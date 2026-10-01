import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface ModalKontekstProps {
  aktivanModal: string | null;
  otvoriModal: (id: string) => void;
  zatvoriModal: () => void;
  otvorenModal: (id: string) => boolean;
}

export interface ModalProvajderProps {
  children: ReactNode;
}

const ModalKontekst = createContext<ModalKontekstProps | undefined>(undefined);

export const ModalProvajder: React.FC<ModalProvajderProps> = ({ children }) => {
  const [aktivanModal, setAktivanModal] = useState<string | null>(null);

  const otvoriModal = useCallback((id: string) => {
    setAktivanModal(id);
  }, []);

  const zatvoriModal = useCallback(() => {
    setAktivanModal(null);
  }, []);

  const otvorenModal = useCallback(
    (id: string) => aktivanModal === id,
    [aktivanModal],
  );

  const value: ModalKontekstProps = {
    aktivanModal,
    otvoriModal,
    zatvoriModal,
    otvorenModal,
  };

  return (
    <ModalKontekst.Provider value={value}>{children}</ModalKontekst.Provider>
  );
};

export const useModal = (): ModalKontekstProps => {
  const kontekst = useContext(ModalKontekst);
  if (kontekst === undefined) {
    throw new Error("useModal mora biti korišćen unutar ModalProvajdera");
  }
  return kontekst;
};
