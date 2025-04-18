
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import {Calendar, MapPin, Globe, Clock, Unlock, LockIcon} from "lucide-react";
import {useNavigate} from "react-router-dom";
const truncateDescription = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};

const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Hàm định dạng ngày giờ

const EventCard = ({
                       event,
                       actions = [], // Mảng các hành động, mỗi hành động có button và onClick
                   }) => {
    const {
        _id,
        title = "Untitled Event",
        description = "",
        type = "ONLINE",
        startDate,
        endDate,
        location = "N/A",
        images = [],
        isPublic = true,
    } = event || {};

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/event/${_id}`);
    };

    return (
        <Card isPressable={true}
              onPress={() => handleCardClick()}
            radius={"lg"}
            className="w-full max-w-sm rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
            {/* Hình ảnh sự kiện */}
            <CardHeader className="p-0">
                <img
                    src={images[0] || "https://skhcn.hatinh.gov.vn/img/no-image.png"}
                    alt={title}
                    className="h-48 w-full rounded-t-2xl object-cover"
                />
            </CardHeader>

            {/* Nội dung chính */}
            <CardBody  className="p-4">
                {/* Tiêu đề */}
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {title}
                </h3>

                {/* Mô tả ngắn */}
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    {truncateDescription(description, 100)}
                </p>

                {/* Thông tin chi tiết với icon */}
                <div className="mt-4 space-y-3 border border-gray-200 bg-gray-50 p-2 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        {isPublic ? (
                            <Unlock className="h-4 w-4 text-teal-500" />
                        ) : (
                            <LockIcon className="h-4 w-4 text-orange-500" />
                        )}
                        <span>{isPublic ? "Public" : "Private"}</span>
                    </div>

                    {/* Ngày bắt đầu */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>
                            <strong>Start:</strong> {formatDateTime(startDate)}
                        </span>
                    </div>

                    {/* Ngày kết thúc */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>
                            <strong>End:</strong> {formatDateTime(endDate)}
                        </span>
                    </div>

                    {/* Địa điểm */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span>{location}</span>
                    </div>

                    {/* Loại sự kiện */}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        {type === "ONLINE" ? (
                            <Globe className="h-4 w-4 text-green-500" />
                        ) : (
                            <Clock className="h-4 w-4 text-purple-500" />
                        )}
                        <span>{type === "ONLINE" ? "Online Event" : "Offline Event"}</span>
                    </div>

                </div>
            </CardBody>

            {/* Nút hành động */}
            <div className="flex justify-around mb-3">
                {actions.map((action, index) => (
                    <div
                        key={index} // Thêm prop key cho mỗi phần tử trong danh sách
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                        }}
                        className=""
                    >
                        {action.button}
                    </div>
                ))}
            </div>


        </Card>
    );
};

export default EventCard;

