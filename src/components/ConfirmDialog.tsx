import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  emoji?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  emoji = '🤔',
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBtn: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
          borderColor: 'border-red-200'
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          confirmBtn: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
          borderColor: 'border-yellow-200'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBtn: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          confirmBtn: 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500',
          borderColor: 'border-gray-200'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className={`
        bg-white rounded-3xl p-6 w-full max-w-sm mx-auto
        transform transition-all duration-300 ease-out scale-100
        shadow-2xl border ${styles.borderColor}
        animate-modal-appear
      `}>
        {/* 아이콘과 이모티콘 */}
        <div className="text-center mb-6">
          <div className={`
            w-16 h-16 mx-auto rounded-full flex items-center justify-center
            ${styles.iconBg} mb-4
          `}>
            <span className="text-2xl">{emoji}</span>
          </div>
          
          {/* 제목 */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          
          {/* 메시지 */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* 버튼들 */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="
              flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl
              hover:bg-gray-200 transition-all duration-200
              font-semibold text-sm
              focus:outline-none focus:ring-2 focus:ring-gray-300
            "
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`
              flex-1 py-3 px-4 text-white rounded-2xl
              transition-all duration-200 font-semibold text-sm
              focus:outline-none focus:ring-2 focus:ring-offset-2
              transform hover:scale-105
              ${styles.confirmBtn}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}; 