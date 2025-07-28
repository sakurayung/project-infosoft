import api from "../axios/route";
import type { VideoInventoryReport, CustomerRentalReport } from "../../types";

export const reportsApi = {
  // Get video inventory report (alphabetical order with quantities)
  getVideoInventoryReport: async (): Promise<VideoInventoryReport[]> => {
    const response = await api.get<VideoInventoryReport[]>("/api/inventoryreport/video-inventory");
    return response.data;
  },

  // Get customer rental report (videos currently renting)
  getCustomerRentalReport: async (customerId: number): Promise<CustomerRentalReport> => {
    const response = await api.get<CustomerRentalReport>(`/api/inventoryreport/customer-rentals/${customerId}`);
    return response.data;
  },

  // Get all customers with active rentals
  getCustomersWithActiveRentals: async (): Promise<{ id: number; name: string; activeRentalsCount: number }[]> => {
    const response = await api.get<{ id: number; name: string; activeRentalsCount: number }[]>("/api/inventoryreport/customers-with-rentals");
    return response.data;
  }
};