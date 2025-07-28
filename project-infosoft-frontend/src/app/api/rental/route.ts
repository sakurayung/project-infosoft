import api from "@/app/api/axios/route";
import type { Rental } from "@/app/types";

export const rentalApi = {
  getAll: async (): Promise<Rental[]> => {
    const response = await api.get<Rental[]>("api/rental");
    return response.data;
  },

  getById: async (id: number): Promise<Rental> => {
    const response = await api.get<Rental>(`api/rental/${id}`);
    return response.data;
  },

  create: async (rentalData: {
    customerId: number;
    videoId: number;
    price: number;
    quantity: number
  }): Promise<Rental> => {
    const response = await api.post<Rental>('api/rental/rent', rentalData);
    return response.data;
  },

  // Update rental
  update: async (id: number, rentalData: Partial<Rental>): Promise<Rental> => {
    const response = await api.put<Rental>(`api/rental/return/${id}`, rentalData);
    return response.data;
  },

};