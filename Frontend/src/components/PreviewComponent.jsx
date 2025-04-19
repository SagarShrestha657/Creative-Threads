import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

const ImagePreviewSlider = ({ previews = [], title = '', description = '' }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Swipe handlers
    const handlers = useSwipeable({
        onSwipedLeft: () => setCurrentIndex((prev) => Math.min(prev + 1, previews.length - 1)),
        onSwipedRight: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
        preventScrollOnSwipe: true,
        trackMouse: true
    });

    // Determine the visible dots (window of 3)
    const dotStart = Math.min(Math.max(currentIndex - 1, 0), Math.max(previews.length - 3, 0));
    const visibleDots = previews.slice(dotStart, dotStart + 3);

    return (
        <div className="bg-white rounded-lg border border-neutral-200/20">
            <div className="p-6 border-b border-neutral-200/20">
                <h2 className="text-xl font-bold">Preview</h2>
            </div>
            <div className="p-6 w-full overflow-hidden">
                {/* Image with Swipe */}
                <div
                    {...handlers}
                    className="aspect-video bg-gray-100 rounded-lg mb-4 relative overflow-hidden"
                >
                    {previews.length > 0 && (
                        <img
                            src={previews[currentIndex]}
                            alt={`preview-${currentIndex}`}
                            className="w-full h-full object-cover transition-all duration-300"
                        />
                    )}
                </div>

                {/* Dots - max 3 visible at a time */}
                <div className="flex justify-center gap-2 mb-4">
                    {visibleDots.map((_, idx) => {
                        const realIndex = dotStart + idx;
                        return (
                            <button
                                key={realIndex}
                                onClick={() => setCurrentIndex(realIndex)}
                                className={`h-2 w-2 rounded-full ${realIndex === currentIndex ? 'bg-black' : 'bg-gray-300'
                                    }`}
                            ></button>
                        );
                    })}
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold mb-2">{title || 'Your Post Title'}</h3>
                <p className="text-gray-600 break-all whitespace-pre-wrap transition-all">
                    {description || 'Your post description will appear here...'}
                </p>
            </div>
        </div>
    );
};

export default ImagePreviewSlider;
