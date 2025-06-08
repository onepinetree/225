import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';
import * as authApi from '../api/auth';
import { addDefaultSongsForNewUser } from '../api/songs';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Supabase Auth 상태 변화 감지
  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.email?.split('@')[0] || '사용자',
          email: session.user.email || ''
        });
        setIsLoggedIn(true);
      }
      setLoading(false);
    });

    // 세션 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          name: session.user.email?.split('@')[0] || '사용자',
          email: session.user.email || ''
        });
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 이메일 회원가입
  const signUp = async (email: string, password: string) => {
    try {
      await authApi.signUpWithEmail(email, password);
      
      // 회원가입 성공 시 바로 기본곡 추가
      try {
        await addDefaultSongsForNewUser();
      } catch (error) {
        console.error('Failed to add default songs:', error);
      }
      
      return { success: true, message: '회원가입 성공! 이메일을 확인해주세요.' };
    } catch (error: any) {
      return { success: false, message: '회원가입 실패: ' + error.message };
    }
  };

  // 이메일 로그인
  const signIn = async (email: string, password: string) => {
    try {
      await authApi.signInWithEmail(email, password);
      return { success: true, message: '로그인 성공!' };
    } catch (error: any) {
      return { success: false, message: '로그인 실패: ' + error.message };
    }
  };

  // 카카오 로그인
  const signInWithKakao = async () => {
    try {
      await authApi.signInWithKakao();
      return { success: true, message: '카카오 로그인을 진행합니다.' };
    } catch (error: any) {
      return { success: false, message: '카카오 로그인 실패: ' + error.message };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await authApi.signOut();
      return { success: true };
    } catch (error: any) {
      return { success: false, message: '로그아웃 실패: ' + error.message };
    }
  };

  return {
    isLoggedIn,
    user,
    loading,
    signUp,
    signIn,
    signInWithKakao,
    logout
  };
}; 