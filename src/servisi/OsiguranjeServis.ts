import axios from "axios";
import {
  ApiGreska,
  upravljajApiGreskom,
} from "../pomocneFunkcije/servisneFunkcije";

export interface VracenoOsiguranjeDTO {
  brPolise: string;
  godisnjaPremija: number;
}

export interface DokumentOdgovor {
  downloadUrl: string;
}

const osiguranjaUrl = `${import.meta.env.VITE_API_URL}/osiguranja`;

export const osiguranjeAxiosInstanca = axios.create({
  baseURL: osiguranjaUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const vratiSvaOsiguranja = async (
  token?: string,
): Promise<VracenoOsiguranjeDTO[] | ApiGreska> => {
  try {
    const response = await osiguranjeAxiosInstanca.get<VracenoOsiguranjeDTO[]>(
      "",
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return response.data;
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};

export const kreirajOsiguranje = async (
  tipOsiguranja: string,
  token?: string | null,
): Promise<{ status: number } | ApiGreska> => {
  try {
    const response = await osiguranjeAxiosInstanca.post(
      "",
      JSON.stringify(tipOsiguranja),
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return { status: response.status };
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};

export const kreirajDokument = async (
  brPolise: string,
  token?: string,
): Promise<DokumentOdgovor | ApiGreska> => {
  try {
    const response = await osiguranjeAxiosInstanca.post<DokumentOdgovor>(
      "/dokument",
      JSON.stringify(brPolise),
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return response.data;
  } catch (greska) {
    return upravljajApiGreskom(greska);
  }
};
