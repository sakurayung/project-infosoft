export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Video {
  id: number;
  title: string;
  category: string;
  borrowedAt: string;
  returnedAt: string;
}

export interface Rental {
  id: number;
  customerId: number;
  videoId: number;
  price: number;
  borrowedDate: number;
  returnedDate: number;
  overdueDate: number;
}

export interface CustomerDTO extends Customer {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface VideoDTO extends Video {
  id: number;
  title: string;
  category: string;
  borrowedAt: string;
  returnedAt: string;
}

export interface VideoFormValues {
    title: string;
    category: string;
}

export interface CustomerFormValues {
    firstName: string;
    lastName: string;
}
