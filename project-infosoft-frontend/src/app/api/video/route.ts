import api from "../axios/route";
import type { VideoDTO, VideoFormValues } from "../../types";

export const videoApi = {
  getAll: async (): Promise<VideoDTO[]> => {
    const response = await api.get<VideoDTO[]>("api/video");
    return response.data;
  },

  getById: async (id: number): Promise<VideoDTO> => {
    const response = await api.get<VideoDTO>(`api/video/${id}`);
    return response.data;
  },

  create: async (videoData: VideoFormValues): Promise<VideoDTO> => {
    const response = await api.post<VideoDTO>('api/video', {
      ...videoData,
      borrowedAt: new Date().toISOString(),
      returnedAt: new Date().toISOString()
    });
    return response.data;
  },

  update: async (id: number, videoData: Partial<VideoFormValues>): Promise<VideoDTO> => {
    const response = await api.put<VideoDTO>(`api/video/${id}`, {
      id,
      ...videoData
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`api/video/${id}`);
  },

};