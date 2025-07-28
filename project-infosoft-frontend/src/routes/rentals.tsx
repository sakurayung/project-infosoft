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
    returnDate: rental?.returnedDate ? rental.returnedDate.split("T")[0] : null,
    isReturned: rental?.returnedDate ? true : false,
    quantity: rental?.quantity || 1,
  });

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
        isReturned: formData.isReturned,
      });
    }
  };

  const selectedVideo = videos.find((v) => v.id === formData.videoId);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value);
    setFormData((prev) => ({ ...prev, quantity: newQuantity }));
  };

  const handleReturnedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isReturned = e.target.checked;
    const newReturnDate = isReturned
      ? new Date().toISOString().split("T")[0]
      : null;

    console.log("🔥🔥🔥 CHECKBOX CLICKED 🔥🔥🔥");
    console.log("Previous state:", {
      isReturned: formData.isReturned,
      returnDate: formData.returnDate,
    });
    console.log("Checkbox checked:", isReturned);
    console.log("New return date:", newReturnDate);

    setFormData((prev) => {
      const newState = {
        ...prev,
        isReturned,
        returnDate: newReturnDate,
      };

      console.log("Setting new state:", newState);
      console.log("isReturned will be:", newState.isReturned);
      console.log("returnDate will be:", newState.returnDate);

      return newState;
    });

    setTimeout(() => {
      console.log("State after update:", {
        isReturned: formData.isReturned,
        returnDate: formData.returnDate,
      });
    }, 100);
  };

  const handleReturnDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const returnDate = e.target.value || null;
    setFormData((prev) => ({
      ...prev,
      returnDate,
      isReturned: !!returnDate, 
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-blue-200">
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
                    {video.title} ({video.category} - ₱{video.price} - Stock:{" "}
                    {video.quantity})
                  </option>
                ))}
              </select>
              {selectedVideo && (
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Available stock: {selectedVideo.quantity} copies
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Quantity to Rent
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
              {selectedVideo && (
                <p className="text-xs text-gray-500 mt-1">
                  Maximum available: {selectedVideo.quantity} copies
                </p>
              )}
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

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Return Date
              </label>
              <Input
                type="date"
                value={formData.returnDate || ""}
                onChange={handleReturnDateChange}
                disabled={!formData.isReturned}
              />
              {!formData.isReturned && (
                <p className="text-xs text-gray-500 mt-1">
                  Check "Mark as returned" to set return date
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isReturned"
                checked={formData.isReturned}
                onChange={handleReturnedChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="isReturned"
                className="text-sm font-medium text-blue-900 dark:text-blue-100"
              >
                Mark as returned
              </label>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status Preview:
                </span>
                {formData.isReturned ? (
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
              {formData.isReturned && formData.returnDate && (
                <p className="text-xs text-gray-600 mt-1">
                  Return date:{" "}
                  {new Date(formData.returnDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
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
                  isLoading || !formData.customerId || !formData.videoId
                }
                className="flex-1"
              >
                {isLoading ? "Saving..." : rental ? "Update" : "Add"} Rental
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
