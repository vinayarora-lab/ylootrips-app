'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, FileText, MapPin, Compass, Building,
    MessageSquare, BookOpen, Settings, LogOut, ChevronRight,
    Save, RefreshCw, Plus, Trash2, Eye, ChevronDown, ChevronUp,
    ShoppingBag, CheckCircle, XCircle, Clock, Mail, User, Calendar, Phone,
    Megaphone
    , Upload, Copy, Link2, X
} from 'lucide-react';
import { api } from '@/lib/api';
import ImagePreview from '@/components/ImagePreview';
import EditableList from '@/components/EditableList';
import { formatPrice } from '@/lib/utils';
import InlineImageUploader from '@/components/InlineImageUploader';

interface PageData {
    id: number;
    pageKey: string;
    pageTitle: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
}

interface Stat {
    id: number;
    value: string;
    label: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('destinations');
    const [pages, setPages] = useState<PageData[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [destinations, setDestinations] = useState<Record<string, unknown>[]>([]);
    const [trips, setTrips] = useState<Record<string, unknown>[]>([]); // Experiences
    const [hotels, setHotels] = useState<Record<string, unknown>[]>([]); // Stays
    const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([]);
    const [blogs, setBlogs] = useState<Record<string, unknown>[]>([]); // Journals
    const [events, setEvents] = useState<Record<string, unknown>[]>([]);
    const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
    const [eventBookings, setEventBookings] = useState<Record<string, unknown>[]>([]);
    const [destinationDetails, setDestinationDetails] = useState<Record<number, Record<string, unknown>>>({});
    const [tripItineraries, setTripItineraries] = useState<Record<number, Record<string, unknown>[]>>({});
    const [expandedDestinations, setExpandedDestinations] = useState<Record<number, boolean>>({});
    const [expandedTrips, setExpandedTrips] = useState<Record<number, boolean>>({});
    const [expandedHotels, setExpandedHotels] = useState<Record<number, boolean>>({});
    const [expandedBlogs, setExpandedBlogs] = useState<Record<number, boolean>>({});
    const [inquiries, setInquiries] = useState<Record<string, unknown>[]>([]);
    const [ads, setAds] = useState<Record<string, unknown>[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadFolder, setUploadFolder] = useState('admin');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Check if admin is logged in
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/');
            return;
        }

