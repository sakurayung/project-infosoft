import api from "../axios/route";
import type { Video, VideoFormValues } from "../../types";

export const videoApi = {
  getAll: async (): Promise<Video[]> => {
    const response = await api.get<Video[]>("/video");
    return response.data;
  },
  // Get Video by ID
     getById: async (id: number): Promise<Video> => {
       const response = await api.get<Video>(`/video/${id}`);
       return response.data;
     },

     // Add new video
    create: async (videoData: VideoFormValues): Promise<Video> => {
      const response = await api.post<Video>('/video', videoData);
      return response.data;
    },
    
    // Update video details
    update: async (id: number, videoData: VideoFormValues): Promise<Video> => {
      const response = await api.put<Video>(`/video/${id}`, videoData);
      return response.data;
    },
    
    // Delete video
    delete: async (id: number): Promise<void> => {
      await api.delete(`/video/${id}`);
    },

    // getAllWithCategoryDetails: async (): Promise<ProductResponseDTO[]> => {
    //   const response = await api.get<ProductResponseDTO[]>('/products/with-category-details');
    //   return response.data;
    // }
};


