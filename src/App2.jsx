import { useState } from "react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {navbarItems} from "@/components/NavbarItem.js";
// Import navbarItems từ NavbarItem.js

export default function App() {
    return (
        <main className="bg-black relative w-full min-h-screen flex items-start md:items-center justify-center px-4 py-10">
            <div className="relative gap-5 flex flex-col items-center justify-center">
                <One />
                {/*<Two />*/}
            </div>
        </main>
    );
}

const One = () => {
    // Thêm id cho các mục trong navbarItems
    const ITEMS = navbarItems.map((item, index) => ({
        ...item,
        id: index + 1, // Tạo id dựa trên chỉ số, bắt đầu từ 1
    }));

    const [active, setActive] = useState(ITEMS[0]);
    const [isHover, setIsHover] = useState(null);

    return (
        <ul className="flex items-center justify-center">
            {ITEMS.map((item) => (
                <button
                    key={item.id}
                    className="py-2 relative duration-300 transition-colors hover:!text-white"
                    onClick={() => setActive(item)}
                    onMouseEnter={() => setIsHover(item)}
                    onMouseLeave={() => setIsHover(null)}
                    style={{ color: active.id === item.id ? "#FFF" : "#888888" }}
                >
                    <div className="px-5 py-2 relative">
                        {item.title} {/* Sửa từ item.tile thành item.title */}
                        {isHover?.id === item.id && (
                            <motion.div
                                layoutId="hover-bg"
                                className="absolute bottom-0 left-0 right-0 w-full h-full bg-white/10"
                                style={{
                                    borderRadius: 6,
                                }}
                            />
                        )}
                    </div>
                    {active.id === item.id && (
                        <motion.div
                            layoutId="active"
                            className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-white"
                        />
                    )}
                    {isHover?.id === item.id && (
                        <motion.div
                            layoutId="hover"
                            className="absolute bottom-0 left-0 right-0 w-full h-0.5 bg-white"
                        />
                    )}
                </button>
            ))}
        </ul>
    );
};