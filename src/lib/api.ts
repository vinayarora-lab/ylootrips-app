// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';
// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// API Client
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

// API Functions
export const api = {
  // CMS Content
  getSiteSettings: () => apiClient.get('/content/settings'),
  getPageContent: (pageKey: string) => apiClient.get(`/content/page/${pageKey}`),
  getPageSections: (pageKey: string) => apiClient.get(`/content/page/${pageKey}/sections`),
  getPageStats: (pageKey: string) => apiClient.get(`/content/page/${pageKey}/stats`),
  getPageFeatures: (pageKey: string) => apiClient.get(`/content/page/${pageKey}/features`),

  // Combined Homepage Data (single request for all homepage data)
  getHomepageData: () => apiClient.get('/homepage'),

  // Destinations
  getDestinations: () => apiClient.get('/destinations'),
  getFeaturedDestinations: () => apiClient.get('/destinations/featured'),
  getPopularDestinations: () => apiClient.get('/destinations/popular'),
  getDestinationBySlug: (slug: string) => apiClient.get(`/destinations/slug/${slug}`),
  getDestinationDetails: (slug: string) => apiClient.get(`/destinations/slug/${slug}/details`),

  // Trips
  getTrips: (params?: { category?: string; destination?: string; destinationId?: number }) =>
    apiClient.get('/trips', { params }),
  getFeaturedTrips: () => apiClient.get('/trips/featured'),
  getPopularTrips: () => apiClient.get('/trips/popular'),
  getTrendingTrips: () => apiClient.get('/trips/trending'),
  searchTrips: (query: string) => apiClient.get('/trips/search', { params: { q: query } }),
  getTripById: (id: number) => apiClient.get(`/trips/${id}`),
  getTripItinerary: (id: number) => apiClient.get(`/trips/${id}/itinerary`),

  // Paginated trips - for lazy loading
  getTripsPaginated: (params: {
    page?: number;
    size?: number;
    category?: string;
    activityType?: string;
    source?: string;
    sortBy?: string;
    sortDir?: string;
  }) => apiClient.get('/trips/paginated', { params }),

  // Get all categories with counts
  getCategories: () => apiClient.get('/trips/categories'),

  // Get all activity types
  getActivityTypes: () => apiClient.get('/trips/activity-types'),

  // Hotels
  getHotels: (destinationId?: number) =>
    apiClient.get('/hotels', { params: destinationId ? { destinationId } : {} }),
  getBoutiqueHotels: () => apiClient.get('/hotels/boutique'),
  getFeaturedHotels: () => apiClient.get('/hotels/featured'),
  getHotelById: (id: number) => apiClient.get(`/hotels/${id}`),

  // Testimonials
  getTestimonials: () => apiClient.get('/testimonials'),
  getFeaturedTestimonials: () => apiClient.get('/testimonials/featured'),

  // Ads
  getActiveAds: () => apiClient.get('/ads/active'),

  // Blogs
  getBlogs: () => apiClient.get('/blogs'),
  getFeaturedBlogs: () => apiClient.get('/blogs/featured'),
  getRecentBlogs: () => apiClient.get('/blogs/recent'),
  getBlogById: (id: number) => apiClient.get(`/blogs/${id}`),
  getBlogBySlug: (slug: string) => apiClient.get(`/blogs/slug/${slug}`),

  // Bookings
  createBooking: (bookingData: any) => apiClient.post('/bookings', bookingData),
  getBooking: (reference: string) => apiClient.get(`/bookings/${reference}`),
  updatePaymentStatus: (reference: string, paymentData: any) =>
    apiClient.post(`/bookings/${reference}/payment`, paymentData),

  // Events
  getEvents: () => apiClient.get('/events'),
  getFeaturedEvents: () => apiClient.get('/events/featured'),
  getEventById: (id: number) => apiClient.get(`/events/${id}`),
  getEventBySlug: (slug: string) => apiClient.get(`/events/slug/${slug}`),
  getEventsByCategory: (category: string) => apiClient.get(`/events/category/${category}`),
  getEventsByCity: (city: string) => apiClient.get(`/events/city/${city}`),

  // Event Bookings
  createEventBooking: (data: any) => apiClient.post('/event-bookings', data),
  getEventBooking: (reference: string) => apiClient.get(`/event-bookings/${reference}`),

  // Payment
  initiatePayment: (bookingReference: string) => apiClient.post(`/payment/initiate/${bookingReference}`),
  initiateEventPayment: (bookingReference: string) => apiClient.post(`/payment/event/initiate/${bookingReference}`),
  getPaymentStatus: (bookingReference: string) => apiClient.get(`/payment/status/${bookingReference}`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    // Add timestamp to prevent caching
    params: {
      _t: Date.now()
    }
  }),
  getEventPaymentStatus: (bookingReference: string) => apiClient.get(`/payment/event/status/${bookingReference}`, {
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' },
    params: { _t: Date.now() },
  }),

  // Seed Data
  seedData: () => apiClient.post('/seed/data'),

  // Direct API client access for custom calls
  get: (url: string) => apiClient.get(url),
  post: (url: string, data?: any) => apiClient.post(url, data),

  // Admin Authentication
  adminLogin: (username: string, password: string) =>
    apiClient.post('/admin/login', { username, password }),
  adminLogout: (token: string) =>
    apiClient.post('/admin/logout', {}, { headers: { Authorization: `Bearer ${token}` } }),
  adminVerify: (token: string) =>
    apiClient.get('/admin/verify', { headers: { Authorization: `Bearer ${token}` } }),

  // Admin CRUD Operations
  admin: {
    // Settings
    getSettings: () => apiClient.get('/admin/settings'),
    updateSettings: (settings: Record<string, unknown>) => apiClient.put('/admin/settings', settings),

    // Pages
    getPages: () => apiClient.get('/admin/pages'),
    getPage: (id: number) => apiClient.get(`/admin/pages/${id}`),
    updatePage: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/pages/${id}`, data),

    // Stats
    getStats: () => apiClient.get('/admin/stats'),
    updateStat: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/stats/${id}`, data),

    // Sections
    getSections: () => apiClient.get('/admin/sections'),
    updateSection: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/sections/${id}`, data),

    // Features
    getFeatures: () => apiClient.get('/admin/features'),
    updateFeature: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/features/${id}`, data),

    // Destinations
    getDestinations: () => apiClient.get('/admin/destinations'),
    updateDestination: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/destinations/${id}`, data),
    createDestination: (data: Record<string, unknown>) => apiClient.post('/admin/destinations', data),
    deleteDestination: (id: number) => apiClient.delete(`/admin/destinations/${id}`),
    getDestinationDetails: (id: number) => apiClient.get(`/admin/destinations/${id}/details`),
    updateDestinationDetails: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/destinations/${id}/details`, data),
    createDestinationDetails: (id: number, data: Record<string, unknown>) => apiClient.post(`/admin/destinations/${id}/details`, data),

    // Trips
    getTrips: () => apiClient.get('/admin/trips'),
    updateTrip: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/trips/${id}`, data),
    createTrip: (data: Record<string, unknown>) => apiClient.post('/admin/trips', data),
    deleteTrip: (id: number) => apiClient.delete(`/admin/trips/${id}`),
    getTripItineraries: (id: number) => apiClient.get(`/admin/trips/${id}/itineraries`),
    createTripItinerary: (id: number, data: Record<string, unknown>) => apiClient.post(`/admin/trips/${id}/itineraries`, data),
    updateTripItinerary: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/itineraries/${id}`, data),
    deleteTripItinerary: (id: number) => apiClient.delete(`/admin/itineraries/${id}`),

    // Hotels
    getHotels: () => apiClient.get('/admin/hotels'),
    updateHotel: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/hotels/${id}`, data),
    createHotel: (data: Record<string, unknown>) => apiClient.post('/admin/hotels', data),
    deleteHotel: (id: number) => apiClient.delete(`/admin/hotels/${id}`),

    // Testimonials
    getTestimonials: () => apiClient.get('/admin/testimonials'),
    updateTestimonial: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/testimonials/${id}`, data),
    createTestimonial: (data: Record<string, unknown>) => apiClient.post('/admin/testimonials', data),
    deleteTestimonial: (id: number) => apiClient.delete(`/admin/testimonials/${id}`),

    // Blogs
    getBlogs: () => apiClient.get('/admin/blogs'),
    updateBlog: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/blogs/${id}`, data),
    createBlog: (data: Record<string, unknown>) => apiClient.post('/admin/blogs', data),
    deleteBlog: (id: number) => apiClient.delete(`/admin/blogs/${id}`),

    // Events
    getEvents: () => apiClient.get('/admin/events'),
    updateEvent: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/events/${id}`, data),
    createEvent: (data: Record<string, unknown>) => apiClient.post('/admin/events', data),
    deleteEvent: (id: number) => apiClient.delete(`/admin/events/${id}`),

    // Media upload
    uploadImage: (file: File, folder = 'admin') => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      return apiClient.post('/admin/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },

    // Bookings
    getBookings: () => apiClient.get('/admin/bookings'),
    getBooking: (id: number) => apiClient.get(`/admin/bookings/${id}`),
    getEventBookings: () => apiClient.get('/admin/event-bookings'),
    markBookingAsReviewed: (reference: string) => apiClient.put(`/admin/bookings/${reference}/review`),
    updateBookingStatus: (id: number, status: string) => apiClient.put(`/admin/bookings/${id}/status`, { status }),

    // Contact Inquiries
    getInquiries: () => apiClient.get('/admin/inquiries'),
    getInquiryCounts: () => apiClient.get('/admin/inquiries/count'),
    getInquiry: (id: number) => apiClient.get(`/admin/inquiries/${id}`),
    markInquiryAsRead: (id: number) => apiClient.put(`/admin/inquiries/${id}/read`),
    updateInquiryStatus: (id: number, status: string) => apiClient.put(`/admin/inquiries/${id}/status`, { status }),
    updateInquiryNotes: (id: number, notes: string) => apiClient.put(`/admin/inquiries/${id}/notes`, { notes }),
    deleteInquiry: (id: number) => apiClient.delete(`/admin/inquiries/${id}`),

    // Ads
    getAds: () => apiClient.get('/ads'),
    updateAd: (id: number, data: Record<string, unknown>) => apiClient.put(`/ads/${id}`, data),
    createAd: (data: Record<string, unknown>) => apiClient.post('/ads', data),
    deleteAd: (id: number) => apiClient.delete(`/ads/${id}`),
  },

  // Contact Form (Public)
  submitContactInquiry: (data: {
    name: string;
    email: string;
    phone?: string;
    destination?: string;
    travelers?: string;
    preferredDates?: string;
    message?: string;
  }) => apiClient.post('/contact', data),
};
