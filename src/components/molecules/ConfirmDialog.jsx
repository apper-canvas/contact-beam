import React from "react";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  loading = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton={false}
      size="sm"
    >
      <div className="text-center space-y-4">
        <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
          type === "danger" ? "bg-red-100" : "bg-yellow-100"
        }`}>
          <ApperIcon 
            name={type === "danger" ? "AlertTriangle" : "HelpCircle"} 
            size={24} 
            className={type === "danger" ? "text-red-600" : "text-yellow-600"} 
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex justify-center space-x-3 pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={type}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;