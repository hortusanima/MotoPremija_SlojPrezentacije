import axios from "axios";
import {
  ApiGreska,
  upravljajApiGreskom,
} from "../pomocneFunkcije/servisneFunkcije";

export interface TipOsiguranjaDTO {
  nazivOsiguranja: string;
}

const tipOsiguranjaUrl = `${import.meta.env.VITE_API_URL}/tip-osiguranja`;

export const tipOsiguranjaAxiosInstance = axios.create({
  baseURL: tipOsiguranjaUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const vratiTipoveOsiguranja = async (
  token?: string | null,
): Promise<TipOsiguranjaDTO[] | ApiGreska> => {
  try {
    const response = await tipOsiguranjaAxiosInstance.get<TipOsiguranjaDTO[]>(
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
