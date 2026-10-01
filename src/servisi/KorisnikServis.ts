import axios from "axios";
import {
  ApiGreska,
  upravljajApiGreskom,
} from "../pomocneFunkcije/servisneFunkcije";

export interface PrijavaDTO {
  imejl: string;
  lozinka: string;
}

export interface RegistracijaDTO {
  ime: string;
  prezime: string;
  imejl: string;
  jmbg: string;
  adresa: string;
  brVozackeDozvole: string;
  telefon: number;
  lozinka: string;
}

export interface VracenKorisnikDTO {
  ime: string;
  prezime: string;
  jmbg: string;
  brVozackeDozvole: string;
}

export interface RegistracijaOdgovor {
  status: number;
  poruka?: string;
}

export interface PrijavaOdgovor {
  accessToken: string;
  poruka?: string;
}

const usersUrl = `${import.meta.env.VITE_API_URL}/korisnici`;

export const korisnikAxiosInstanca = axios.create({
  baseURL: usersUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const prijaviKorisnika = async (
  dto: PrijavaDTO,
): Promise<PrijavaOdgovor | ApiGreska> => {
  try {
    const response = await korisnikAxiosInstanca.post<PrijavaOdgovor>(
      "/prijava",
      dto,
    );
    return response.data;
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};

export const registrujKorisnika = async (
  dto: RegistracijaDTO,
): Promise<RegistracijaOdgovor | ApiGreska> => {
  try {
    const response = await korisnikAxiosInstanca.post<RegistracijaOdgovor>(
      "/registracija",
      dto,
    );
    return { status: response.status, poruka: response.statusText };
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};

export const vratiKorisnika = async (
  token: string,
): Promise<VracenKorisnikDTO | ApiGreska> => {
  try {
    const response = await korisnikAxiosInstanca.get<VracenKorisnikDTO>("", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};
