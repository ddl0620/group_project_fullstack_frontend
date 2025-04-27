import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const ImageSlider = ({ imageList, classname }) => {
  return (
    <Carousel>
      <CarouselContent>
        {imageList.map((_, index) => (
          <CarouselItem key={index}>
            <div className="mx-auto max-w-7xl">
              <Card>
                <CardContent
                  className={`flex items-center justify-center ${classname}`}
                >
                  <img
                    className="rounded-xl bg-cover"
                    src={imageList[index]}
                    alt="Error"
                  />
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
