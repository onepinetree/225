import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'energy';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const getToastStyles = (type: ToastMessage['type']) => {
  switch (type) {
    case 'success':
      return {
        icon: '🎉',
        bgClass: 'bg-green-50 border-green-200',
        textClass: 'text-green-800',
        iconBgClass: 'bg-green-100',
        iconTextClass: 'text-green-600'
      };
    case 'error':
      return {
        icon: '😅',
        bgClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-800',
        iconBgClass: 'bg-red-100',
        iconTextClass: 'text-red-600'
      };
    case 'info':
      return {
        icon: '💡',
        bgClass: 'bg-blue-50 border-blue-200',
        textClass: 'text-blue-800',
        iconBgClass: 'bg-blue-100',
        iconTextClass: 'text-blue-600'
      };
    case 'energy':
      return {
        icon: '⚡',
        bgClass: 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200',
        textClass: 'text-orange-800',
        iconBgClass: 'bg-gradient-to-r from-orange-100 to-red-100',
        iconTextClass: 'text-orange-600'
      };
    default:
      return {
        icon: '💬',
        bgClass: 'bg-gray-50 border-gray-200',
        textClass: 'text-gray-800',
        iconBgClass: 'bg-gray-100',
        iconTextClass: 'text-gray-600'
      };
  }
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const styles = getToastStyles(toast.type);
  const duration = toast.duration || 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, onClose]);

  return (
    <div className={`
      ${styles.bgClass} border rounded-2xl p-4 shadow-lg
      transform transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-xl
    `}>
      <div className="flex items-start space-x-3">
        {/* 이모티콘 아이콘 */}
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
          ${styles.iconBgClass}
        `}>
          <span className="text-lg">{styles.icon}</span>
        </div>

        {/* 메시지 내용 */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${styles.textClass}`}>
            {toast.title}
          </p>
          {toast.message && (
            <p className={`text-xs mt-1 opacity-80 ${styles.textClass}`}>
              {toast.message}
            </p>
          )}
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={() => onClose(toast.id)}
          className={`
            flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
            hover:bg-black hover:bg-opacity-10 transition-colors
            ${styles.textClass}
          `}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 진행 바 */}
      <div className="mt-3 h-1 bg-black bg-opacity-10 rounded-full overflow-hidden">
        <div 
          className={`h-full opacity-50 rounded-full ${styles.textClass}`}
          style={{ 
            backgroundColor: 'currentColor',
            width: '100%',
            animation: `shrink ${duration}ms linear forwards`
          }}
        />
      </div>
    </div>
  );
};

// Toast Container 컴포넌트
interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}; 