'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
    id: number;
    userName: string;
    userTitle?: string;
    userImage?: string;
    userAvatar?: string;
    comment: string;
    isFeatured?: boolean;
    displayOrder?: number;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const featuredTestimonials = testimonials.filter(t => t.isFeatured).slice(0, 6);

    useEffect(() => {
        if (featuredTestimonials.length === 0) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredTestimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [featuredTestimonials.length]);

    if (featuredTestimonials.length === 0) {
        return null;
    }

    return (
        <section className="section-padding bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
                        Our Happy Customers
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto font-light">
                        We go the extra mile to deliver unforgettable travel experiences, shaped by our guests' stories, needs, and dreams. Here's what they have to say.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {featuredTestimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className="p-8 border border-border bg-surface/50 transition-all duration-300 hover:border-foreground/20 hover:shadow-lg"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="mb-6">
                                <svg width="40" height="32" viewBox="0 0 40 32" fill="none" className="text-foreground/20">
                                    <path d="M0 32V19.2C0 13.6 1.6 8.8 4.8 4.8C8 0.8 12.8 0 19.2 0V6.4C14.4 6.4 11.2 7.2 9.6 8.8C8 10.4 7.2 12.8 7.2 16H16V32H0ZM24 32V19.2C24 13.6 25.6 8.8 28.8 4.8C32 0.8 36.8 0 43.2 0V6.4C38.4 6.4 35.2 7.2 33.6 8.8C32 10.4 31.2 12.8 31.2 16H40V32H24Z" fill="currentColor"/>
                                </svg>
                            </div>
                            
                            <p className="text-foreground text-lg font-light leading-relaxed mb-6">
                                {testimonial.comment}
                            </p>
                            
                            <div className="flex items-center gap-3">
                                {(testimonial.userImage || testimonial.userAvatar) ? (
                                    <img
                                        src={(testimonial.userImage || testimonial.userAvatar) as string}
                                        alt={testimonial.userName}
                                        className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-primary text-cream flex items-center justify-center text-lg font-semibold shrink-0">
                                        {testimonial.userName?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <div>
                                    <div className="font-medium text-foreground mb-1">
                                        {testimonial.userName}
                                    </div>
                                    {testimonial.userTitle && (
                                        <div className="text-sm text-text-secondary font-light">
                                            {testimonial.userTitle}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* See More Link */}
                <div className="text-center">
                    <button className="text-foreground font-light tracking-widest uppercase text-sm hover:text-accent transition-colors">
                        See More
                    </button>
                </div>
            </div>
        </section>
    );
}
