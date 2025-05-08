import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.js";

const ImageCarousel = ({ images }) => {
    return (
        <Carousel className="mt-4 w-full">
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index}>
                        <div className="overflow-hidden rounded-lg">
                            <img
                                src={image || '/placeholder.svg'}
                                alt={`Post image ${index + 1}`}
                                className="aspect-video w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
        </Carousel>
    );
}

export default ImageCarousel;