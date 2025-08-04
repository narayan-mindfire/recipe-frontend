import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <motion.div
        className="bg-[var(--background)] p-6 rounded-xl shadow-xl w-[90%] max-w-md text-[var(--text)]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <p className="mb-6 text-center text-lg font-semibold text-[var(--primary)]">
          {message}
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onConfirm}
            variant="danger"
            className="px-4 py-2 w-full"
          >
            Yes, Delete
          </Button>
          <Button
            onClick={onCancel}
            className="px-4 py-2 w-full hover:bg-[var(--accent)]"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmModal;
