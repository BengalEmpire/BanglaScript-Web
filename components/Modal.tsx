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
      className={`fixed inset-0 flex items-center justify-center z-50 bg-slate-900/80 backdrop-blur-sm transition-all ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg w-[45%] h-[65vh] overflow-y-auto relative"
        initial={{ scale: 0.9 }}
        animate={{ scale: isOpen ? 1 : 0.9 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <button
          onClick={onClose}
          className="fixed top-2 right-2 text-gray-200 dark:text-gray-300 cursor-pointer"
        >
          <X size={28} />
        </button>
 <SyntaxTable /> 
       </motion.div>
    </motion.div>
  );
};

export default Modal;