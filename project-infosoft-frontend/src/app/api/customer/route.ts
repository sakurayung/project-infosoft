import api from "@/app/api/axios/route";
import type { Customer, CustomerFormValues } from "@/app/types";

export const customerApi = {
  // Get all customers
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>("api/customer");
    return response.data;
  },

  // Get customer by ID
  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`api/customer/${id}`);
    return response.data;
  },

  // Create new customer
  create: async (customerData: CustomerFormValues): Promise<Customer> => {
    const response = await api.post<Customer>('api/customer', customerData);
    return response.data;
  },

  // Update customer
  update: async (id: number, customerData: Partial<CustomerFormValues>): Promise<Customer> => {
    const response = await api.put<Customer>(`api/customer/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  delete: async (id: number): Promise<void> => {
    await api.delete(`api/customer/${id}`);
  },

};