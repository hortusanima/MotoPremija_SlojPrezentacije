import { useModal } from "../../kontekst/Modal/ModalKontekst";
import { DodajMotocikl } from "../DodajMotocikl/DodajMotocikl";
import { DodajOsiguranje } from "../DodajOsiguranje/DodajOsiguranje";
import { IzmenaMotocikla } from "../IzmenaMotocikla/IzmenaMotocikla";
import { Modal } from "../Modal/Modal";
import { Navigacija } from "../Navigacija/Navigacija";
import { Prijava } from "../Prijava/Prijava";
import { Registracija } from "../Registracija/Registracija";

const Heder: React.FC = () => {
  const { otvorenModal, zatvoriModal } = useModal();
  return (
    <header className="heder">
      <Navigacija />
      <Modal
        otvoren={otvorenModal("prijava")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <Prijava />
      </Modal>
      <Modal
        otvoren={otvorenModal("uspesna-prijava")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <p className="forma__uspeh">Uspešna prijava!</p>
      </Modal>
      <Modal
        otvoren={otvorenModal("registracija")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <Registracija />
      </Modal>
      <Modal
        otvoren={otvorenModal("uspesna-registracija")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <p className="forma__uspeh">Uspešna registracija!</p>
      </Modal>
      <Modal
        otvoren={otvorenModal("dodaj-motocikl")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <DodajMotocikl />
      </Modal>
      <Modal
        otvoren={otvorenModal("uspesno-dodat-motocikl")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <p className="forma__uspeh">Motocikl je uspešno upisan!</p>
      </Modal>
      <Modal
        otvoren={otvorenModal("izmeni-motocikl")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <IzmenaMotocikla />
      </Modal>
      <Modal
        otvoren={otvorenModal("uspesno-izmenjen-motocikl")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <p className="forma__uspeh">Podaci o motociklu su uspešno izmenjeni!</p>
      </Modal>
      <Modal
        otvoren={otvorenModal("dodaj-osiguranje")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <DodajOsiguranje />
      </Modal>
      <Modal
        otvoren={otvorenModal("uspesno-dodato-osiguranje")}
        naZatvori={() => {
          zatvoriModal();
        }}
      >
        <p className="forma__uspeh">Osiguranje je uspešno dodato!</p>
      </Modal>
    </header>
  );
};

export default Heder;
