"use client";

import { useState } from "react";
import { Download, X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/shared/SectionTitle";

export default function ClientProfileGallery({ media }: { media: any }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const showNextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % media.gallery.length);
    };

    const showPrevImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex - 1 + media.gallery.length) % media.gallery.length);
    };

    if (!media || !media.gallery) return null;

    return (
        <section className="w-full bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle>Galeri & Video Profil</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {media.gallery.map((image: any, index: number) => (
                        <div key={index} className="relative group cursor-pointer" onClick={() => openLightbox(index)}>
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="rounded-xl shadow-lg object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /><line x1="11" x2="11" y1="8" y2="14" /><line x1="8" x2="14" y1="11" y2="11" /></svg>
                            </div>
                            <a
                                href={image.src}
                                download
                                onClick={(e) => e.stopPropagation()}
                                className="absolute bottom-2 right-2 bg-white/70 text-unaicNavy p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                title="Download"
                            >
                                <Download size={18} />
                            </a>
                        </div>
                    ))}
                </div>
                {media.video && (
                    <div className="mt-8 aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg relative group">
                        <video
                            src={media.video.src}
                            poster={media.video.poster}
                            autoPlay
                            loop
                            muted
                            controls
                            className="w-full h-full object-cover"
                        />
                        <a
                            href={media.video.src}
                            download="unaic-profile-video.mp4"
                            className="absolute bottom-4 right-4 bg-white/70 text-unaicNavy p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            title="Download Video"
                        >
                            <Download size={24} />
                        </a>
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={closeLightbox}>
                    <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={media.gallery[selectedImageIndex].src}
                            alt={media.gallery[selectedImageIndex].alt}
                            className="w-full h-full object-contain"
                        />
                        <button onClick={closeLightbox} className="absolute -top-12 right-0 text-white p-2" aria-label="Close lightbox">
                            <X size={32} />
                        </button>
                        <button onClick={showPrevImage} className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full" aria-label="Previous image">
                            <ChevronLeft size={32} />
                        </button>
                        <button onClick={showNextImage} className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full" aria-label="Next image">
                            <ChevronRight size={32} />
                        </button>
                        <a
                            href={media.gallery[selectedImageIndex].src}
                            download
                            className="absolute bottom-4 right-1/2 translate-x-1/2 bg-white/70 text-unaicNavy p-3 rounded-full transition-opacity duration-300"
                            title="Download"
                        >
                            <Download size={24} />
                        </a>
                    </div>
                </div>
            )}
        </section>
    );
}
