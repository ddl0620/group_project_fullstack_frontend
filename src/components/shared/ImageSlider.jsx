import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

const ImageSlider = ({imageList, classname}) => {
    return (
        <Carousel className="w-full max-w-lg mx-auto">
            <CarouselContent>
                {imageList.map((_, index) => (
                    <CarouselItem key={index}>
                        <div className="p-1">
                            <Card>
                                <CardContent className={`flex items-center justify-center ${classname}`}>
                                    <img className="bg-cover p-4 rounded-xl" src={imageList[index]} alt="Error" />
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

export default ImageSlider;
