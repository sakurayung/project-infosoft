import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from '@/app/api/customer/route';
import type { CustomerFormValues, Customer } from '@/app/types';
import { AxiosError } from 'axios';
import type { ApiError } from '@/app/types/api/types';

// Hook for retrieving all customers
export const useCustomers = () => {
  return useQuery<Customer[], AxiosError<ApiError>>({
    queryKey: ['customers'],
    queryFn: customerApi.getAll,
  });
};

// Hook for retrieving a single customer
export const useCustomer = (id: number | undefined) => {
  return useQuery<Customer, AxiosError<ApiError>>({
    queryKey: ['customers', id],
    queryFn: () => customerApi.getById(id as number),
    enabled: !!id, // Only run if id is provided
  });
};

// Hook for creating a customer
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<Customer, AxiosError<ApiError>, CustomerFormValues>({
    mutationFn: customerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};

// Hook for updating a customer
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<Customer, AxiosError<ApiError>, { id: number; data: CustomerFormValues }>({
    mutationFn: ({ id, data }) => customerApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', data.id] });
    },
  });
};

// Hook for deleting a customer
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiError>, number>({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
};