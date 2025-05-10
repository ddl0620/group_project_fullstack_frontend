import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.js";
import { DEFAULT_IMAGE } from '@/components/DefaultImage.js';
const ImageCarousel = ({ images }) => {
    return (
        <Carousel className="mt-4 w-full">
            <CarouselContent>
              {
                (images && images.length > 0) ? (images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="overflow-hidden rounded-lg">
                      <img
                        src={image || DEFAULT_IMAGE}
                        alt={`Post image ${index + 1}`}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </CarouselItem>
                ))) : <CarouselItem>
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={DEFAULT_IMAGE}
                      alt={"Default Image"}
                      className="aspect-video w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              }
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
        </Carousel>
    );
}

export default ImageCarousel;