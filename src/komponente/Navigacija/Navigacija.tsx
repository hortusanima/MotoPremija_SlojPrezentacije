import React, { useCallback, useEffect, useState } from "react";
import "./navigacija.css";
import { useVelicinaEkrana } from "../../hukovi/useVelicinaEkrana";
import { Link } from "react-router-dom";
import MeniIkona from "../../assets/meni-ikona.svg";
import { usePutanju } from "../../kontekst/Navigacija/NavigacijaKontekst";
import { useModal } from "../../kontekst/Modal/ModalKontekst";
import { useAutorizacija } from "../../kontekst/Autorizacija/AutorizacijaKontekst";

export const Navigacija: React.FC = () => {
  const velicinaEkrana: number = useVelicinaEkrana();
  const [otvorenMeniSaStrane, setotvorenMeniSaStrane] =
    useState<boolean>(false);
  const manjiEkran: boolean = velicinaEkrana < 768;
  const { trenutnaPutanja } = usePutanju();
  const { otvoriModal } = useModal();
  const { autorizovan, odjava } = useAutorizacija();

  useEffect(() => {
    if (!manjiEkran && otvorenMeniSaStrane && setotvorenMeniSaStrane) {
      setotvorenMeniSaStrane(false);
    }
  }, [manjiEkran, otvorenMeniSaStrane, setotvorenMeniSaStrane]);

  const otvoriMeniSaStrane = (): void => {
    if (setotvorenMeniSaStrane) {
      setotvorenMeniSaStrane((prev) => !prev);
    }
  };

  const aktivanLink = useCallback(
    (putanja: string): boolean => {
      return trenutnaPutanja === putanja;
    },
    [trenutnaPutanja],
  );

  const otvoriPrijavu = () => {
    setotvorenMeniSaStrane(false);
    otvoriModal("prijava");
  };

  const otvoriRegistraciju = () => {
    setotvorenMeniSaStrane(false);
    otvoriModal("registracija");
  };

  if (manjiEkran) {
    return (
      <nav className="navigacija--manjiEkran">
        <div className="navigacija--manjiEkran__dugmad">
          <button
            className="navigacija--manjiEkran__dugme"
            onClick={otvoriMeniSaStrane}
          >
            <img src={MeniIkona} className="navigacija__ikona" />
          </button>
        </div>

        <div
          className={`navigacija__strana ${otvorenMeniSaStrane ? "navigacija__strana--otvoren" : ""}`}
        >
          <div className="navigacija__strana__linkovi">
            <Link
              to="/pocetna"
              className={`navigacija__link${aktivanLink("/pocetna") ? "--aktivan-link" : ""}`}
            >
              Početna
            </Link>
            {autorizovan && (
              <>
                <Link
                  to="/vase-informacije"
                  className={`navigacija__link${aktivanLink("/vase-informacije") ? "--aktivan-link" : ""}`}
                >
                  Vaše informacije
                </Link>
                <Link
                  to="/pregled-osiguranja"
                  className={`navigacija__link${aktivanLink("/pregled-osiguranja") ? "--aktivan-link" : ""}`}
                >
                  Pregled osiguranja
                </Link>
              </>
            )}
            {!autorizovan && (
              <>
                <button
                  className="navigacija__dugme"
                  onClick={otvoriRegistraciju}
                >
                  Registruj se
                </button>
                <button className="navigacija__dugme" onClick={otvoriPrijavu}>
                  Prijavi se
                </button>
              </>
            )}
          </div>
        </div>

        <div
          className={`navigacija__preko ${
            otvorenMeniSaStrane ? "navigacija__preko--vidljiva" : ""
          }`}
          onClick={otvorenMeniSaStrane ? otvoriMeniSaStrane : undefined}
        />
      </nav>
    );
  }

  return (
    <nav className="navigacija--desktop">
      <div className="navigacija__leviLinkovi">
        <Link
          to="/pocetna"
          className={`navigacija__link${aktivanLink("/pocetna") ? "--aktivan-link" : ""}`}
        >
          Početna
        </Link>
        {autorizovan && (
          <>
            <Link
              to="/vase-informacije"
              className={`navigacija__link${aktivanLink("/vase-informacije") ? "--aktivan-link" : ""}`}
            >
              Vaše informacije
            </Link>
            <Link
              to="/pregled-osiguranja"
              className={`navigacija__link${aktivanLink("/pregled-osiguranja") ? "--aktivan-link" : ""}`}
            >
              Pregled osiguranja
            </Link>
          </>
        )}
      </div>
      {!autorizovan && (
        <div className="navigacija__dugmad">
          <button className="navigacija__dugme" onClick={otvoriRegistraciju}>
            Registruj se
          </button>
          <button className="navigacija__dugme" onClick={otvoriPrijavu}>
            Prijavi se
          </button>
        </div>
      )}
      {autorizovan && (
        <div className="navigacija__dugmad">
          <button className="navigacija__dugme" onClick={odjava}>
            Odjavi se
          </button>
        </div>
      )}
    </nav>
  );
};
