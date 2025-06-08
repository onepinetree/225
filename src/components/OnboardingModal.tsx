import React from 'react';
import { Zap } from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">환영합니다!</h2>
          <p className="text-gray-600">운동의 순간, 완벽한 타이밍을 경험해보세요</p>
        </div>
        <div className="space-y-4 text-left mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-orange-600 text-sm font-bold">1</span>
            </div>
            <p className="text-gray-700">좋아하는 노래의 클라이맥스 시간을 설정하세요</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-orange-600 text-sm font-bold">2</span>
            </div>
            <p className="text-gray-700">재생할 때 원하는 시점을 선택하세요</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-orange-600 text-sm font-bold">3</span>
            </div>
            <p className="text-gray-700">최고의 에너지 부스트를 경험하세요</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}; 