import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, User, Plus, Edit, Trash2, X } from 'lucide-react'
import { customerApi } from '../app/api/customer/route'
import type { CustomerDTO, CustomerFormValues } from '../app/types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export const Route = createFileRoute('/customers')({
  component: CustomersPage,
})

function CustomersPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<CustomerDTO | null>(null)
  const queryClient = useQueryClient()

  /**
   * Fetch the customers from the API
   */
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getAll,
  })

  // Create customer mutation
  const createMutation = useMutation({
    mutationFn: customerApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setShowForm(false)
      setEditingCustomer(null)
    },
  })

  // Update customer mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CustomerFormValues> }) =>
      customerApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      setShowForm(false)
      setEditingCustomer(null)
    },
  })

  // Delete customer mutation
  const deleteMutation = useMutation({
    mutationFn: customerApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })

  const handleAddCustomer = () => {
    setEditingCustomer(null)
    setShowForm(true)
  }

  const handleEditCustomer = (customer: CustomerDTO) => {
    setEditingCustomer(customer)
    setShowForm(true)
  }

  const handleDeleteCustomer = (id: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-600">Loading customers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">
          Error loading customers: {(error as Error).message}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Customer Management
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Manage your customers
          </p>
        </div>
        <Button onClick={handleAddCustomer} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={(data) => {
            if (editingCustomer) {
              updateMutation.mutate({ id: editingCustomer.id, data })
            } else {
              createMutation.mutate(data)
            }
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingCustomer(null)
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {customers?.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={() => handleEditCustomer(customer)}
            onDelete={() => handleDeleteCustomer(customer.id)}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>

      {(!customers || customers.length === 0) && !isLoading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
            No customers found
          </h3>
          <p className="text-blue-600 dark:text-blue-400 mb-4">
            Get started by adding your first customer.
          </p>
          <Button onClick={handleAddCustomer}>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>
      )}
    </div>
  )
}

function CustomerCard({ 
  customer, 
  onEdit, 
  onDelete, 
  isDeleting 
}: { 
  customer: CustomerDTO
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="border-blue-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              ID: {customer.id}
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              disabled={isDeleting}
              className="h-8 w-8 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg leading-6">
          {customer.firstName} {customer.lastName}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-600 dark:text-blue-400">First Name:</span>
            <span className="font-medium text-blue-900 dark:text-blue-100">
              {customer.firstName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600 dark:text-blue-400">Last Name:</span>
            <span className="font-medium text-blue-900 dark:text-blue-100">
              {customer.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600 dark:text-blue-400">Created:</span>
            <span className="font-medium text-blue-900 dark:text-blue-100">
              {formatDate(customer.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Customer Form Component
function CustomerForm({
  customer,
  onSubmit,
  onCancel,
  isLoading
}: {
  customer: CustomerDTO | null
  onSubmit: (data: CustomerFormValues) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<CustomerFormValues>({
    firstName: customer?.firstName || '',
    lastName: customer?.lastName || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.firstName.trim() && formData.lastName.trim()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-white/30 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {customer ? 'Edit Customer' : 'Add New Customer'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {customer ? 'Update customer information' : 'Add a new customer to your system'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                First Name
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Last Name
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Enter last name"
                required
              />
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
                disabled={isLoading || !formData.firstName.trim() || !formData.lastName.trim()}
                className="flex-1"
              >
                {isLoading ? 'Saving...' : (customer ? 'Update' : 'Add')} Customer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}