        // Verify token
        api.adminVerify(token).catch(() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminName');
            router.push('/');
        });

        // Load only destinations on initial load for fast startup
        fetchTabData('destinations');
    }, [router]);

    // Track which tabs have been loaded
    const [loadedTabs, setLoadedTabs] = useState<Record<string, boolean>>({ destinations: false });
    const [tabLoading, setTabLoading] = useState<Record<string, boolean>>({});

    // Pagination
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

    // Fetch data for a specific tab
    const fetchTabData = async (tab: string, forceRefresh = false) => {
        if (loadedTabs[tab] && !forceRefresh) return;

        setTabLoading(prev => ({ ...prev, [tab]: true }));

        try {
            switch (tab) {
                case 'destinations':
                    const destRes = await api.admin.getDestinations();
                    setDestinations(Array.isArray(destRes.data) ? destRes.data : []);
                    break;
                case 'experiences':
                    const tripsRes = await api.admin.getTrips();
                    setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
                    break;
                case 'stays':
                    const hotelsRes = await api.admin.getHotels();
                    setHotels(Array.isArray(hotelsRes.data) ? hotelsRes.data : []);
                    break;
                case 'journals':
                    const blogsRes = await api.admin.getBlogs();
                    setBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : []);
                    break;
                case 'events':
                    const eventsRes = await api.admin.getEvents();
                    setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
                    break;
                case 'pages':
                    const pagesRes = await api.admin.getPages();
                    setPages(Array.isArray(pagesRes.data) ? pagesRes.data : []);
                    break;
                case 'stats':
                    const statsRes = await api.admin.getStats();
                    setStats(Array.isArray(statsRes.data) ? statsRes.data : []);
                    break;
                case 'testimonials':
                    const testsRes = await api.admin.getTestimonials();
                    setTestimonials(Array.isArray(testsRes.data) ? testsRes.data : []);
                    break;
                case 'bookings':
                    const [bookingsRes, eventBookingsRes] = await Promise.all([
                        api.admin.getBookings(),
                        api.admin.getEventBookings(),
                    ]);
                    setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
                    setEventBookings(Array.isArray(eventBookingsRes.data) ? eventBookingsRes.data : []);
                    break;
                case 'inquiries':
                    const inquiriesRes = await api.admin.getInquiries();
                    setInquiries(Array.isArray(inquiriesRes.data) ? inquiriesRes.data : []);
                    break;
                case 'ads':
                    const adsRes = await api.admin.getAds();
                    setAds(Array.isArray(adsRes.data) ? adsRes.data : []);
                    break;
            }
            setLoadedTabs(prev => ({ ...prev, [tab]: true }));
            setCurrentPage(prev => ({ ...prev, [tab]: 1 }));
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to load ${tab} data` });
        }

        setTabLoading(prev => ({ ...prev, [tab]: false }));
        setLoading(false);
    };

    // Handle tab change - lazy load data
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        fetchTabData(tab);
    };

    // Pagination helper
    const getPaginatedData = <T,>(data: T[], tab: string): T[] => {
        const page = currentPage[tab] || 1;
        const start = (page - 1) * ITEMS_PER_PAGE;
        return data.slice(start, start + ITEMS_PER_PAGE);
    };

    const getTotalPages = (dataLength: number): number => {
        return Math.ceil(dataLength / ITEMS_PER_PAGE);
    };

    // Refresh current tab
    const refreshCurrentTab = () => {
        fetchTabData(activeTab, true);
    };

    const handleLogout = () => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            api.adminLogout(token);
        }
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        router.push('/');
    };

    const handleSavePage = async (page: PageData) => {
        setSaving(true);
        try {
            await api.admin.updatePage(page.id, page as unknown as Record<string, unknown>);
            setMessage({ type: 'success', text: 'Page updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update page' });
        }
        setSaving(false);
    };

    const handleSaveStat = async (stat: Stat) => {
        setSaving(true);
        try {
            await api.admin.updateStat(stat.id, stat as unknown as Record<string, unknown>);
            setMessage({ type: 'success', text: 'Stat updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update stat' });
        }
        setSaving(false);
    };

    const handleSaveDestination = async (dest: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateDestination(dest.id as number, dest);
            // Save destination details if they exist
            const details = destinationDetails[dest.id as number];
            if (details) {
                await api.admin.updateDestinationDetails(dest.id as number, details).catch(() => { });
            }
            setMessage({ type: 'success', text: 'Destination updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update destination' });
        }
        setSaving(false);
    };

    const handleSaveDestinationDetails = async (destId: number, details: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateDestinationDetails(destId, details);
            setDestinationDetails({ ...destinationDetails, [destId]: details });
            setMessage({ type: 'success', text: 'Destination details updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update destination details' });
        }
        setSaving(false);
    };

    const toggleDestinationExpanded = (id: number) => {
        setExpandedDestinations({ ...expandedDestinations, [id]: !expandedDestinations[id] });
        // Load details if expanding for first time
        if (!expandedDestinations[id] && !destinationDetails[id]) {
            api.admin.getDestinationDetails(id).then(res => {
                if (res.data) {
                    setDestinationDetails({ ...destinationDetails, [id]: res.data });
                }
            }).catch(() => { });
        }
    };

    const handleSaveTrip = async (trip: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateTrip(trip.id as number, trip);
            await fetchTabData('experiences', true);
            setMessage({ type: 'success', text: 'Trip updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update trip' });
        }
        setSaving(false);
    };

    const toggleTripExpanded = (id: number) => {
        setExpandedTrips({ ...expandedTrips, [id]: !expandedTrips[id] });
        if (!expandedTrips[id] && !tripItineraries[id]) {
            api.admin.getTripItineraries(id).then(res => {
                if (Array.isArray(res.data)) {
                    setTripItineraries({ ...tripItineraries, [id]: res.data });
                }
            }).catch(() => {
                // silently handle - trip might not have itineraries yet
            });
        }
    };

    const handleSaveItinerary = async (tripId: number, itinerary: Record<string, unknown>) => {
        setSaving(true);
        try {
            if (itinerary.id) {
                await api.admin.updateTripItinerary(itinerary.id as number, itinerary);
            } else {
                await api.admin.createTripItinerary(tripId, itinerary);
            }
            setMessage({ type: 'success', text: 'Itinerary saved!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to save itinerary' });
        }
        setSaving(false);
    };

    const handleDeleteItinerary = async (id: number) => {
        if (!confirm('Are you sure you want to delete this itinerary day?')) return;
        setSaving(true);
        try {
            await api.admin.deleteTripItinerary(id);
            setMessage({ type: 'success', text: 'Itinerary deleted!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete itinerary' });
        }
        setSaving(false);
    };

    const toggleHotelExpanded = (id: number) => {
        setExpandedHotels({ ...expandedHotels, [id]: !expandedHotels[id] });
    };

    const toggleBlogExpanded = (id: number) => {
        setExpandedBlogs({ ...expandedBlogs, [id]: !expandedBlogs[id] });
    };

    const handleSaveHotel = async (hotel: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateHotel(hotel.id as number, hotel);
            setMessage({ type: 'success', text: 'Hotel updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update hotel' });
        }
        setSaving(false);
    };

    const handleSaveTestimonial = async (test: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateTestimonial(test.id as number, test);
            await fetchTabData('testimonials', true);
            setMessage({ type: 'success', text: 'Testimonial updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update testimonial' });
        }
        setSaving(false);
    };

    const handleCreateDestination = async () => {
        setSaving(true);
        try {
            const newDest = {
                name: 'New Destination',
                slug: 'new-destination',
                description: '',
                imageUrl: '',
                country: '',
                region: '',
                tripCount: 0,
                isFeatured: false,
            };
            await api.admin.createDestination(newDest);
            setMessage({ type: 'success', text: 'Destination created!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create destination' });
        }
        setSaving(false);
    };

    const handleCreateTrip = async () => {
        setSaving(true);
        try {
            const newTrip = {
                title: 'New Trip',
                description: '',
                shortDescription: '',
                destination: '',
                imageUrl: '',
                price: 0,
                originalPrice: 0,
                duration: '',
                difficulty: '',
                category: '',
                rating: 0,
                reviewCount: 0,
                maxGroupSize: 10,
                isFeatured: false,
                isPopular: false,
                isTrending: false,
            };
            await api.admin.createTrip(newTrip);
            setMessage({ type: 'success', text: 'Trip created!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create trip' });
        }
        setSaving(false);
    };

    const handleCreateHotel = async () => {
        setSaving(true);
        try {
            const newHotel = {
                name: 'New Hotel',
                description: '',
                imageUrl: '',
                location: '',
                city: '',
                country: '',
                rating: 0,
                reviewCount: 0,
                pricePerNight: 0,
                type: '',
                isBoutique: false,
                isFeatured: false,
            };
            await api.admin.createHotel(newHotel);
            setMessage({ type: 'success', text: 'Hotel created!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create hotel' });
        }
        setSaving(false);
    };

    const handleCreateTestimonial = async () => {
        setSaving(true);
        try {
            const newTest = {
                userName: 'New User',
                userTitle: '',
                userImage: '',
                photoGallery: '[]',
                comment: '',
                isFeatured: false,
                displayOrder: 0,
            };
            await api.admin.createTestimonial(newTest);
            setMessage({ type: 'success', text: 'Testimonial created!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create testimonial' });
        }
        setSaving(false);
    };

    const handleDeleteDestination = async (id: number) => {
        if (!confirm('Are you sure you want to delete this destination?')) return;
        setSaving(true);
        try {
            await api.admin.deleteDestination(id);
            setMessage({ type: 'success', text: 'Destination deleted!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete destination' });
        }
        setSaving(false);
    };

    const handleDeleteTrip = async (id: number) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;
        setSaving(true);
        try {
            await api.admin.deleteTrip(id);
            setMessage({ type: 'success', text: 'Trip deleted!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete trip' });
        }
        setSaving(false);
    };

    const handleDeleteHotel = async (id: number) => {
        if (!confirm('Are you sure you want to delete this hotel?')) return;
        setSaving(true);
        try {
            await api.admin.deleteHotel(id);
            setMessage({ type: 'success', text: 'Hotel deleted!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete hotel' });
        }
        setSaving(false);
    };

    const handleDeleteTestimonial = async (id: number) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        setSaving(true);
        try {
            await api.admin.deleteTestimonial(id);
            setMessage({ type: 'success', text: 'Testimonial deleted!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete testimonial' });
        }
        setSaving(false);
    };

    const handleSaveBlog = async (blog: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateBlog(blog.id as number, blog);
            setMessage({ type: 'success', text: 'Blog updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update blog' });
        }
        setSaving(false);
    };

    const handleCreateBlog = async () => {
        setSaving(true);
        try {
            const newBlog = {
                title: 'New Blog Post',
                content: '',
                shortDescription: '',
                imageUrl: '',
                slug: 'new-blog-post',
                authorName: '',
                publishedDate: new Date().toISOString().split('T')[0],
                category: '',
                readTime: '5 min',
                isFeatured: false,
            };
            await api.admin.createBlog(newBlog);
            setMessage({ type: 'success', text: 'Blog created!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create blog' });
        }
        setSaving(false);
    };

    const handleDeleteBlog = async (id: number) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        setSaving(true);
        try {
            await api.admin.deleteBlog(id);
            setMessage({ type: 'success', text: 'Blog deleted!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete blog' });
        }
        setSaving(false);
    };

    const handleAdminImageUpload = async () => {
        if (!uploadFile) {
            setMessage({ type: 'error', text: 'Please choose an image file first.' });
            return;
        }
        setUploadingImage(true);
        try {
            const res = await api.admin.uploadImage(uploadFile, uploadFolder || 'admin');
            const url = res.data?.url || '';
            setUploadedImageUrl(url);
            setMessage({ type: 'success', text: 'Image uploaded successfully. Copy URL and paste in any image field.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err?.response?.data?.error || 'Image upload failed' });
        }
        setUploadingImage(false);
    };

    const parseStringArrayField = (value: unknown): string[] => {
        if (Array.isArray(value)) {
            return value
                .map((item) => String(item).trim())
                .filter(Boolean);
        }
        if (typeof value !== 'string') return [];
        const trimmed = value.trim();
        if (!trimmed) return [];
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed
                    .map((item) => String(item).trim())
                    .filter(Boolean);
            }
            return [];
        } catch {
            return trimmed
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
    };

    const serializeStringArrayField = (items: string[]): string =>
        JSON.stringify(items.map((item) => item.trim()).filter(Boolean));

    const handleUploadTestimonialImages = async (testimonialId: number, files: FileList | null) => {
        if (!files || files.length === 0) return;
        setSaving(true);
        try {
            const uploadResults = await Promise.all(
                Array.from(files).map((file) => api.admin.uploadImage(file, 'testimonials'))
            );
            const newUrls = uploadResults
                .map((res) => (typeof res.data?.url === 'string' ? res.data.url.trim() : ''))
                .filter(Boolean);

            setTestimonials((prev) =>
                prev.map((testimonial) => {
                    if ((testimonial.id as number) !== testimonialId) return testimonial;
                    const existingUrls = parseStringArrayField(testimonial.photoGallery);
                    const merged = Array.from(new Set([...existingUrls, ...newUrls]));
                    const currentUserImage =
                        typeof testimonial.userImage === 'string' ? testimonial.userImage.trim() : '';

                    return {
                        ...testimonial,
                        photoGallery: serializeStringArrayField(merged),
                        userImage: currentUserImage || merged[0] || '',
                    };
                })
            );
            setMessage({ type: 'success', text: `${newUrls.length} image(s) uploaded for testimonial.` });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err: unknown) {
            const errorText =
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
                    ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
                    : 'Failed to upload testimonial images';
            setMessage({ type: 'error', text: errorText || 'Failed to upload testimonial images' });
        } finally {
            setSaving(false);
        }
    };

    const parseListField = (value: unknown): string => {
        if (Array.isArray(value)) return value.join('\n');
        if (typeof value !== 'string') return '';
        const trimmed = value.trim();
        if (!trimmed) return '';
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed.join('\n');
            return trimmed;
        } catch {
            return trimmed;
        }
    };

    const toJsonListString = (value: string): string => {
        const items = value
            .split('\n')
            .map((x) => x.trim())
            .filter(Boolean);
        return JSON.stringify(items);
    };

    const handleSaveEvent = async (event: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateEvent(event.id as number, event);
            setMessage({ type: 'success', text: 'Event updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update event' });
        }
        setSaving(false);
    };

    const handleCreateEvent = async () => {
        setSaving(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const newEvent = {
                title: 'New Event',
                slug: `new-event-${Date.now()}`,
                description: '',
                shortDescription: '',
                longDescription: '',
                imageUrl: '',
                venueName: '',
                venueAddress: '',
                city: '',
                eventDate: today,
                eventTime: '18:00',
                price: 0,
                originalPrice: 0,
                category: '',
                capacity: 100,
                isFeatured: false,
                status: 'ACTIVE',
                highlights: '[]',
                faq: '[]',
                galleryUrls: '[]',
                includes: '[]',
                ageRestriction: '',
                importantInfo: '',
                duration: '',
                languages: '',
                bannerHighlights: '',
                aboutTagline: '',
                ticketTypes: [],
            };
            await api.admin.createEvent(newEvent);
            setMessage({ type: 'success', text: 'Event created!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create event' });
        }
        setSaving(false);
    };

    const handleDeleteEvent = async (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        setSaving(true);
        try {
            await api.admin.deleteEvent(id);
            setMessage({ type: 'success', text: 'Event deleted!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete event' });
        }
        setSaving(false);
    };

    const sidebarItems = [
        { id: 'destinations', icon: MapPin, label: 'Destinations' },
        { id: 'experiences', icon: Compass, label: 'Experiences' },
        { id: 'stays', icon: Building, label: 'Stays' },
        { id: 'journals', icon: BookOpen, label: 'Journals' },
        { id: 'events', icon: Calendar, label: 'Events' },
        { id: 'pages', icon: FileText, label: 'Page Content' },
        { id: 'stats', icon: LayoutDashboard, label: 'Statistics' },
        { id: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
        { id: 'bookings', icon: ShoppingBag, label: 'Bookings', href: '/admin/bookings' },
        { id: 'inquiries', icon: Mail, label: 'Inquiries' },
        { id: 'ads', icon: Megaphone, label: 'Ads' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-cream-dark flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-primary/60">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-dark flex">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-cream fixed h-full">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="font-display text-2xl">YlooTrips</Link>
                    <p className="text-caption text-cream/50 mt-1">Admin Panel</p>
                </div>

                <nav className="p-4">
                    {sidebarItems.map((item) => (
                        (item as { href?: string }).href ? (
                            <Link
                                key={item.id}
                                href={(item as { href: string }).href}
                                className={`w-full flex items-center gap-3 px-4 py-3 mb-1 transition-colors text-cream/60 hover:bg-white/5 hover:text-cream`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            </Link>
                        ) : (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 mb-1 transition-colors ${activeTab === item.id
                                    ? 'bg-accent text-primary'
                                    : 'text-cream/60 hover:bg-white/5 hover:text-cream'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                                {tabLoading[item.id] && <RefreshCw className="w-4 h-4 ml-auto animate-spin" />}
                                {activeTab === item.id && !tabLoading[item.id] && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </button>
                        )
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-cream/60 hover:bg-white/5 hover:text-cream transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display text-3xl text-primary capitalize">{activeTab}</h1>
                        <p className="text-primary/50 text-sm mt-1">Manage your {activeTab} content</p>
                    </div>
                    <button
                        onClick={refreshCurrentTab}
                        className="flex items-center gap-2 px-4 py-2 bg-cream text-primary hover:bg-white transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Refresh</span>
                    </button>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-6 p-4 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                        } border`}>
                        {message.text}
                    </div>
                )}

                {/* Global Image Upload Tool */}
                <div className="mb-6 p-4 border border-primary/10 bg-cream-light">
                    <div className="flex items-center gap-2 mb-3">
                        <Upload className="w-4 h-4 text-secondary" />
                        <h3 className="text-sm font-medium text-primary">Upload Image to Cloud Bucket</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            className="px-3 py-2 border border-primary/20 bg-cream"
                        />
                        <input
                            type="text"
                            value={uploadFolder}
                            onChange={(e) => setUploadFolder(e.target.value)}
                            placeholder="Folder (e.g. trips, events, testimonials)"
                            className="px-3 py-2 border border-primary/20 bg-cream"
                        />
                        <button
                            onClick={handleAdminImageUpload}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark disabled:opacity-50"
                        >
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </button>
                        <button
                            onClick={async () => {
                                if (!uploadedImageUrl) return;
                                await navigator.clipboard.writeText(uploadedImageUrl);
                                setMessage({ type: 'success', text: 'Image URL copied to clipboard.' });
                            }}
                            disabled={!uploadedImageUrl}
                            className="px-4 py-2 bg-primary text-cream hover:bg-primary-light disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            <span>Copy URL</span>
                        </button>
                    </div>
                    {uploadedImageUrl && (
                        <div className="mt-3 p-3 border border-primary/10 bg-cream">
                            <div className="flex items-center gap-2 text-xs text-primary/70 mb-2">
                                <Link2 className="w-3 h-3" />
                                Uploaded URL
                            </div>
                            <div className="text-xs break-all text-primary">{uploadedImageUrl}</div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="bg-cream p-6 shadow-sm">

                    {/* Pages Tab */}
                    {activeTab === 'pages' && (
                        <div className="space-y-8">
                            {pages.map((page) => (
                                <div key={page.id} className="border-b border-primary/10 pb-8 last:border-0">
                                    <h3 className="font-display text-xl text-primary mb-4 capitalize">{page.pageKey} Page</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Image Upload */}
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Hero Image"
                                                value={page.heroImageUrl || ''}
                                                onChange={url => setPages(pages.map(p => p.id === page.id ? { ...p, heroImageUrl: url } : p))}
                                                folder="pages"
                                                previewHeight="h-48"
                                            />
                                        </div>

                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Title</label>
                                                <input
                                                    type="text"
                                                    value={page.heroTitle || ''}
                                                    onChange={(e) => setPages(pages.map(p => p.id === page.id ? { ...p, heroTitle: e.target.value } : p))}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Subtitle</label>
                                                <textarea
                                                    value={page.heroSubtitle || ''}
                                                    onChange={(e) => setPages(pages.map(p => p.id === page.id ? { ...p, heroSubtitle: e.target.value } : p))}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleSavePage(page)}
                                                disabled={saving}
                                                className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                            >
                                                <Save className="w-4 h-4" />
                                                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.id} className="p-4 border border-primary/10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Value</label>
                                            <input
                                                type="text"
                                                value={stat.value}
                                                onChange={(e) => setStats(stats.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Label</label>
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) => setStats(stats.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSaveStat(stat)}
                                        disabled={saving}
                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-cream hover:bg-primary-light transition-colors text-sm disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Destinations Tab */}
                    {activeTab === 'destinations' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Destinations</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage travel destinations</p>
                                </div>
                                <button
                                    onClick={handleCreateDestination}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Destination</span>
                                </button>
                            </div>
                            {destinations.map((dest) => (
                                <div key={dest.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Destination Image"
                                                value={dest.imageUrl as string || ''}
                                                onChange={url => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, imageUrl: url } : d))}
                                                folder="destinations"
                                                previewHeight="h-48"
                                            />
                                        </div>

                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Name</label>
                                                    <input
                                                        type="text"
                                                        value={dest.name as string || ''}
                                                        onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, name: e.target.value } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Slug</label>
                                                    <input
                                                        type="text"
                                                        value={dest.slug as string || ''}
                                                        onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, slug: e.target.value } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Trip Count</label>
                                                    <input
                                                        type="number"
                                                        value={dest.tripCount as number || 0}
                                                        onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, tripCount: Number(e.target.value) } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Region</label>
                                                    <input
                                                        type="text"
                                                        value={dest.region as string || ''}
                                                        onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, region: e.target.value } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Country</label>
                                                    <input
                                                        type="text"
                                                        value={dest.country as string || ''}
                                                        onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, country: e.target.value } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4 pt-6">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={dest.isFeatured as boolean || false}
                                                            onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, isFeatured: e.target.checked } : d))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Featured</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                                <textarea
                                                    value={dest.description as string || ''}
                                                    onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, description: e.target.value } : d))}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveDestination(dest)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDestination(dest.id as number)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Destination Details Section - Expandable */}
                                    <div className="mt-4 border-t border-primary/10 pt-4">
                                        <button
                                            onClick={() => toggleDestinationExpanded(dest.id as number)}
                                            className="w-full flex items-center justify-between px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-primary">Destination Details & Content</span>
                                            {expandedDestinations[dest.id as number] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>

                                        {expandedDestinations[dest.id as number] && (
                                            <div className="mt-4 p-4 bg-cream space-y-4">
                                                {(() => {
                                                    const details = destinationDetails[dest.id as number] || {};
                                                    return (
                                                        <>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="md:col-span-2">
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Overview</label>
                                                                    <textarea
                                                                        value={details.overview as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, overview: e.target.value } })}
                                                                        rows={4}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Best Time to Visit</label>
                                                                    <textarea
                                                                        value={details.bestTimeToVisit as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, bestTimeToVisit: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Climate</label>
                                                                    <textarea
                                                                        value={details.climate as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, climate: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Culture</label>
                                                                    <textarea
                                                                        value={details.culture as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, culture: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Cuisine</label>
                                                                    <textarea
                                                                        value={details.cuisine as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, cuisine: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Visa Info</label>
                                                                    <textarea
                                                                        value={details.visaInfo as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, visaInfo: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Currency</label>
                                                                    <input
                                                                        type="text"
                                                                        value={details.currency as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, currency: e.target.value } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Language</label>
                                                                    <input
                                                                        type="text"
                                                                        value={details.language as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, language: e.target.value } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Time Zone</label>
                                                                    <input
                                                                        type="text"
                                                                        value={details.timeZone as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, timeZone: e.target.value } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Safety Rating</label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.1"
                                                                        min="0"
                                                                        max="5"
                                                                        value={details.safetyRating as number || 0}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, safetyRating: Number(e.target.value) } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Budget Range</label>
                                                                    <input
                                                                        type="text"
                                                                        value={details.budgetRange as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, budgetRange: e.target.value } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <EditableList
                                                                items={Array.isArray(details.highlights) ? details.highlights : []}
                                                                onChange={(items) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, highlights: items } })}
                                                                label="Highlights"
                                                                placeholder="Add highlight..."
                                                            />

                                                            <EditableList
                                                                items={Array.isArray(details.galleryImages) ? details.galleryImages : []}
                                                                onChange={(items) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, galleryImages: items } })}
                                                                label="Gallery Images (URLs)"
                                                                placeholder="Add image URL..."
                                                            />

                                                            <EditableList
                                                                items={Array.isArray(details.popularActivities) ? details.popularActivities : []}
                                                                onChange={(items) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, popularActivities: items } })}
                                                                label="Popular Activities"
                                                                placeholder="Add activity..."
                                                            />

                                                            <button
                                                                onClick={() => handleSaveDestinationDetails(dest.id as number, details)}
                                                                disabled={saving}
                                                                className="flex items-center gap-2 px-6 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                                <span>Save Details</span>
                                                            </button>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Experiences Tab (Trips) */}
                    {activeTab === 'experiences' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Experiences</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage travel experiences and trips</p>
                                </div>
                                <button
                                    onClick={handleCreateTrip}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Experience</span>
                                </button>
                            </div>
                            {trips.map((trip) => (
                                <div key={trip.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Trip Image"
                                                value={trip.imageUrl as string || ''}
                                                onChange={url => setTrips(trips.map(t => t.id === trip.id ? { ...t, imageUrl: url } : t))}
                                                folder="trips"
                                                previewHeight="h-48"
                                            />
                                        </div>

                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        value={trip.title as string || ''}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, title: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={trip.price as number || 0}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, price: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                    {(trip.price && typeof trip.price === 'number' && trip.price > 0) ? (
                                                        <p className="text-xs text-primary/50 mt-1">{formatPrice(trip.price)}</p>
                                                    ) : null}
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Discount (%) → auto-calculates MRP</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="99"
                                                        value={(() => {
                                                            const p = Number(trip.price) || 0;
                                                            const op = Number(trip.originalPrice) || 0;
                                                            if (op > 0 && p > 0 && op > p) return Math.round((1 - p / op) * 100);
                                                            return 0;
                                                        })()}
                                                        onChange={(e) => {
                                                            const discount = Math.min(99, Math.max(0, Number(e.target.value)));
                                                            const price = Number(trip.price) || 0;
                                                            const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : 0;
                                                            setTrips(trips.map(t => t.id === trip.id ? { ...t, originalPrice } : t));
                                                        }}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                    {Number(trip.originalPrice) > 0 && (
                                                        <p className="text-xs text-primary/50 mt-1">MRP: {formatPrice(Number(trip.originalPrice))}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Duration</label>
                                                    <input
                                                        type="text"
                                                        value={trip.duration as string || ''}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, duration: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., 5 Days"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Difficulty</label>
                                                    <input
                                                        type="text"
                                                        value={trip.difficulty as string || ''}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, difficulty: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., Easy, Moderate, Hard"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Category</label>
                                                    <input
                                                        type="text"
                                                        value={trip.category as string || ''}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, category: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., Luxury, Adventure, Cultural"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Rating</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        value={trip.rating as number || 0}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, rating: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Review Count</label>
                                                    <input
                                                        type="number"
                                                        value={trip.reviewCount as number || 0}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, reviewCount: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Max Group Size</label>
                                                    <input
                                                        type="number"
                                                        value={trip.maxGroupSize as number || 10}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, maxGroupSize: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Destination</label>
                                                    <input
                                                        type="text"
                                                        value={trip.destination as string || ''}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, destination: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., Santorini, Greece"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-6 pt-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={trip.isFeatured as boolean || false}
                                                            onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, isFeatured: e.target.checked } : t))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Featured</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={trip.isPopular as boolean || false}
                                                            onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, isPopular: e.target.checked } : t))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Popular</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={trip.isTrending as boolean || false}
                                                            onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, isTrending: e.target.checked } : t))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Trending</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Short Description</label>
                                                <textarea
                                                    value={trip.shortDescription as string || ''}
                                                    onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, shortDescription: e.target.value } : t))}
                                                    rows={2}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Full Description</label>
                                                <textarea
                                                    value={trip.description as string || ''}
                                                    onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, description: e.target.value } : t))}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <EditableList
                                                label="Gallery Images (URLs)"
                                                items={Array.isArray(trip.images) ? trip.images : []}
                                                onChange={(items) => setTrips(trips.map(t => t.id === trip.id ? { ...t, images: items } : t))}
                                                placeholder="https://..."
                                            />
                                            <EditableList
                                                label="Highlights"
                                                items={Array.isArray(trip.highlights) ? trip.highlights : []}
                                                onChange={(items) => setTrips(trips.map(t => t.id === trip.id ? { ...t, highlights: items } : t))}
                                                placeholder="Add highlight..."
                                            />
                                            <EditableList
                                                label="Includes"
                                                items={Array.isArray(trip.includes) ? trip.includes : []}
                                                onChange={(items) => setTrips(trips.map(t => t.id === trip.id ? { ...t, includes: items } : t))}
                                                placeholder="Add include..."
                                            />
                                            <EditableList
                                                label="Excludes"
                                                items={Array.isArray(trip.excludes) ? trip.excludes : []}
                                                onChange={(items) => setTrips(trips.map(t => t.id === trip.id ? { ...t, excludes: items } : t))}
                                                placeholder="Add exclude..."
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveTrip(trip)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTrip(trip.id as number)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Trip Itineraries Section - Expandable */}
                                    <div className="mt-4 border-t border-primary/10 pt-4">
                                        <button
                                            onClick={() => toggleTripExpanded(trip.id as number)}
                                            className="w-full flex items-center justify-between px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-primary">Trip Itinerary (Day-by-Day)</span>
                                            {expandedTrips[trip.id as number] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>

                                        {expandedTrips[trip.id as number] && (
                                            <div className="mt-4 space-y-4">
                                                {(tripItineraries[trip.id as number] || []).map((itin: Record<string, unknown>, idx: number) => (
                                                    <div key={idx} className="p-4 bg-cream border border-primary/10">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Day Number</label>
                                                                <input
                                                                    type="number"
                                                                    value={itin.dayNumber as number || 0}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], dayNumber: Number(e.target.value) };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Day Title</label>
                                                                <input
                                                                    type="text"
                                                                    value={itin.dayTitle as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], dayTitle: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-3">
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                                                <textarea
                                                                    value={itin.description as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], description: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    rows={4}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Accommodation</label>
                                                                <input
                                                                    type="text"
                                                                    value={itin.accommodation as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], accommodation: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Meals</label>
                                                                <input
                                                                    type="text"
                                                                    value={itin.meals as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], meals: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image URL</label>
                                                                <input
                                                                    type="text"
                                                                    value={itin.imageUrl as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], imageUrl: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-3">
                                                                <EditableList
                                                                    items={Array.isArray(itin.activities) ? itin.activities : []}
                                                                    onChange={(items) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], activities: items };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    label="Activities"
                                                                    placeholder="Add activity..."
                                                                />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleSaveItinerary(trip.id as number, itin)}
                                                                    disabled={saving}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                                                >
                                                                    <Save className="w-4 h-4" />
                                                                    <span>Save Day</span>
                                                                </button>
                                                                {(itin.id && typeof itin.id === 'number') ? (
                                                                    <button
                                                                        onClick={() => handleDeleteItinerary(itin.id as number)}
                                                                        disabled={saving}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        <span>Delete</span>
                                                                    </button>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const newItin = { dayNumber: (tripItineraries[trip.id as number]?.length || 0) + 1, dayTitle: '', description: '', activities: [] };
                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: [...(tripItineraries[trip.id as number] || []), newItin] });
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add New Day</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stays Tab (Hotels) */}
                    {activeTab === 'stays' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Stays</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage hotels and accommodations</p>
                                </div>
                                <button
                                    onClick={handleCreateHotel}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Stay</span>
                                </button>
                            </div>
                            {hotels.map((hotel) => (
                                <div key={hotel.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Hotel Image"
                                                value={hotel.imageUrl as string || ''}
                                                onChange={url => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, imageUrl: url } : h))}
                                                folder="hotels"
                                                previewHeight="h-48"
                                            />
                                        </div>

                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Name</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.name as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, name: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Type</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.type as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, type: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., Boutique, Resort, Villa"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">City</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.city as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, city: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Country</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.country as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, country: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Location</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.location as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, location: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="Full address"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Price/Night (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={hotel.pricePerNight as number || 0}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, pricePerNight: Number(e.target.value) } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                    {(hotel.pricePerNight && typeof hotel.pricePerNight === 'number' && hotel.pricePerNight > 0) ? (
                                                        <p className="text-xs text-primary/50 mt-1">{formatPrice(hotel.pricePerNight)} / night</p>
                                                    ) : null}
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Rating</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        value={hotel.rating as number || 0}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, rating: Number(e.target.value) } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Review Count</label>
                                                    <input
                                                        type="number"
                                                        value={hotel.reviewCount as number || 0}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, reviewCount: Number(e.target.value) } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-6 pt-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={hotel.isFeatured as boolean || false}
                                                            onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, isFeatured: e.target.checked } : h))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Featured</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={hotel.isBoutique as boolean || false}
                                                            onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, isBoutique: e.target.checked } : h))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Boutique</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                                <textarea
                                                    value={hotel.description as string || ''}
                                                    onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, description: e.target.value } : h))}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveHotel(hotel)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteHotel(hotel.id as number)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hotel Amenities & Images Section - Expandable */}
                                    <div className="mt-4 border-t border-primary/10 pt-4">
                                        <button
                                            onClick={() => toggleHotelExpanded(hotel.id as number)}
                                            className="w-full flex items-center justify-between px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-primary">Amenities & Images</span>
                                            {expandedHotels[hotel.id as number] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>

                                        {expandedHotels[hotel.id as number] && (
                                            <div className="mt-4 p-4 bg-cream space-y-4">
                                                <EditableList
                                                    items={Array.isArray(hotel.amenities) ? hotel.amenities : []}
                                                    onChange={(items) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, amenities: items } : h))}
                                                    label="Amenities"
                                                    placeholder="Add amenity..."
                                                />

                                                <EditableList
                                                    items={Array.isArray(hotel.images) ? hotel.images : []}
                                                    onChange={(items) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, images: items } : h))}
                                                    label="Hotel Images (URLs)"
                                                    placeholder="Add image URL..."
                                                />

                                                <button
                                                    onClick={() => handleSaveHotel(hotel)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save Amenities & Images</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Journals Tab (Blogs) */}
                    {activeTab === 'journals' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Journals</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage travel journals and blog posts</p>
                                </div>
                                <button
                                    onClick={handleCreateBlog}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Journal</span>
                                </button>
                            </div>
                            {blogs.map((blog) => (
                                <div key={blog.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Blog Image"
                                                value={blog.imageUrl as string || ''}
                                                onChange={url => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, imageUrl: url } : b))}
                                                folder="blogs"
                                                previewHeight="h-48"
                                            />
                                        </div>

                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        value={blog.title as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, title: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Slug</label>
                                                    <input
                                                        type="text"
                                                        value={blog.slug as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, slug: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Category</label>
                                                    <input
                                                        type="text"
                                                        value={blog.category as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, category: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Author</label>
                                                    <input
                                                        type="text"
                                                        value={blog.authorName as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, authorName: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Published Date</label>
                                                    <input
                                                        type="date"
                                                        value={blog.publishedDate ? (blog.publishedDate as string).split('T')[0] : ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, publishedDate: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Read Time</label>
                                                    <input
                                                        type="text"
                                                        value={blog.readTime as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, readTime: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., 5 min"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4 pt-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={blog.isFeatured as boolean || false}
                                                            onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, isFeatured: e.target.checked } : b))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Featured</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Short Description</label>
                                                <textarea
                                                    value={blog.shortDescription as string || ''}
                                                    onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, shortDescription: e.target.value } : b))}
                                                    rows={2}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Content</label>
                                                <textarea
                                                    value={blog.content as string || ''}
                                                    onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, content: e.target.value } : b))}
                                                    rows={6}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveBlog(blog)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBlog(blog.id as number)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Blog Tags Section - Expandable */}
                                    <div className="mt-4 border-t border-primary/10 pt-4">
                                        <button
                                            onClick={() => toggleBlogExpanded(blog.id as number)}
                                            className="w-full flex items-center justify-between px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-primary">Tags</span>
                                            {expandedBlogs[blog.id as number] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>

                                        {expandedBlogs[blog.id as number] && (
                                            <div className="mt-4 p-4 bg-cream">
                                                <EditableList
                                                    items={Array.isArray(blog.tags) ? blog.tags : []}
                                                    onChange={(items) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, tags: items } : b))}
                                                    label="Blog Tags"
                                                    placeholder="Add tag..."
                                                />

                                                <button
                                                    onClick={() => handleSaveBlog(blog)}
                                                    disabled={saving}
                                                    className="mt-4 flex items-center gap-2 px-6 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save Tags</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Events</h2>
                                    <p className="text-sm text-primary/50 mt-1">Create and manage event page content and ticket types</p>
                                </div>
                                <button
                                    onClick={handleCreateEvent}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Event</span>
                                </button>
                            </div>
                            {events.map((event) => (
                                <div key={event.id as number} className="p-6 border border-primary/10 bg-cream-light space-y-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Event Image"
                                                value={event.imageUrl as string || ''}
                                                onChange={url => setEvents(events.map(ev => ev.id === event.id ? { ...ev, imageUrl: url } : ev))}
                                                folder="events"
                                                previewHeight="h-48"
                                            />
                                        </div>
                                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                                <input type="text" value={event.title as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, title: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Slug</label>
                                                <input type="text" value={event.slug as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, slug: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Category</label>
                                                <input type="text" value={event.category as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, category: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Event Date</label>
                                                <input type="date" value={(event.eventDate as string || '').split('T')[0]} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, eventDate: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Event Time</label>
                                                <input type="text" value={event.eventTime as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, eventTime: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Price</label>
                                                <input type="number" value={event.price as number || 0} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, price: Number(e.target.value) } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Discount (%) → auto-calculates MRP</label>
                                                <input type="number" min="0" max="99" value={(() => { const p = Number(event.price)||0; const op = Number(event.originalPrice)||0; if(op>0&&p>0&&op>p) return Math.round((1-p/op)*100); return 0; })()} onChange={(e) => { const discount = Math.min(99, Math.max(0, Number(e.target.value))); const price = Number(event.price)||0; const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : 0; setEvents(events.map(ev => ev.id === event.id ? { ...ev, originalPrice } : ev)); }} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                                {Number(event.originalPrice) > 0 && <p className="text-xs text-primary/50 mt-1">MRP: {formatPrice(Number(event.originalPrice))}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Capacity</label>
                                                <input type="number" value={event.capacity as number || 0} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, capacity: Number(e.target.value) } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Status</label>
                                                <select value={event.status as string || 'ACTIVE'} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, status: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary">
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="SOLD_OUT">SOLD_OUT</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Venue Name</label>
                                                <input type="text" value={event.venueName as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, venueName: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">City</label>
                                                <input type="text" value={event.city as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, city: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Venue Address</label>
                                                <input type="text" value={event.venueAddress as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, venueAddress: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Short Description</label>
                                        <textarea value={event.shortDescription as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, shortDescription: e.target.value } : ev))} rows={2} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                        <textarea value={event.description as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, description: e.target.value } : ev))} rows={3} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Long Description</label>
                                        <textarea value={event.longDescription as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, longDescription: e.target.value } : ev))} rows={5} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Highlights (one per line)</label>
                                            <textarea
                                                value={parseListField(event.highlights)}
                                                onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, highlights: toJsonListString(e.target.value) } : ev))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Includes (one per line)</label>
                                            <textarea
                                                value={parseListField(event.includes)}
                                                onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, includes: toJsonListString(e.target.value) } : ev))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Gallery URLs (one per line)</label>
                                            <textarea
                                                value={parseListField(event.galleryUrls)}
                                                onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, galleryUrls: toJsonListString(e.target.value) } : ev))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">FAQ (JSON)</label>
                                            <textarea
                                                value={event.faq as string || '[]'}
                                                onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, faq: e.target.value } : ev))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Ticket Types</label>
                                        <div className="space-y-3">
                                            {(Array.isArray(event.ticketTypes) ? event.ticketTypes : []).map((tt: any, idx: number) => (
                                                <div key={tt.id || idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 border border-primary/10 bg-cream">
                                                    <input type="text" placeholder="Name" value={tt.name || ''} onChange={(e) => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                        arr[idx] = { ...arr[idx], name: e.target.value };
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <input type="number" placeholder="Price" value={tt.price || 0} onChange={(e) => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                        arr[idx] = { ...arr[idx], price: Number(e.target.value) };
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <input type="number" placeholder="Disc%" min="0" max="99" value={(() => { const p = Number(tt.price)||0; const op = Number(tt.originalPrice)||0; if(op>0&&p>0&&op>p) return Math.round((1-p/op)*100); return 0; })()} onChange={(e) => { const discount = Math.min(99, Math.max(0, Number(e.target.value))); const price = Number(tt.price)||0; const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : 0; setEvents(events.map(ev => { if (ev.id !== event.id) return ev; const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : []; arr[idx] = { ...arr[idx], originalPrice }; return { ...ev, ticketTypes: arr }; })); }} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <input type="number" placeholder="Capacity" value={tt.capacity ?? 0} onChange={(e) => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                        arr[idx] = { ...arr[idx], capacity: Number(e.target.value) };
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <input type="number" placeholder="Sort" value={tt.sortOrder ?? idx} onChange={(e) => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                        arr[idx] = { ...arr[idx], sortOrder: Number(e.target.value) };
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <button onClick={() => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = (Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : []).filter((_: any, i: number) => i !== idx);
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 bg-red-500 text-white hover:bg-red-600">Remove</button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setEvents(events.map(ev => {
                                                    if (ev.id !== event.id) return ev;
                                                    const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                    arr.push({ name: '', description: '', price: 0, originalPrice: 0, capacity: 0, sortOrder: arr.length, isActive: true });
                                                    return { ...ev, ticketTypes: arr };
                                                }))}
                                                className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add Ticket Type</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => handleSaveEvent(event)} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50">
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button onClick={() => handleDeleteEvent(event.id as number)} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Testimonials Tab */}
                    {activeTab === 'testimonials' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-medium text-primary">Testimonials</h2>
                                <button
                                    onClick={handleCreateTestimonial}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New</span>
                                </button>
                            </div>
                            {testimonials.map((test) => (
                                <div key={test.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">User Name</label>
                                            <input
                                                type="text"
                                                value={test.userName as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userName: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title / Role</label>
                                            <input
                                                type="text"
                                                value={test.userTitle as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userTitle: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                placeholder="e.g. Adventure Traveler"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Display Order</label>
                                            <input
                                                type="number"
                                                value={test.displayOrder as number ?? 0}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, displayOrder: Number(e.target.value) } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4 pt-6">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={test.isFeatured as boolean || false}
                                                    onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, isFeatured: e.target.checked } : t))}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-primary/70">Featured</span>
                                            </label>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">User Image URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={test.userImage as string || ''}
                                                    onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userImage: e.target.value } : t))}
                                                    className="flex-1 px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    placeholder="https://..."
                                                />
                                                {(test.userImage && typeof test.userImage === 'string' && test.userImage.trim() !== '') ? (
                                                    <a href={test.userImage as string} target="_blank" rel="noopener noreferrer" className="px-4 py-3 border border-primary/20 bg-cream hover:bg-cream-dark flex items-center"><Eye className="w-4 h-4" /></a>
                                                ) : null}
                                            </div>
                                            {(test.userImage && typeof test.userImage === 'string' && test.userImage.trim() !== '') ? (
                                                <div className="mt-2 w-24 h-24 rounded overflow-hidden border border-primary/10">
                                                    <ImagePreview imageUrl={test.userImage as string} className="w-full h-full" />
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="border border-primary/10 rounded-lg bg-cream/50 p-4">
                                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                                    <div>
                                                        <label className="block text-caption uppercase tracking-widest text-primary/70">Travel Photos</label>
                                                        <p className="text-xs text-primary/50 mt-1">Upload photos shared by this traveler. These will be displayed in their testimonial.</p>
                                                    </div>
                                                    <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-secondary text-cream hover:bg-secondary-dark transition-colors cursor-pointer rounded">
                                                        <Upload className="w-3.5 h-3.5" />
                                                        Upload Photos
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            disabled={saving}
                                                            onChange={(e) => {
                                                                void handleUploadTestimonialImages(test.id as number, e.target.files);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                </div>

                                                {parseStringArrayField(test.photoGallery).length > 0 ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                        {parseStringArrayField(test.photoGallery).map((imageUrl, imageIdx) => (
                                                            <div key={`${test.id as number}-gallery-${imageIdx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-primary/10 bg-cream">
                                                                <ImagePreview imageUrl={imageUrl} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                                    title="Remove photo"
                                                                    onClick={() => {
                                                                        const nextImages = parseStringArrayField(test.photoGallery).filter((_, idx) => idx !== imageIdx);
                                                                        setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, photoGallery: serializeStringArrayField(nextImages) } : t));
                                                                    }}
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <span className="text-[10px] text-white/80">Photo {imageIdx + 1}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <label className="aspect-square rounded-lg border-2 border-dashed border-primary/20 hover:border-secondary/50 bg-cream flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                                                            <Plus className="w-6 h-6 text-primary/30" />
                                                            <span className="text-[10px] text-primary/40 font-medium">Add More</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                className="hidden"
                                                                disabled={saving}
                                                                onChange={(e) => {
                                                                    void handleUploadTestimonialImages(test.id as number, e.target.files);
                                                                    e.target.value = '';
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-primary/15 rounded-lg bg-cream hover:border-secondary/40 cursor-pointer transition-colors">
                                                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                                                            <Upload className="w-5 h-5 text-primary/30" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-medium text-primary/50">No travel photos yet</p>
                                                            <p className="text-xs text-primary/35 mt-1">Click to upload or drag photos here</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            disabled={saving}
                                                            onChange={(e) => {
                                                                void handleUploadTestimonialImages(test.id as number, e.target.files);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                )}

                                                {parseStringArrayField(test.photoGallery).length > 0 ? (
                                                    <p className="text-[11px] text-primary/40 mt-3">{parseStringArrayField(test.photoGallery).length} photo{parseStringArrayField(test.photoGallery).length !== 1 ? 's' : ''} uploaded</p>
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Comment</label>
                                            <textarea
                                                value={test.comment as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, comment: e.target.value } : t))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => handleSaveTestimonial(test)}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTestimonial(test.id as number)}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium text-primary">Bookings</h2>
                                <div className="flex gap-2">
                                    <select
                                        className="px-4 py-2 border border-primary/20 bg-cream text-sm"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === 'all') {
                                                refreshCurrentTab();
                                            }
                                        }}
                                    >
                                        <option value="all">All Payments</option>
                                        <option value="FULL">Full Payment</option>
                                        <option value="EMI">EMI Payment</option>
                                        <option value="HALF_PAYMENT">Half Payment</option>
                                    </select>
                                </div>
                            </div>

                            {/* Event Bookings */}
                            {eventBookings.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium text-primary mb-3">Event Bookings</h3>
                                    <div className="space-y-4 mb-8">
                                        {eventBookings.map((booking: any) => (
                                            <div
                                                key={`evt-${booking.id}`}
                                                className="p-6 border border-primary/10 bg-cream-light"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-primary mb-1">
                                                            {booking.bookingReference}
                                                            <span className="ml-2 text-xs bg-secondary text-cream px-2 py-1 rounded">Event</span>
                                                        </h3>
                                                        <p className="text-sm text-text-secondary">
                                                            {booking.customerName} • {booking.customerEmail}
                                                        </p>
                                                    </div>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm ${booking.paymentStatus === 'PAID' ? 'bg-success/20 text-success' :
                                                        booking.paymentStatus === 'FAILED' ? 'bg-error/20 text-error' :
                                                            'bg-warning/20 text-warning'
                                                    }`}>
                                                        {booking.paymentStatus === 'PAID' && <CheckCircle size={16} />}
                                                        {booking.paymentStatus === 'FAILED' && <XCircle size={16} />}
                                                        {booking.paymentStatus === 'PENDING' && <Clock size={16} />}
                                                        {booking.paymentStatus}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Event</p>
                                                        <p className="text-body-lg">{booking.event?.title || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Event Date</p>
                                                        <p className="text-body-lg">{booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Tickets</p>
                                                        <p className="text-body-lg">{booking.numberOfTickets ?? '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Amount</p>
                                                        <p className="text-body-lg font-medium">{formatPrice(booking.finalAmount || booking.totalAmount)}</p>
                                                    </div>
                                                </div>
                                                {booking.paymentMethod && (
                                                    <p className="text-caption text-text-secondary mt-2">Payment: {String(booking.paymentMethod).toUpperCase()}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trip Bookings */}
                            <h3 className="text-lg font-medium text-primary mb-3">Trip Bookings</h3>
                            <div className="space-y-4">
                                {bookings.map((booking: any) => (
                                    <div
                                        key={booking.id}
                                        className={`p-6 border border-primary/10 bg-cream-light ${!booking.adminReviewed ? 'border-l-4 border-l-secondary' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-primary mb-1">
                                                    {booking.bookingReference}
                                                    {!booking.adminReviewed && (
                                                        <span className="ml-2 text-xs bg-secondary text-cream px-2 py-1 rounded">New</span>
                                                    )}
                                                    {/* Payment Type Badge */}
                                                    {booking.paymentType === 'EMI' && (
                                                        <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded">EMI</span>
                                                    )}
                                                    {booking.paymentType === 'HALF_PAYMENT' && (
                                                        <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-1 rounded">50% Paid</span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-text-secondary">
                                                    {booking.customerName} • {booking.customerEmail}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm ${booking.paymentStatus === 'PAID' ? 'bg-success/20 text-success' :
                                                    booking.paymentStatus === 'HALF_PAID' ? 'bg-amber-100 text-amber-700' :
                                                        booking.paymentStatus === 'FAILED' ? 'bg-error/20 text-error' :
                                                            'bg-warning/20 text-warning'
                                                    }`}>
                                                    {booking.paymentStatus === 'PAID' && <CheckCircle size={16} />}
                                                    {booking.paymentStatus === 'HALF_PAID' && <Clock size={16} />}
                                                    {booking.paymentStatus === 'FAILED' && <XCircle size={16} />}
                                                    {booking.paymentStatus === 'PENDING' && <Clock size={16} />}
                                                    {booking.paymentStatus}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-caption text-text-secondary">Trip</p>
                                                <p className="text-body-lg">{booking.trip?.title || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-caption text-text-secondary">Travel Date</p>
                                                <p className="text-body-lg">{new Date(booking.travelDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-caption text-text-secondary">Guests</p>
                                                <p className="text-body-lg">{booking.numberOfGuests}</p>
                                            </div>
                                            <div>
                                                <p className="text-caption text-text-secondary">Total Amount</p>
                                                <p className="text-body-lg font-medium">{formatPrice(booking.finalAmount || booking.totalAmount)}</p>
                                            </div>
                                        </div>

                                        {/* Half Payment Info */}
                                        {booking.paymentType === 'HALF_PAYMENT' && (
                                            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-caption text-amber-700">Amount Paid</p>
                                                        <p className="text-body-lg font-medium text-green-600">{formatPrice(booking.amountPaid)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-amber-700">Remaining Amount</p>
                                                        <p className="text-body-lg font-medium text-red-600">{formatPrice(booking.remainingAmount)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-amber-700">Due By</p>
                                                        <p className="text-body-lg font-medium">
                                                            {booking.remainingPaymentDue
                                                                ? new Date(booking.remainingPaymentDue).toLocaleString()
                                                                : '2 hrs before travel'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {booking.remainingPaymentStatus === 'OVERDUE' && (
                                                    <p className="mt-2 text-sm font-bold text-red-600">⚠️ OVERDUE - Follow up required!</p>
                                                )}
                                            </div>
                                        )}

                                        {/* EMI Info */}
                                        {booking.emiEnabled && (
                                            <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-caption text-purple-700">EMI Tenure</p>
                                                        <p className="text-body-lg font-medium">{booking.emiTenure} months</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-purple-700">Monthly EMI</p>
                                                        <p className="text-body-lg font-medium">{formatPrice(booking.emiMonthlyAmount)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-purple-700">EMI Total</p>
                                                        <p className="text-body-lg font-medium">{formatPrice(booking.emiTotalAmount)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {booking.discountAmount > 0 && (
                                            <div className="mb-4 p-3 bg-success/10 rounded">
                                                <p className="text-sm text-success">
                                                    Discount: {booking.discountPercentage}% ({formatPrice(booking.discountAmount)})
                                                </p>
                                            </div>
                                        )}

                                        {booking.paymentMethod && (
                                            <div className="mb-4">
                                                <p className="text-caption text-text-secondary">Payment Method</p>
                                                <p className="text-body-lg">{booking.paymentMethod.toUpperCase()}</p>
                                            </div>
                                        )}

                                        {booking.specialRequests && (
                                            <div className="mb-4">
                                                <p className="text-caption text-text-secondary">Special Requests</p>
                                                <p className="text-body-sm">{booking.specialRequests}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-2 mt-4">
                                            {!booking.adminReviewed && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.admin.markBookingAsReviewed(booking.bookingReference);
                                                            setBookings(bookings.map((b: any) =>
                                                                b.id === booking.id ? { ...b, adminReviewed: true } : b
                                                            ));
                                                            setMessage({ type: 'success', text: 'Booking marked as reviewed!' });
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to update booking' });
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Mark as Reviewed</span>
                                                </button>
                                            )}
                                            {booking.adminReviewed && (
                                                <span className="flex items-center gap-2 px-4 py-2 bg-cream border border-primary/20 text-text-secondary">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Reviewed</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {bookings.length === 0 && eventBookings.length === 0 && (
                                    <div className="text-center py-12 text-text-secondary">
                                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p>No bookings yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Inquiries Tab */}
                    {activeTab === 'inquiries' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Contact Inquiries</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage inquiries from the contact form</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-accent/20 text-primary text-sm rounded">
                                        {inquiries.filter((i: any) => !i.isRead).length} unread
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {inquiries.map((inquiry: any) => (
                                    <div key={inquiry.id} className={`p-6 border ${inquiry.isRead ? 'bg-cream border-primary/10' : 'bg-accent/5 border-accent/30'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inquiry.isRead ? 'bg-primary/10' : 'bg-accent/20'}`}>
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-primary">{inquiry.name}</h3>
                                                    <p className="text-sm text-primary/60">{inquiry.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={inquiry.status || 'NEW'}
                                                    onChange={async (e) => {
                                                        try {
                                                            await api.admin.updateInquiryStatus(inquiry.id, e.target.value);
                                                            setInquiries(inquiries.map((i: any) =>
                                                                i.id === inquiry.id ? { ...i, status: e.target.value } : i
                                                            ));
                                                            setMessage({ type: 'success', text: 'Status updated!' });
                                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to update status' });
                                                        }
                                                    }}
                                                    className={`px-3 py-1 text-sm border rounded cursor-pointer ${inquiry.status === 'NEW' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                        inquiry.status === 'CONTACTED' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                            inquiry.status === 'CONVERTED' ? 'bg-green-50 border-green-200 text-green-700' :
                                                                'bg-gray-50 border-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    <option value="NEW">New</option>
                                                    <option value="CONTACTED">Contacted</option>
                                                    <option value="CONVERTED">Converted</option>
                                                    <option value="CLOSED">Closed</option>
                                                </select>
                                                <span className="text-xs text-primary/40">
                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                            {inquiry.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-primary/40" />
                                                    <span>{inquiry.phone}</span>
                                                </div>
                                            )}
                                            {inquiry.destination && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary/40" />
                                                    <span>{inquiry.destination}</span>
                                                </div>
                                            )}
                                            {inquiry.travelers && (
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-primary/40" />
                                                    <span>{inquiry.travelers} travelers</span>
                                                </div>
                                            )}
                                            {inquiry.preferredDates && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary/40" />
                                                    <span>{inquiry.preferredDates}</span>
                                                </div>
                                            )}
                                        </div>
                                        {inquiry.message && (
                                            <div className="bg-primary/5 p-4 rounded mb-4">
                                                <p className="text-sm text-primary/80">{inquiry.message}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {!inquiry.isRead && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.admin.markInquiryAsRead(inquiry.id);
                                                            setInquiries(inquiries.map((i: any) =>
                                                                i.id === inquiry.id ? { ...i, isRead: true } : i
                                                            ));
                                                            setMessage({ type: 'success', text: 'Marked as read!' });
                                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to mark as read' });
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Mark as Read</span>
                                                </button>
                                            )}
                                            <a
                                                href={`mailto:${inquiry.email}?subject=Re: Your Travel Inquiry - YlooTrips&body=Hi ${inquiry.name},%0D%0A%0D%0AThank you for your interest in traveling with YlooTrips.%0D%0A%0D%0A`}
                                                className="flex items-center gap-2 px-4 py-2 bg-primary text-cream hover:bg-primary-light transition-colors"
                                            >
                                                <Mail className="w-4 h-4" />
                                                <span>Reply</span>
                                            </a>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm('Are you sure you want to delete this inquiry?')) return;
                                                    try {
                                                        await api.admin.deleteInquiry(inquiry.id);
                                                        setInquiries(inquiries.filter((i: any) => i.id !== inquiry.id));
                                                        setMessage({ type: 'success', text: 'Inquiry deleted!' });
                                                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                    } catch {
                                                        setMessage({ type: 'error', text: 'Failed to delete inquiry' });
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {inquiries.length === 0 && (
                                    <div className="text-center py-12 text-text-secondary">
                                        <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p>No inquiries yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Ads Tab */}
                    {activeTab === 'ads' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Ads Management</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage homepage carousel ads</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        setSaving(true);
                                        try {
                                            const newAd = {
                                                title: 'New Ad',
                                                description: 'Ad description',
                                                imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
                                                redirectUrl: '/trips',
                                                discountText: '10% OFF',
                                                isActive: true,
                                                displayOrder: ads.length + 1,
                                            };
                                            await api.admin.createAd(newAd);
                                            setMessage({ type: 'success', text: 'Ad created!' });
                                            refreshCurrentTab();
                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                        } catch {
                                            setMessage({ type: 'error', text: 'Failed to create ad' });
                                        }
                                        setSaving(false);
                                    }}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Ad</span>
                                </button>
                            </div>
                            {ads.map((ad) => (
                                <div key={ad.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Ad Image"
                                                value={ad.imageUrl as string || ''}
                                                onChange={url => setAds(ads.map(a => a.id === ad.id ? { ...a, imageUrl: url } : a))}
                                                folder="ads"
                                                previewHeight="h-40"
                                            />
                                            {typeof ad.discountText === 'string' && ad.discountText && (
                                                <div className="mt-2 inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    🔥 {ad.discountText}
                                                </div>
                                            )}
                                        </div>

                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        value={ad.title as string || ''}
                                                        onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, title: e.target.value } : a))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Discount Text</label>
                                                    <input
                                                        type="text"
                                                        value={ad.discountText as string || ''}
                                                        onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, discountText: e.target.value } : a))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., 25% OFF, FLAT ₹5000 OFF"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                                <textarea
                                                    value={ad.description as string || ''}
                                                    onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, description: e.target.value } : a))}
                                                    rows={2}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Redirect URL</label>
                                                    <input
                                                        type="text"
                                                        value={ad.redirectUrl as string || ''}
                                                        onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, redirectUrl: e.target.value } : a))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="/trips?category=Trekking"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Display Order</label>
                                                    <input
                                                        type="number"
                                                        value={ad.displayOrder as number || 0}
                                                        onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, displayOrder: Number(e.target.value) } : a))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-6 pt-6">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={ad.isActive as boolean || false}
                                                            onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, isActive: e.target.checked } : a))}
                                                            className="w-5 h-5"
                                                        />
                                                        <span className="text-sm text-primary/70 font-medium">Active</span>
                                                        {ad.isActive ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-2">
                                                <button
                                                    onClick={async () => {
                                                        setSaving(true);
                                                        try {
                                                            await api.admin.updateAd(ad.id as number, ad);
                                                            setMessage({ type: 'success', text: 'Ad updated!' });
                                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to update ad' });
                                                        }
                                                        setSaving(false);
                                                    }}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm('Are you sure you want to delete this ad?')) return;
                                                        setSaving(true);
                                                        try {
                                                            await api.admin.deleteAd(ad.id as number);
                                                            setAds(ads.filter(a => a.id !== ad.id));
                                                            setMessage({ type: 'success', text: 'Ad deleted!' });
                                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to delete ad' });
                                                        }
                                                        setSaving(false);
                                                    }}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {ads.length === 0 && (
                                <div className="text-center py-12 text-primary/50">
                                    <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p>No ads yet. Create your first ad!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
