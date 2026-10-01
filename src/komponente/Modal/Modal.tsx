import ZatvoriIkona from "../../assets/zatvori-ikona.svg";
import "./modal.css";
import { useCallback, useEffect, useRef } from "react";

export interface ModalProps {
  otvoren: boolean;
  naZatvori: () => void;
  children: React.ReactNode;
  ceoEkran?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  otvoren,
  naZatvori,
  children,
  ceoEkran,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (otvoren) {
      modalRef.current?.focus();
    }
  }, [otvoren]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        naZatvori();
      }
    },
    [naZatvori],
  );

  if (!otvoren) {
    return null;
  }

  return (
    <>
      <div
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        className={`modal ${ceoEkran ? "modal--ceo-ekran" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <button className="modal__dugme" onClick={naZatvori}>
          <img src={ZatvoriIkona} className="modal__dugme__ikona" />
        </button>
        <div className="modal__sadrzaj">{children}</div>
      </div>
      <div className="modal__preko" onClick={naZatvori}></div>
    </>
  );
};
