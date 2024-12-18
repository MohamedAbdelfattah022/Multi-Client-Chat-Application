import React from 'react';

interface ModalFooterProps {
  isValid: boolean;
  onCancel: () => void;
  submitText: string;
}

export default function ModalFooter({ isValid, onCancel, submitText }: ModalFooterProps) {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={!isValid}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitText}
      </button>
    </div>
  );
}