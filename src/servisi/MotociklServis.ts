import axios from "axios";
import {
  ApiGreska,
  upravljajApiGreskom,
} from "../pomocneFunkcije/servisneFunkcije";

export enum PrimarnaUpotreba {
  LICNA = "LICNA",
  POSLOVNA = "POSLOVNA",
  DOSTAVLJACKA = "DOSTAVLJACKA",
}

export interface MotociklDTO {
  brendModel: string;
  godinaProizvodnje: number;
  brSaobracajneDozvole: string;
  primarnaUpotreba: PrimarnaUpotreba;
}

export interface AzuriranMotociklDTO {
  brendModel: string;
  godinaProizvodnje: number;
}

export interface NoContentOdgovor {
  status: number;
  message?: string;
}

const motocikliUrl = `${import.meta.env.VITE_API_URL}/motocikli`;

export const motociklAxiosInstanca = axios.create({
  baseURL: motocikliUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const dodajMotocikl = async (
  dto: MotociklDTO,
  token?: string | null,
): Promise<{ status: number } | ApiGreska> => {
  try {
    const response = await motociklAxiosInstanca.post("", dto, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return { status: response.status };
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};

export const vratiMotocikl = async (
  token?: string | null,
): Promise<MotociklDTO | ApiGreska> => {
  try {
    const response = await motociklAxiosInstanca.get<MotociklDTO>("", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};

export const azurirajMotocikl = async (
  dto: AzuriranMotociklDTO,
  token?: string | null,
): Promise<NoContentOdgovor | ApiGreska> => {
  try {
    const response = await motociklAxiosInstanca.put("", dto, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return { status: response.status, message: "Uspešno ažurirano" };
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};
