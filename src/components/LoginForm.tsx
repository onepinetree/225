import React, { useState } from 'react';

interface LoginFormProps {
  onEmailSubmit: (email: string, password: string, isSignUp: boolean) => Promise<void>;
  onKakaoLogin: () => Promise<void>;
  onGuestLogin: () => void;
  loading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onEmailSubmit,
  onKakaoLogin,
  onGuestLogin,
  loading
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onEmailSubmit(email, password, isSignUp);
  };

  return (
    <div className="max-w-sm mx-auto space-y-3">
      {/* 이메일/패스워드 폼 */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? '처리중...' : (isSignUp ? '회원가입' : '로그인')}
        </button>
      </form>
      
      {/* 회원가입/로그인 전환 */}
      <div className="text-center">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {isSignUp ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
        </button>
      </div>

      {/* 구분선 */}
      <div className="flex items-center space-x-4 my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="text-sm text-gray-500">또는</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      <button
        onClick={onKakaoLogin}
        className="w-full py-4 bg-yellow-400 text-gray-800 rounded-xl font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
      >
        <span>카카오로 시작하기</span>
      </button>
      
      {/* 바로 시작하기 링크 */}
      <div className="text-center mt-4">
        <button
          onClick={onGuestLogin}
          className="text-xs text-gray-400 underline hover:text-gray-500 bg-transparent border-none p-0 m-0"
          style={{ boxShadow: 'none' }}
        >
          바로 시작하기
        </button>
      </div>
    </div>
  );
}; 