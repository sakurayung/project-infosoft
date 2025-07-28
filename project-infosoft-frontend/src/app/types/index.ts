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
  price: number;
  borrowedAt: string;
  returnedAt: string;
  quantity: number;
}

export interface Rental {
  id: number;
  customerId: number;
  videoId: number;
  price: number;
  borrowedDate: string;
  overdueDate: string;
  returnedDate: string | null;
  quantity: number;
  isReturned: boolean;
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  video?: {
    id: number;
    title: string;
    category: string;
    price: number;
  };
}

export interface VideoInventoryReport {
  id: number;
  title: string;
  category: string;
  totalQuantity: number;
  quantityRented: number;
  quantityInside: number;
}

export interface CustomerRentalReport {
  customerId: number;
  customerName: string;
  currentRentals: CustomerRentalItem[];
}

export interface CustomerRentalItem {
  rentalId: number;
  videoTitle: string;
  videoCategory: string;
  price: number;
  borrowedDate: string;
  overdueDate: string;
  daysRemaining: number;
  isOverdue: boolean;
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
  price: number;
  borrowedAt: string;
  returnedAt: string;
  quantity: number;
}

export interface RentalDTO extends Rental {
  id: number;
  customerId: number;
  videoId: number;
  price: number;
  returnedDate: string | null;
  overdueDate: string;
  borrowedDate: string;
  quantity: number;
  isReturned: boolean;
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  video?: {
   id: number;
   title: string;
   category: string;
   price: number;
  };
}

export interface VideoFormValues {
    title: string;
    category: 'DVD' | 'VCD';
    price: number;
    quantity: number;
}

export interface CustomerFormValues {
    firstName: string;
    lastName: string;
}

export interface RentalFormValues {
  customerId: number;
  videoId: number;
  rentalDate: string;
  returnDate?: string | null;
  quantity: number;
  isReturned: boolean;
}
