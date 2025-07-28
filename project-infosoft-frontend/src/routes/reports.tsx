import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Package, User, Calendar, AlertCircle } from 'lucide-react';
import { reportsApi } from '../app/api/reports/route';
import { customerApi } from '../app/api/customer/route';

export const Route = createFileRoute('/reports')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [showCustomerReport, setShowCustomerReport] = useState(false);

  // Fetch video inventory report
  const { data: videoInventory, isLoading: inventoryLoading, error: inventoryError } = useQuery({
    queryKey: ['videoInventoryReport'],
    queryFn: reportsApi.getVideoInventoryReport,
  });

  // Fetch all customers for dropdown
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getAll,
  });

  // Fetch customer rental report (only when customer is selected)
  const { data: customerReport, isLoading: customerLoading, error: customerError } = useQuery({
    queryKey: ['customerRentalReport', selectedCustomerId],
    queryFn: () => reportsApi.getCustomerRentalReport(selectedCustomerId!),
    enabled: !!selectedCustomerId,
  });

  const handleGenerateCustomerReport = () => {
    if (selectedCustomerId) {
      setShowCustomerReport(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
        </div>
      </div>

      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Video Inventory Report
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {inventoryLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading inventory report...</p>
            </div>
          ) : inventoryError ? (
            <div className="text-center py-8 text-red-600">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p>Error loading inventory report</p>
            </div>
          ) : videoInventory && videoInventory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50 dark:bg-blue-900/20">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Video Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Total Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Currently Rented
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      Available (Inside)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-blue-200 dark:divide-blue-700">
                  {videoInventory.map((video) => (
                    <tr key={video.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10">
                      <td className="px-4 py-4 text-sm font-medium text-blue-900 dark:text-blue-100">
                        {video.title}
                      </td>
                      <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          video.category === 'DVD' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {video.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                        {video.totalQuantity}
                      </td>
                      <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-semibold text-orange-600">
                          {video.quantityRented}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-semibold text-green-600">
                          {video.quantityInside}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <p>No videos found</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-blue-900 dark:text-blue-100">
              Customer Rental Report
            </CardTitle>
          </div>
          <CardDescription>
            View videos currently rented by a specific customer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Select Customer
              </label>
              <select
                value={selectedCustomerId || ''}
                onChange={(e) => setSelectedCustomerId(Number(e.target.value) || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a customer...</option>
                {customers?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleGenerateCustomerReport}
              disabled={!selectedCustomerId}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Generate Report
            </Button>
          </div>

          {showCustomerReport && selectedCustomerId && (
            <div className="mt-6">
              {customerLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading customer report...</p>
                </div>
              ) : customerError ? (
                <div className="text-center py-8 text-red-600">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p>Error loading customer report</p>
                </div>
              ) : customerReport ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                        {customerReport.customerName}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400">
                        Customer ID: {customerReport.customerId}
                      </p>
                      <p className="text-blue-600 dark:text-blue-400">
                        Active Rentals: {customerReport.currentRentals.length}
                      </p>
                    </div>
                  </div>

                  {customerReport.currentRentals.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-blue-50 dark:bg-blue-900/20">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                              Video Title
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                              Rental Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                              Borrowed Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                              Days Remaining
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-blue-200 dark:divide-blue-700">
                          {customerReport.currentRentals.map((rental) => (
                            <tr key={rental.rentalId} className="hover:bg-blue-50 dark:hover:bg-blue-900/10">
                              <td className="px-4 py-4 text-sm font-medium text-blue-900 dark:text-blue-100">
                                {rental.videoTitle}
                              </td>
                              <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  rental.videoCategory === 'DVD' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {rental.videoCategory}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                                ₱{rental.price}
                              </td>
                              <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                                {formatDate(rental.borrowedDate)}
                              </td>
                              <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                                {formatDate(rental.overdueDate)}
                              </td>
                              <td className="px-4 py-4 text-sm text-blue-700 dark:text-blue-300">
                                <span className={rental.daysRemaining < 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                                  {rental.daysRemaining < 0 ? `${Math.abs(rental.daysRemaining)} days overdue` : `${rental.daysRemaining} days`}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm">
                                {rental.isOverdue ? (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Overdue
                                  </span>
                                ) : rental.daysRemaining <= 1 ? (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Due Soon
                                  </span>
                                ) : (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                    Active
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-8 h-8 mx-auto mb-2" />
                      <p>This customer has no active rentals</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}