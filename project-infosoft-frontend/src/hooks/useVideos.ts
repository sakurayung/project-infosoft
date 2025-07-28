import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoApi } from '@/app/api/video/route';
import type { VideoFormValues, Video } from '@/app/types';
import { AxiosError } from 'axios';
import type { ApiError } from '@/app/types/api/types';



// Hook for retrieving all videos
export const useVideos = () => {
  return useQuery<Video[], AxiosError<ApiError>>({
    queryKey: ['videos'],
    queryFn: videoApi.getAll,
  });
};

// Hook for retrieving a single video
export const useVideo = (id: number | undefined) => {
  return useQuery<Video, AxiosError<ApiError>>({
    queryKey: ['videos', id],
    queryFn: () => videoApi.getById(id as number),
    enabled: !!id, // Only run if id is provided
  });
};

// Hook for creating a video
export const useCreateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<Video, AxiosError<ApiError>, VideoFormValues>({
    mutationFn: videoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

// Hook for updating a video
export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<Video, AxiosError<ApiError>, { id: number; data: VideoFormValues }>({
    mutationFn: ({ id, data }) => videoApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
      queryClient.invalidateQueries({ queryKey: ['videos', data.id] });
    },
  });
};

// Hook for deleting a video
export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, number>({
    mutationFn: videoApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};