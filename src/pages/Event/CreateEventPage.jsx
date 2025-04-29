import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useEvent } from '@/hooks/useEvent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { addDays } from 'date-fns';
import {
  CalendarIcon,
  Clock,
  MapPin,
  Info,
  ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import {
  ImageUploader,
  useImageUploader,
} from '@/components/ImageUploader.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
import { AlertDialogUtils } from '@/helpers/AlertDialogUtils.jsx';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { createEvent, getEventById, updateEvent } = useEvent();
  const { eventId } = useParams(); // Get eventId from URL for update mode

  // Determine mode (create or update)
  const isUpdateMode = !!eventId;

  // Image uploader hook
  const {
    fileInputRef,
    uploadedImages,
    setUploadedImages,
    handleFileChange,
    handleRemoveImage,
  } = useImageUploader();

  // Form stages
  const [currentStage, setCurrentStage] = useState(1);
  const totalStages = 4;

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    dateRange: {
      from: new Date(),
      to: addDays(new Date(), 1),
    },
    isPublic: true,
  });
  const [loading, setLoading] = useState(isUpdateMode);
  const [error, setError] = useState(null);

  // Fetch event data if in update mode
  useEffect(() => {
    if (isUpdateMode) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await getEventById(eventId);
          if (response.success) {
            const event = response.content.event;
            setFormData({
              title: event.title || '',
              description: event.description || '',
              category: event.type || '',
              location: event.location || '',
              dateRange: {
                from: new Date(event.startDate),
                to: new Date(event.endDate),
              },
              isPublic: event.isPublic !== undefined ? event.isPublic : true,
            });
            // Populate existing images if any
            if (event.images && event.images.length > 0) {
              setUploadedImages(
                event.images.map((url) => ({ url, type: 'url' }))
              );
            }
          } else {
            toast.error('Failed to load event data.');
            setError('Failed to load event data.');
          }
        } catch (error) {
          toast.error('Error loading event: ' + error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [eventId, isUpdateMode]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle checkbox changes with mutual exclusivity
  const handleCheckboxChange = (field, checked) => {
    if (field === 'isPublic' && checked === false) {
      setFormData((prev) => ({
        ...prev,
        isPublic: false,
      }));
    } else if (field === 'isPublic' && checked === true) {
      setFormData((prev) => ({
        ...prev,
        isPublic: true,
        requiresApproval: false,
      }));
    } else if (field === 'requiresApproval' && checked === true) {
      setFormData((prev) => ({
        ...prev,
        isPublic: false,
        requiresApproval: true,
      }));
    } else if (field === 'requiresApproval' && checked === false) {
      setFormData((prev) => ({
        ...prev,
        requiresApproval: false,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title) {
        toast.error('Tên sự kiện là bắt buộc');
        return;
      }
      if (!formData.description) {
        toast.error('Mô tả sự kiện là bắt buộc');
        return;
      }
      if (!formData.category) {
        toast.error('Danh mục sự kiện là bắt buộc');
        return;
      }
      if (!formData.location) {
        toast.error('Địa điểm sự kiện là bắt buộc');
        return;
      }
      if (!formData.dateRange?.from || !formData.dateRange?.to) {
        toast.error('Vui lòng chọn khoảng thời gian hợp lệ');
        return;
      }
      if (
        !(formData.dateRange.from instanceof Date) ||
        !(formData.dateRange.to instanceof Date)
      ) {
        toast.error('Ngày bắt đầu hoặc kết thúc không hợp lệ');
        return;
      }

      // Create FormData
      const postData = new FormData();

      // Append fields
      postData.append('title', String(formData.title));
      postData.append('description', String(formData.description));
      postData.append('startDate', formData.dateRange.from.toISOString());
      postData.append('endDate', formData.dateRange.to.toISOString());
      postData.append('isPublic', String(formData.isPublic));
      postData.append('location', String(formData.location));
      postData.append('type', String(formData.category));

      // Append existing image URLs as a JSON string
      const imageUrls = uploadedImages
        .filter((image) => image.type === 'url')
        .map((image) => image.url);
      if (imageUrls.length > 0) {
        postData.append('existingImages', JSON.stringify(imageUrls));
      }

      // Append new file uploads
      uploadedImages.forEach((image) => {
        if (image.type === 'file' && image.file && image.file instanceof File) {
          postData.append('images', image.file);
        }
      });

      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of postData.entries()) {
        console.log(`${key}: ${value instanceof File ? value.name : value}`);
      }

      let response;
      if (isUpdateMode) {
        // Update mode: Confirm before updating
        const confirmed = await AlertDialogUtils.info({
          title: 'Update Event?',
          description:
            'Are you sure you want to update this event? This action cannot be undone.',
          confirmText: 'Update',
          cancelText: 'Cancel',
        });
        if (!confirmed) return;

        response = await updateEvent(eventId, postData);
      } else {
        // Create mode
        response = await createEvent(postData);
      }

      console.log('Backend Response:', response);

      if (response.success) {
        toast.success(
          isUpdateMode
            ? 'Event updated successfully!'
            : 'Sự kiện được tạo thành công!'
        );
        // Reset form state after successful submission
        setFormData({
          title: '',
          description: '',
          category: '',
          location: '',
          dateRange: {
            from: new Date(),
            to: addDays(new Date(), 1),
          },
          isPublic: true,
        });
        setUploadedImages([]);
        setCurrentStage(1);
        navigate('/event');
      } else {
        toast.error(
          'Không thể ' +
          (isUpdateMode ? 'cập nhật' : 'tạo') +
          ' sự kiện: ' +
          (response.message || 'Lỗi không xác định')
        );
      }
    } catch (error) {
      console.error(
        'Lỗi khi ' + (isUpdateMode ? 'cập nhật' : 'tạo') + ' sự kiện:',
        error
      );
      toast.error(
        'Đã xảy ra lỗi khi ' +
        (isUpdateMode ? 'cập nhật' : 'tạo') +
        ' sự kiện: ' +
        (error.message || 'Lỗi không xác định')
      );
    }
  };

  // Navigation between stages
  const nextStage = () => {
    if (currentStage < totalStages) {
      setCurrentStage(currentStage + 1);
    }
  };

  const prevStage = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  // Render progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {Array.from({ length: totalStages }, (_, i) => i + 1).map((stage) => (
            <div
              key={stage}
              className={`flex flex-col items-center ${
                stage <= currentStage ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  stage < currentStage
                    ? 'border-primary bg-primary text-white'
                    : stage === currentStage
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground'
                }`}
              >
                {stage < currentStage ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span>{stage}</span>
                )}
              </div>
              <span className="mt-2 text-xs font-medium">
                {stage === 1 && 'Thông tin cơ bản'}
                {stage === 2 && 'Ngày & Giờ'}
                {stage === 3 && 'Địa điểm'}
                {stage === 4 && 'Hình ảnh'}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="bg-muted absolute top-0 h-1 w-full"></div>
          <div
            className="bg-primary absolute top-0 h-1 transition-all duration-300"
            style={{
              width: `${((currentStage - 1) / (totalStages - 1)) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    );
  };

  // Render form stages
  const renderFormStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Tên sự kiện</Label>
              <Input
                id="title"
                placeholder="Nhập tên sự kiện"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Mô tả sự kiện của bạn"
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOCIAL">Xã hội</SelectItem>
                  <SelectItem value="EDUCATION">Giáo dục</SelectItem>
                  <SelectItem value="BUSINESS">Kinh doanh</SelectItem>
                  <SelectItem value="ENTERTAINMENT">Giải trí</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('isPublic', checked)
                  }
                />
                <Label htmlFor="isPublic">Sự kiện công khai</Label>
              </div>

              <p className="text-muted-foreground text-xs">
                Lưu ý: Sự kiện công khai sẽ hiển thị với mọi người.
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <CalendarIcon className="text-muted-foreground mr-2 h-4 w-4" />
                <Label>Khoảng thời gian sự kiện</Label>
              </div>
              <DateRangePicker
                date={formData.dateRange}
                onDateChange={(range) => handleChange('dateRange', range)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
                <Label htmlFor="location">Tên địa điểm</Label>
              </div>
              <Input
                id="location"
                placeholder="Ví dụ: Công viên Trung tâm, Trung tâm Hội nghị"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div className="rounded-md border border-dashed p-6">
              <div className="flex flex-col items-center justify-center text-center">
                <MapPin className="text-muted-foreground h-10 w-10" />
                <p className="text-muted-foreground mt-2 text-sm">
                  Tích hợp bản đồ sẽ được thêm trong tương lai
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center">
              <ImageIcon className="text-muted-foreground mr-2 h-4 w-4" />
              <Label>Hình ảnh sự kiện</Label>
            </div>
            <ImageUploader
              fileInputRef={fileInputRef}
              uploadedImages={uploadedImages}
              existingImageUrls={[]}
              handleFileChange={handleFileChange}
              handleRemoveImage={handleRemoveImage}
            />

            <div className="bg-muted rounded-md p-4">
              <div className="flex items-start">
                <Info className="text-muted-foreground mr-2 h-5 w-5" />
                <div className="text-muted-foreground text-sm">
                  <p>Thêm hình ảnh để sự kiện nổi bật hơn.</p>
                  <p>Kích thước đề xuất: 1200 x 630 pixel.</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render form summary for final review
  const renderSummary = () => {
    if (currentStage !== totalStages) return null;

    return (
      <Card className="mt-6 border-dashed">
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-medium">Tóm tắt sự kiện</h3>

          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Tên sự kiện
              </p>
              <p>{formData.title || 'Chưa cung cấp'}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm font-medium">Mô tả</p>
              <p className="line-clamp-2">
                {formData.description || 'Chưa cung cấp'}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Danh mục
              </p>
              <p>{formData.category || 'Chưa cung cấp'}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Khoảng thời gian
              </p>
              <p>
                {formData.dateRange.from.toLocaleDateString()} -{' '}
                {formData.dateRange.to.toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Địa điểm
              </p>
              <p>{formData.location || 'Chưa cung cấp'}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Cài đặt
              </p>
              <p>
                {formData.isPublic ? 'Sự kiện công khai' : 'Sự kiện riêng tư'}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Hình ảnh
              </p>
              <p>{uploadedImages.length} ảnh được chọn</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">
            {isUpdateMode ? 'Update Event' : 'Create New Event'}
          </h1>
          <p className="text-muted-foreground">
            {isUpdateMode
              ? 'Update the details of your event'
              : 'Điền thông tin để tạo sự kiện của bạn'}
          </p>
        </div>

        {renderProgressIndicator()}

        <Card>
          <CardContent className="pt-6">
            {renderFormStage()}
            {renderSummary()}

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={
                  currentStage === 1 ? () => navigate('/event') : prevStage
                }
              >
                {currentStage === 1 ? 'Hủy' : 'Quay lại'}
              </Button>

              <Button
                onClick={
                  currentStage === totalStages ? handleSubmit : nextStage
                }
              >
                {currentStage === totalStages
                  ? isUpdateMode
                    ? 'Update Event'
                    : 'Create Event'
                  : 'Tiếp theo'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}