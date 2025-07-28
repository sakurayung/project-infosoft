import { customerApi } from "@/app/api/customer/route";
import { rentalApi } from "@/app/api/rental/route";
import { videoApi } from "@/app/api/video/route";
import {
  type RentalDTO,
  type CustomerDTO,
  type RentalFormValues,
  type VideoDTO,
} from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/rentals")({
  component: RentalsPage,
});

function RentalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingRental, setEditingRental] = useState<RentalDTO | null>(null);
  const queryClient = useQueryClient();

  /**
   * Fetch the rentals
   */
  const {
    data: rentals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rentals"],
    queryFn: rentalApi.getAll,
  });

  /**
   * Fetch the customers for dropdown
   */
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  /**
   * Fetch the videos for dropdown
   */
  const { data: videos } = useQuery({
    queryKey: ["videos"],
    queryFn: videoApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: rentalApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      queryClient.refetchQueries({ queryKey: ["rentals"] });
      setShowForm(false);
      setEditingRental(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<RentalFormValues>;
    }) => rentalApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      setShowForm(false);
      setEditingRental(null);
    },
  });

  const handleAddRental = () => {
    setEditingRental(null);
    setShowForm(true);
  };

  const handleEditRental = (rental: RentalDTO) => {
    setEditingRental(rental);
    setShowForm(true);
  };

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString || dateString === "" || dateString === "0001-01-01T00:00:00") {
    return "Not Returned";
  }
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Not Returned";
    }
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "Not Returned";
  }
};

const calculateDueDate = (rentalDate: string, rentDays: number) => {
  const rental = new Date(rentalDate);
  const due = new Date(rental);
  due.setDate(due.getDate() + rentDays);
  return due;
};

