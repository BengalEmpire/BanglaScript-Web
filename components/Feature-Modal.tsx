"use client"

import { motion, AnimatePresence } from "framer-motion";
import CurvedLoop from "./CurvedLoop";
import { X } from "lucide-react";

// Modal Component
export default function Modal({ isOpen, onClose, image }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 p-2 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    className="relative bg-white rounded-2xl shadow-xl p-1 max-w-md sm:max-w-md md:max-w-xl lg:max-w-4xl w-full"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    onClick={onClose}
                >
                    <button
                        onClick={onClose}
                        className="fixed top-3 right-3 p-1 rounded-full hover:bg-gray-100 cursor-pointer hover:text-black dark:hover:text-white"
                    >
                        <X className="w-9 h-9" />
                    </button>

                    <img src={image} alt="bjs init --web [project Name]" className="w-full h-full object-cover rounded-xl" />
                </motion.div>
                <CurvedLoop marqueeText="BanglaScript ✦ 3.5.0 ✦ With ✦ New ✦ Feature ✦" />
            </motion.div>
        </AnimatePresence>
    );
}