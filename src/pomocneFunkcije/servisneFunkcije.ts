export interface NoContentOdgovor {
  status: number;
  message?: string;
}

export interface ApiGreska {
  message?: string;
  status?: number;
  details?: string;
  [key: string]: any;
}

export const upravljajApiGreskom = (error: any): ApiGreska => {
  if (error.response) {
    return {
      ...(error.response.data as ApiGreska),
      status: error.response.status,
    };
  }
  return {
    message: error.message || "Nepoznata greška",
    code: 0,
  };
};