const calculateStatus = (rental: RentalDTO) => {
  if (rental.isReturned) {
    return { type: "returned", label: "Returned", icon: CheckCircle, color: "green" };
  }

  const video = videos?.find(v => v.id === rental.videoId);
  if (!video) {
    return { type: "unknown", label: "Unknown", icon: Clock, color: "gray" };
  }

  const now = new Date();
  const dueDate = calculateDueDate(rental.borrowedDate, video.rentDays); // Use video.rentDays
  const daysDiff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) {
    return { 
      type: "overdue", 
      label: `${Math.abs(daysDiff)} day${Math.abs(daysDiff) !== 1 ? 's' : ''} overdue`, 
      color: "red" 
    };
  } else if (daysDiff === 0) {
    return { type: "due-today", label: "Due today", icon: Clock, color: "orange" };
  } else {
    return { 
      type: "active", 
      label: `${daysDiff} day${daysDiff !== 1 ? 's' : ''} left`, 
      icon: Clock, 
      color: "blue" 
    };
  }
};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-600">Loading rentals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">
          Error loading rentals: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Rental Management
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Manage video rentals and returns
          </p>
        </div>
        <Button
          onClick={handleAddRental}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Rental
        </Button>
      </div>

      {showForm && (
        <RentalForm
          rental={editingRental}
          customers={customers || []}
          videos={videos || []}
          onSubmit={(data) => {
            if (editingRental) {
              updateMutation.mutate({ id: editingRental.id, data });
            } else {
              const selectedVideo = videos?.find((v) => v.id === data.videoId);
              const finalData = {
                ...data,
                price: selectedVideo?.price || 0,
              };
              console.log("🔥 FINAL DATA TO CREATE:", finalData);
              createMutation.mutate(finalData);
            }
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingRental(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Rentals ({rentals?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!rentals || rentals.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                No rentals found
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-4">
                Get started by creating your first rental.
              </p>
              <Button onClick={handleAddRental}>
                <Plus className="w-4 h-4 mr-2" />
                Add Rental
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 dark:bg-blue-900/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Rental ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Video
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Rental Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Return Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-blue-200 dark:divide-blue-700">
                  {rentals.map((rental) => (
                    <tr
                      key={rental.id}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-900 dark:text-blue-100">
                        #{rental.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-300">
                        {rental.customer
                          ? `${rental.customer.firstName} ${rental.customer.lastName}`
                          : `Customer ID: ${rental.customerId}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-300">
                        <div className="flex flex-col">
                          <span>
                            {rental.video
                              ? rental.video.title
                              : `Video ID: ${rental.videoId}`}
                          </span>
                          {rental.video && (
                            <span className="text-xs text-blue-500">
                              {rental.video.category} - ₱{rental.price}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-300">
                        {formatDate(rental.borrowedDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 dark:text-blue-300">
                        <span
                          className={cn(
                            rental.returnedDate
                              ? "text-green-600 dark:text-green-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          )}
                        >
                          {formatDate(rental.returnedDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {rental.isReturned ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Returned
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4 text-yellow-600" />
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Active
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRental(rental)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RentalForm({
  rental,
  customers,
  videos,
  onSubmit,
  onCancel,
  isLoading,
}: {
  rental: RentalDTO | null;
  customers: CustomerDTO[];
  videos: VideoDTO[];
  onSubmit: (data: RentalFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<RentalFormValues>({
    customerId: rental?.customerId || 0,
    videoId: rental?.videoId || 0,
    rentalDate: rental?.borrowedDate
      ? rental.borrowedDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
    returnDate: rental?.returnedDate ? rental.returnedDate.split("T")[0] : "",
    isReturned: rental?.returnedDate ? true : false,
    quantity: rental?.quantity || 1,
  });

  const selectedVideo = videos.find((v) => v.id === formData.videoId);

  const calculateDueDate = () => {
    if (!selectedVideo || !formData.rentalDate) return null;
    
    const rentalDate = new Date(formData.rentalDate);
    const dueDate = new Date(rentalDate);
    dueDate.setDate(dueDate.getDate() + selectedVideo.rentDays);
    
    return dueDate;
  };

  const formatDueDate = () => {
    const dueDate = calculateDueDate();
    if (!dueDate) return null;
    
    return dueDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Validation for return date
  const validateReturnDate = () => {
    if (!selectedVideo || !formData.rentalDate || !formData.returnDate) return null;
    
    const rentalDate = new Date(formData.rentalDate);
    const returnDate = new Date(formData.returnDate);
    const dueDate = calculateDueDate();
    
    if (returnDate < rentalDate) {
      return {
        type: "error",
        message: "Return date cannot be before rental date"
      };
    }
    
    if (dueDate && returnDate > dueDate) {
      const overdueDays = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        type: "warning",
        message: `Return is ${overdueDays} day${overdueDays !== 1 ? 's' : ''} overdue! Late fees may apply.`
      };
    }
    
    return {
      type: "success",
      message: "Return date is within the allowed rental period"
    };
  };

  const returnDateValidation = validateReturnDate();

  const dateToISOString = (dateString: string): string => {
    const date = new Date(dateString + "T12:00:00.000Z");
    return date.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerId && formData.videoId) {
      onSubmit({
        ...formData,
        rentalDate: dateToISOString(formData.rentalDate),
        returnDate: formData.returnDate
          ? dateToISOString(formData.returnDate)
          : null,
        isReturned: !!formData.returnDate, 
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    setFormData((prev) => ({ ...prev, quantity: newQuantity }));
  };

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const returnDate = e.target.value || "";
    setFormData((prev) => ({
      ...prev,
      returnDate,
      isReturned: !!returnDate, // Auto-set isReturned based on return date
    }));
  };

  const handleQuickReturnToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      returnDate: today,
      isReturned: true,
    }));
  };

  const handleClearReturnDate = () => {
    setFormData((prev) => ({
      ...prev,
      returnDate: "",
      isReturned: false,
    }));
  };

  return (
    <div className="fixed inset-0 bg-white/30 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg border-blue-200 bg-white dark:bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{rental ? "Edit Rental" : "Add New Rental"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {rental ? "Update rental information" : "Create a new video rental"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Customer
              </label>
              <select
                value={formData.customerId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerId: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Video
              </label>
              <select
                value={formData.videoId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    videoId: Number(e.target.value),
                    quantity: 1,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value={0}>Select a video</option>
                {videos.map((video) => (
                  <option key={video.id} value={video.id}>
                    {video.title} ({video.category} )
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Quantity
              </label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={handleQuantityChange}
                min="1"
                max={selectedVideo?.quantity}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Rental Date
              </label>
              <Input
                type="date"
                value={formData.rentalDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rentalDate: e.target.value,
                  }))
                }
                required
              />
            </div>

            {selectedVideo && formData.rentalDate && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-700 dark:text-blue-300">
                    <strong>Due Date:</strong> {formatDueDate()}
                  </span>
                  <span className="text-blue-700 dark:text-blue-300">
                    <strong>Total:</strong> ₱{(selectedVideo.price * formData.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-blue-900 dark:text-blue-100">
                  Return Date (Optional)
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleQuickReturnToday}
                    className="text-xs px-2 py-1 h-6"
                  >
                    Today
                  </Button>
                  {formData.returnDate && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearReturnDate}
                      className="text-xs px-2 py-1 h-6 text-red-600"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <Input
                type="date"
                //@ts-ignore
                value={formData.returnDate}
                onChange={handleReturnDateChange}
                className={cn(
                  "w-full",
                  returnDateValidation?.type === "error" && "border-red-500 focus:ring-red-500",
                  returnDateValidation?.type === "warning" && "border-yellow-500 focus:ring-yellow-500",
                  returnDateValidation?.type === "success" && "border-green-500 focus:ring-green-500"
                )}
              />
              
              {/* Return Date Validation Messages */}
              {returnDateValidation && (
                <div className={cn(
                  "mt-2 p-2 rounded-md text-xs",
                  returnDateValidation.type === "error" && "bg-red-50 text-red-700 border border-red-200",
                  returnDateValidation.type === "warning" && "bg-yellow-50 text-yellow-700 border border-yellow-200",
                  returnDateValidation.type === "success" && "bg-green-50 text-green-700 border border-green-200"
                )}>
                  {returnDateValidation.message}
                </div>
              )}
            </div>

            {/* Status Display */}
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status:
                </span>
                {formData.returnDate ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Returned on {new Date(formData.returnDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Active Rental
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading || 
                  !formData.customerId || 
                  !formData.videoId ||
                  returnDateValidation?.type === "error"
                }
                className="flex-1"
              >
                {isLoading ? "Saving..." : rental ? "Update" : "Create"} Rental
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
