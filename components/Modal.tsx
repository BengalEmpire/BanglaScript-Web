import { FC } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import SyntaxTable from './syntaxTable';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <motion.div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-25 transition-all ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg w-[35%] h-[35vh] overflow-y  p-6 relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: isOpen ? 1 : 0.9 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 cursor-pointer"
        >
          <X size={24} />
        </button>
  {/*  <SyntaxTable /> */}
       </motion.div>
    </motion.div>
  );
};

export default Modal;