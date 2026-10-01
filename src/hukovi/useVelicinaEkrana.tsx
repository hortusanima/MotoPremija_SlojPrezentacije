import { useState, useEffect } from "react";

export const useVelicinaEkrana = (): number => {
  const [velicina, setVelicina] = useState<number>(window.innerWidth);

  useEffect(() => {
    const upravljajVelicinom = (): void => setVelicina(window.innerWidth);
    window.addEventListener("resize", upravljajVelicinom);
    return (): void => window.removeEventListener("resize", upravljajVelicinom);
  }, []);

  return velicina;
};
