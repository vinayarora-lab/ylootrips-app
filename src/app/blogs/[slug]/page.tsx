'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, User, Calendar, Share2 } from 'lucide-react';
import { api } from '@/lib/api';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/components/JsonLd';

interface Blog {
    id: number;
    title: string;
    content: string;
    shortDescription: string;
    imageUrl: string;
    slug: string;
    authorName: string;
    publishedDate: string;
    category: string;
    readTime: string;
    isFeatured: boolean;
}

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await api.getBlogBySlug(slug);
                setBlog(response.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.status === 404 ? 'Blog post not found' : 'Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchBlog();
        }
    }, [slug]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading article...</p>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-light mb-4">404</h1>
                    <p className="text-text-secondary mb-8">{error || 'Blog post not found'}</p>
                    <Link href="/blogs" className="btn-primary">
                        Back to Journal
                    </Link>
                </div>
            </div>
        );
    }

    const url = `https://www.ylootrips.com/blogs/${blog.slug}`;

    return (
        <div className="min-h-screen">
            {/* Structured Data */}
            <BreadcrumbJsonLd items={[
                { name: 'Home', url: 'https://www.ylootrips.com' },
                { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
                { name: blog.title, url },
            ]} />
            <ArticleJsonLd
                headline={blog.title}
                description={blog.shortDescription || blog.title}
                url={url}
                image={blog.imageUrl || 'https://www.ylootrips.com/og-image.jpg'}
                datePublished={blog.publishedDate}
                authorName={blog.authorName || 'YlooTrips Editorial Team'}
                keywords={[blog.category, 'India travel', 'YlooTrips']}
            />

            {/* Hero Image */}
            <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
                <Image
                    src={blog.imageUrl || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&q=80'}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                
                <div className="relative z-10 h-full flex items-end">
                    <div className="section-container w-full pb-16">
                        <div className="max-w-4xl">
                            <Link 
                                href="/blogs" 
                                className="inline-flex items-center gap-2 text-cream/80 hover:text-cream mb-6 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span className="text-caption uppercase tracking-widest">Back to Journal</span>
                            </Link>
                            
                            <div className="mb-4">
                                <span className="px-4 py-2 bg-cream/20 backdrop-blur-sm text-caption uppercase tracking-widest text-cream">
                                    {blog.category}
                                </span>
                            </div>
                            
                            <h1 className="text-display-xl text-white mb-6">{blog.title}</h1>
                            
                            {blog.shortDescription && (
                                <p className="text-body-lg text-white/90 mb-8 max-w-2xl">
                                    {blog.shortDescription}
                                </p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-6 text-white/80">
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    <span>{blog.authorName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} />
                                    <span>{formatDate(blog.publishedDate)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={18} />
                                    <span>{blog.readTime || '5 min'} read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <article className="section-container py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-lg max-w-none">
                        <div 
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
                        />
                    </div>

                    {/* Share Section */}
                    <div className="mt-16 pt-8 border-t border-primary/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-caption uppercase tracking-widest text-text-secondary mb-2">
                                    Share this article
                                </p>
                                <div className="flex items-center gap-4">
                                    <button className="p-3 border border-primary/20 hover:border-primary transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                            <Link href="/blogs" className="btn-ghost">
                                <ArrowLeft size={18} className="mr-2" />
                                Back to Journal
                            </Link>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Articles Section */}
            <section className="py-16 bg-cream-dark">
                <div className="section-container">
                    <h2 className="text-display-lg mb-12">More Stories</h2>
                    <div className="text-center">
                        <Link href="/blogs" className="btn-outline">
                            View All Articles
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}













