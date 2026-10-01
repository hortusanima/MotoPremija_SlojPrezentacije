import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePutanju } from "./NavigacijaKontekst";

const NavigacijaPracenje: React.FC = () => {
  const location = useLocation();
  const { azurirajPutanju } = usePutanju();

  useEffect(() => {
    azurirajPutanju(location.pathname);
  }, [location.pathname, azurirajPutanju]);

  return null;
};

export default NavigacijaPracenje;
