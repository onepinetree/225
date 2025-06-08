import React, { useState } from 'react';
import { Plus, Zap, Music, Clock, User, LogOut } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useSongs } from './hooks/useSongs';
import { useToast } from './hooks/useToast';
import { LoginForm } from './components/LoginForm';
import { SongCard } from './components/SongCard';
import { AddSongModal } from './components/AddSongModal';
import { EditSongModal } from './components/EditSongModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ToastContainer } from './components/Toast';
import { Song, PlayOption } from './types';

function App() {
  const auth = useAuth();
  const songs = useSongs(auth.isLoggedIn);
  const toast = useToast();
  
  // UI 상태
  const [showAddSong, setShowAddSong] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [expandedSong, setExpandedSong] = useState<string | null>(null);
  const [editSong, setEditSong] = useState<Song | null>(null);

  // 로그인 관련 핸들러
  const handleEmailSubmit = async (email: string, password: string, isSignUp: boolean) => {
    const result = isSignUp ? await auth.signUp(email, password) : await auth.signIn(email, password);
    if (result.success) {
      if (isSignUp) {
        toast.success('회원가입 완료!', '이메일 인증을 확인해주세요 ✉️');
      } else {
        setShowOnboarding(true);
        toast.energy('환영합니다!', '에너지 포인트로 운동을 시작해보세요 🏃‍♂️');
      }
    } else {
      toast.error('로그인 실패', result.message);
    }
  };

  const handleKakaoLogin = async () => {
    const result = await auth.signInWithKakao();
    if (result.success) {
      toast.energy('카카오 로그인 성공!', '에너지 충전 완료 ⚡');
    } else {
      toast.error('카카오 로그인 실패', result.message);
    }
  };

  const handleGuestLogin = () => {
    // 게스트 로그인 (임시 - 나중에 제거 가능)
    setShowOnboarding(true);
  };

  // 곡 관련 핸들러
  const handlePlayOption = (song: Song, option: PlayOption) => {
    // SongCard에서 직접 처리되므로 여기서는 빈 함수
  };

  const handleAddSong = async (songData: Omit<Song, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const result = await songs.addSong(songData);
    if (result.success) {
      setShowAddSong(false);
    }
    return result;
  };

  const handleAddDefaultSongs = async () => {
    const result = await songs.addDefaultSongs();
    if (result.success) {
      toast.energy('기본곡 추가 완료!', 'ARMY, Legends Never Die 등 4곡이 추가되었어요 🎵');
    } else {
      toast.error('기본곡 추가 실패', result.message);
    }
  };

  const handleEditSong = async (id: string, updates: Partial<Song>) => {
    const result = await songs.updateSong(id, updates);
    if (result.success) {
      setEditSong(null);
    }
    return result;
  };

  const handleDeleteSong = async (id: string) => {
    const result = await songs.deleteSong(id);
    if (result.success) {
      toast.success('곡 삭제 완료', '에너지 포인트가 삭제되었습니다 🗑️');
    } else {
      toast.error('삭제 실패', result.message);
    }
  };

  // 로딩 중이면 로딩 화면
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="text-white text-2xl" />
          </div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!auth.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              ClimaxBeats
            </h1>
            <p className="text-xl text-gray-600 mb-2">절정 순간으로, 바로 점프</p>
            <p className="text-gray-500">운동의 순간, 완벽한 타이밍</p>
          </div>

          {/* Features */}
          <div className="max-w-md mx-auto space-y-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">유연한 시작점</h3>
                  <p className="text-gray-600 text-sm">처음부터 ~ 30초 전까지 자유롭게</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Music className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">나만의 플레이리스트</h3>
                  <p className="text-gray-600 text-sm">에너지 포인트만 모아서 관리</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Zap className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">즉시 에너지 부스트</h3>
                  <p className="text-gray-600 text-sm">운동 중 바로 절정감을 느껴보세요</p>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <LoginForm
            onEmailSubmit={handleEmailSubmit}
            onKakaoLogin={handleKakaoLogin}
            onGuestLogin={handleGuestLogin}
            loading={false}
          />
        </div>

        {/* Bottom Ad Banner Placeholder */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t p-4 text-center text-gray-500 text-sm">
          광고 영역 (320x50)
        </div>
      </div>
    );
  }

  // 로그인한 경우 - 메인 앱
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Zap className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">ClimaxBeats</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="text-gray-600 w-4 h-4" />
                <span className="text-sm text-gray-600">{auth.user?.name}</span>
              </div>
              <button
                onClick={auth.logout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20">
        {songs.songs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="text-orange-600 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">에너지 포인트를 시작해보세요!</h2>
            <p className="text-gray-600 mb-10 max-w-md mx-auto">
              운동의 순간, 완벽한 타이밍으로 절정의 에너지를 느껴보세요.<br />
              기본곡으로 바로 시작하거나 직접 추가할 수 있습니다.
            </p>
            
            {/* 메인 액션: 기본곡 추가 */}
            <div className="mb-8">
              <button
                onClick={handleAddDefaultSongs}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 font-bold text-lg shadow-lg"
              >
                <Zap className="w-6 h-6" />
                <span>기본곡으로 바로 시작</span>
              </button>
              <p className="text-sm text-gray-500 mt-3">ARMY, Legends Never Die 등 4곡이 추가됩니다</p>
            </div>

            {/* 구분선 */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 text-sm font-medium">또는</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* 서브 액션: 직접 추가 */}
            <button
              onClick={() => setShowAddSong(true)}
              className="inline-flex items-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 transition-all transform hover:scale-105 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>내가 직접 추가하기</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">내 에너지 포인트</h2>
              <button
                onClick={() => setShowAddSong(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>추가</span>
              </button>
            </div>

            {songs.loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">곡 목록을 불러오는 중...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {songs.songs.map((song, idx) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    index={idx}
                    totalSongs={songs.songs.length}
                    expandedSong={expandedSong}
                    onExpandSong={setExpandedSong}
                    onPlayOption={handlePlayOption}
                    onEdit={setEditSong}
                    onDelete={handleDeleteSong}
                    onMoveUp={songs.moveSongUp}
                    onMoveDown={songs.moveSongDown}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showAddSong && (
        <AddSongModal
          onClose={() => setShowAddSong(false)}
          onAdd={handleAddSong}
        />
      )}
      
      {editSong && (
        <EditSongModal
          song={editSong}
          onClose={() => setEditSong(null)}
          onSave={handleEditSong}
        />
      )}
      
      {showOnboarding && (
        <OnboardingModal
          onClose={() => setShowOnboarding(false)}
        />
      )}

      {/* Bottom Ad Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 text-center text-gray-500 text-sm shadow-lg">
        광고 영역 (320x50) - 자연스럽게 통합된 배너
      </div>

      {/* Click outside to close dropdown */}
      {expandedSong && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setExpandedSong(null)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </div>
  );
}

export default App;