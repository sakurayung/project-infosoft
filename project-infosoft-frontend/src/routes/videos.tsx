import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Video, Play, Plus, Edit, Trash2, X } from 'lucide-react'
import { videoApi } from '../app/api/video/route'
import type { VideoDTO, VideoFormValues } from '../app/types'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { cn } from '../lib/utils'

export const Route = createFileRoute('/videos')({
  component: VideosPage,
})

function VideosPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoDTO | null>(null)
  const queryClient = useQueryClient()

  // Fetch videos
  const { data: videosData, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: videoApi.getAll,
  })

  // Ensure videos is always an array
  const videos = Array.isArray(videosData) ? videosData : []

  // Debug: Log what we're getting from the API
  console.log('API Response:', videosData)
  console.log('Videos Array:', videos)

  // Create video mutation
  const createMutation = useMutation({
    mutationFn: videoApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      setShowForm(false)
      setEditingVideo(null)
    },
  })

  // Update video mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VideoFormValues> }) =>
      videoApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      setShowForm(false)
      setEditingVideo(null)
    },
  })

  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: videoApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    },
  })

  const handleAddVideo = () => {
    setEditingVideo(null)
    setShowForm(true)
  }

  const handleEditVideo = (video: VideoDTO) => {
    setEditingVideo(video)
    setShowForm(true)
  }

  const handleDeleteVideo = (id: number) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-blue-600">Loading videos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading videos: {error.message}</div>
      </div>
    )
  }

  // Debug section - remove this after fixing
  if (videosData && !Array.isArray(videosData)) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">API Data Issue</h3>
          <p className="text-red-700 text-sm mt-1">
            Expected array but got: {typeof videosData}
          </p>
          <pre className="text-xs mt-2 bg-red-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(videosData, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            Video Management
          </h1>
          <p className="text-blue-700 dark:text-blue-300">
            Manage your video inventory
          </p>
        </div>
        <Button onClick={handleAddVideo} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* Video Form Modal */}
      {showForm && (
        <VideoForm
          video={editingVideo}
          onSubmit={(data) => {
            if (editingVideo) {
              updateMutation.mutate({ id: editingVideo.id, data })
            } else {
              createMutation.mutate(data)
            }
          }}
          onCancel={() => {
            setShowForm(false)
            setEditingVideo(null)
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Videos Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onEdit={() => handleEditVideo(video)}
            onDelete={() => handleDeleteVideo(video.id)}
            isDeleting={deleteMutation.isPending}
          />
        ))}
      </div>

      {videos.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-blue-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
            No videos found
          </h3>
          <p className="text-blue-600 dark:text-blue-400 mb-4">
            Get started by adding your first video.
          </p>
          <Button onClick={handleAddVideo}>
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </div>
      )}
    </div>
  )
}

// Rest of your components remain the same...
function VideoCard({ 
  video, 
  onEdit, 
  onDelete, 
  isDeleting 
}: { 
  video: VideoDTO
  onEdit: () => void
  onDelete: () => void
  isDeleting: boolean
}) {
  return (
    <Card className="border-blue-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              video.category === 'DVD' 
                ? "bg-blue-100 text-blue-800" 
                : "bg-green-100 text-green-800"
            )}>
              {video.category}
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
        <CardTitle className="text-lg leading-6">{video.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-600 dark:text-blue-400">Price:</span>
            <span className="font-medium text-blue-900 dark:text-blue-100">
              ₱{video.price}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600 dark:text-blue-400">Quantity:</span>
            <span className="font-medium text-blue-900 dark:text-blue-100">
              {video.quantity}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-600 dark:text-blue-400">Status:</span>
            <span className={cn(
              "font-medium",
              video.quantity > 0 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            )}>
              {video.quantity > 0 ? 'Available' : 'Out of Stock'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function VideoForm({
  video,
  onSubmit,
  onCancel,
  isLoading
}: {
  video: VideoDTO | null
  onSubmit: (data: VideoFormValues) => void
  onCancel: () => void
  isLoading: boolean
}) {
  const [formData, setFormData] = useState<VideoFormValues>({
    title: video?.title || '',
    category: video?.category as 'DVD' | 'VCD' || 'DVD',
    price: video?.price || 50,
    quantity: video?.quantity || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleCategoryChange = (category: 'DVD' | 'VCD') => {
    setFormData(prev => ({
      ...prev,
      category,
      price: category === 'VCD' ? 25 : 50
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {video ? 'Edit Video' : 'Add New Video'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            {video ? 'Update video information' : 'Add a new video to your inventory'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Title
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter video title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Category
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.category === 'DVD' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange('DVD')}
                  className="flex-1"
                >
                  DVD (₱50)
                </Button>
                <Button
                  type="button"
                  variant={formData.category === 'VCD' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange('VCD')}
                  className="flex-1"
                >
                  VCD (₱25)
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Price
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="Enter price"
                required
                readOnly
              />
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Price is automatically set based on category
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Quantity
              </label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                placeholder="Enter quantity"
                min="1"
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
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Saving...' : (video ? 'Update' : 'Add')} Video
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}