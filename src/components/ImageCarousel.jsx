import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel.js';
import { DEFAULT_IMAGE } from '@/components/shared/DefaultImage.js';
import { Dialog, DialogContent } from '@/components/ui/dialog.js';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ImageCarousel = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const validImages = images && images.length > 0 ? images : [DEFAULT_IMAGE];

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  const goToNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % validImages.length);
  };

  const goToPrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length
    );
  };

  return (
    <>
      <Carousel className="mt-4 w-full">
        <CarouselContent>
          {validImages.map((image, index) => (
            <CarouselItem key={index}>
              <TooltipProvider delayDuration={1000}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="cursor-pointer overflow-hidden rounded-lg"
                      onClick={() => openImageModal(index)}
                    >
                      <img
                        src={image || DEFAULT_IMAGE}
                        alt={`Post image ${index + 1}`}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Click to view full image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] border-none bg-transparent p-0 shadow-none sm:max-w-[90vw] md:max-w-[80vw]">
          <div className="relative flex h-full w-full items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50 h-8 w-8 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
              onClick={closeImageModal}
            >
              <X className="h-full w-full" />
              <span className="sr-only">Close</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 z-40 h-8 w-8 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 sm:h-10 sm:w-10"
              onClick={goToPrevImage}
            >
              <ChevronLeft className="h-full w-full" />
              <span className="sr-only">Previous image</span>
            </Button>

            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-black/80">
              <img
                src={validImages[currentImageIndex] || DEFAULT_IMAGE}
                alt={`Full size image ${currentImageIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 z-40 h-8 w-8 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 sm:h-10 sm:w-10"
              onClick={goToNextImage}
            >
              <ChevronRight className="h-full w-full" />
              <span className="sr-only">Next image</span>
            </Button>

            <div className="absolute right-0 bottom-2 left-0 flex justify-center">
              <div className="rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                {currentImageIndex + 1} / {validImages.length}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageCarousel;
