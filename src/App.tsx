import React, { useState, useEffect } from 'react';
import { Plus, Play, ExternalLink, Zap, Music, Clock, User, LogOut, ChevronDown, MoreVertical, ChevronUp, ChevronDown as ArrowDown } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist?: string;
  youtubeUrl: string;
  climaxTime: number; // in seconds
  thumbnailUrl?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface PlayOption {
  label: string;
  value: string;
  secondsBefore: number;
}

const PLAY_OPTIONS: PlayOption[] = [
  { label: '처음부터', value: 'start', secondsBefore: -1 },
  { label: '클라이맥스', value: 'climax', secondsBefore: 0 },
  { label: '5초 전', value: '5sec', secondsBefore: 5 },
  { label: '10초 전', value: '10sec', secondsBefore: 10 },
  { label: '20초 전', value: '20sec', secondsBefore: 20 },
  { label: '30초 전', value: '30sec', secondsBefore: 30 },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [showAddSong, setShowAddSong] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [expandedSong, setExpandedSong] = useState<string | null>(null);
  const [editSong, setEditSong] = useState<Song | null>(null);

  // Mock login function
  const handleLogin = (provider: string) => {
    const mockUser = {
      id: '1',
      name: '김운동',
      email: 'workout@example.com'
    };
    setUser(mockUser);
    setIsLoggedIn(true);
    setShowOnboarding(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setSongs([]);
  };

  // Mock songs data
  useEffect(() => {
    if (isLoggedIn) {
      const mockSongs: Song[] = [
        {
          id: '1',
          title: 'ARMY (ft. 박재훈)',
          youtubeUrl: 'https://www.youtube.com/watch?v=jTq2GtCt674',
          climaxTime: 2 * 60 + 24
        },
        {
          id: '2',
          title: 'Legends Never Die',
          youtubeUrl: 'https://music.youtube.com/watch?v=R4hDcd9fzRk&si=AEJrGO14ALSzhwx0',
          climaxTime: 2 * 60 + 56
        },
        {
          id: '3',
          title: 'The Crown (ft. 터질라)',
          youtubeUrl: 'https://music.youtube.com/watch?v=eGpZmqBseqA&si=ufSZCY9rqyngwlt-',
          climaxTime: 38
        },
        {
          id: '4',
          title: 'Royalty (ft. 박재훈)',
          youtubeUrl: 'https://www.youtube.com/watch?v=FEr3Cp5b2Uo',
          climaxTime: 1 * 60 + 21
        },
      ];
      setSongs(mockSongs);
    }
  }, [isLoggedIn]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePlayUrl = (song: Song, option: PlayOption) => {
    const videoId = song.youtubeUrl.split('v=')[1]?.split('&')[0];
    
    if (option.secondsBefore === -1) {
      // 처음부터
      return `https://youtube.com/watch?v=${videoId}`;
    } else {
      // 클라이맥스에서 N초 전
      const startTime = Math.max(0, song.climaxTime - option.secondsBefore);
      return `https://youtube.com/watch?v=${videoId}&t=${startTime}`;
    }
  };

  const handlePlayOption = (song: Song, option: PlayOption) => {
    const url = generatePlayUrl(song, option);
    window.open(url, '_blank');
    setExpandedSong(null); // 선택 후 메뉴 닫기
  };

  const [newSong, setNewSong] = useState({
    title: '',
    youtubeUrl: '',
    climaxTime: 0
  });
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [climaxMinute, setClimaxMinute] = useState(0);
  const [climaxSecond, setClimaxSecond] = useState(0);

  // 유튜브 제목 자동 입력
  const fetchYoutubeTitle = async (url: string) => {
    setLoadingTitle(true);
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (res.ok) {
        const data = await res.json();
        setNewSong((prev) => ({ ...prev, title: data.title }));
      }
    } catch {}
    setLoadingTitle(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const climaxTime = climaxMinute * 60 + climaxSecond;
    const song: Song = {
      id: Date.now().toString(),
      ...newSong,
      climaxTime
    };
    setSongs([...songs, song]);
    setShowAddSong(false);
    setNewSong({ title: '', youtubeUrl: '', climaxTime: 0 });
    setClimaxMinute(0);
    setClimaxSecond(0);
  };

  const AddSongModal = () => {
    const [newSong, setNewSong] = useState({
      title: '',
      youtubeUrl: '',
      climaxTime: 0
    });
    const [loadingTitle, setLoadingTitle] = useState(false);
    const [climaxMinute, setClimaxMinute] = useState(0);
    const [climaxSecond, setClimaxSecond] = useState(0);
    
    // 유튜브 제목 자동 입력
    const fetchYoutubeTitle = async (url: string) => {
      setLoadingTitle(true);
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (res.ok) {
          const data = await res.json();
          setNewSong((prev) => ({ ...prev, title: data.title }));
        }
      } catch {}
      setLoadingTitle(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const climaxTime = climaxMinute * 60 + climaxSecond;
      const song: Song = {
        id: Date.now().toString(),
        ...newSong,
        climaxTime
      };
      setSongs([...songs, song]);
      setShowAddSong(false);
      setNewSong({ title: '', youtubeUrl: '', climaxTime: 0 });
      setClimaxMinute(0);
      setClimaxSecond(0);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">새 에너지 포인트 추가</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
              <input
                type="url"
                value={newSong.youtubeUrl}
                onChange={async (e) => {
                  setNewSong({...newSong, youtubeUrl: e.target.value});
                  if (e.target.value.includes('youtube.com/watch?v=')) {
                    await fetchYoutubeTitle(e.target.value);
                  } else {
                    setNewSong((prev) => ({ ...prev, title: '' }));
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
            {newSong.title && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">노래 제목</label>
                <input
                  type="text"
                  value={newSong.title}
                  onChange={e => setNewSong({...newSong, title: e.target.value})}
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-800"
                  placeholder="유튜브에서 자동 입력됨"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">클라이맥스 시간</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  value={climaxMinute}
                  onChange={e => setClimaxMinute(Number(e.target.value.replace(/\D/g, '')))}
                  className="w-14 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  placeholder="0"
                  required
                />
                <span className="text-gray-500">분</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min="0"
                  max="59"
                  value={climaxSecond}
                  onChange={e => setClimaxSecond(Number(e.target.value.replace(/\D/g, '')))}
                  className="w-14 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  placeholder="0"
                  required
                />
                <span className="text-gray-500">초</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">예: 2분 30초</p>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddSong(false)}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
              >
                추가하기
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const OnboardingModal = () => (
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
          onClick={() => setShowOnboarding(false)}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
        >
          시작하기
        </button>
      </div>
    </div>
  );

  // 삭제 함수
  const handleDeleteSong = (id: string) => {
    setSongs(songs.filter(song => song.id !== id));
  };

  if (!isLoggedIn) {
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

          {/* Login Buttons */}
          <div className="max-w-sm mx-auto space-y-3">
            <button
              onClick={() => handleLogin('kakao')}
              className="w-full py-4 bg-yellow-400 text-gray-800 rounded-xl font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
            >
              <span>카카오로 시작하기</span>
            </button>
            <button
              onClick={() => handleLogin('google')}
              className="w-full py-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Google로 시작하기</span>
            </button>
            <button
              onClick={() => handleLogin('apple')}
              className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Apple로 시작하기</span>
            </button>
          </div>
        </div>

        {/* Bottom Ad Banner Placeholder */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t p-4 text-center text-gray-500 text-sm">
          광고 영역 (320x50)
        </div>
      </div>
    );
  }

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
                <span className="text-sm text-gray-600">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
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
        {songs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="text-gray-400 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">첫 번째 에너지 포인트를 만들어보세요</h2>
            <p className="text-gray-600 mb-8">좋아하는 노래의 클라이맥스를 저장하고<br />원하는 시점부터 바로 재생하세요</p>
            <button
              onClick={() => setShowAddSong(true)}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>첫 노래 추가하기</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">PR치기 10초전 최고의 선택</h2>
              <button
                onClick={() => setShowAddSong(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>추가</span>
              </button>
            </div>

            <div className="space-y-4">
              {songs.map((song, idx) => (
                <div
                  key={song.id}
                  className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow flex items-center space-x-4 relative cursor-pointer"
                  onClick={() => setExpandedSong(song.id)}
                >
                  {/* 썸네일 */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    {song.thumbnailUrl ? (
                      <img
                        src={song.thumbnailUrl}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : song.youtubeUrl ? (
                      <img
                        src={`https://img.youtube.com/vi/${song.youtubeUrl.split('v=')[1]?.split('&')[0]}/0.jpg`}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="text-gray-300 text-xl w-full h-full flex items-center justify-center" />
                    )}
                  </div>
                  {/* 제목만 표시 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-lg truncate">{song.title}</h3>
                  </div>
                  {/* 오른쪽 버튼 그룹 */}
                  <div className="flex items-center space-x-2 ml-2">
                    {/* 순위 변경 버튼 */}
                    <button
                      onClick={e => { e.stopPropagation(); if(idx > 0) { const newSongs = [...songs]; [newSongs[idx-1], newSongs[idx]] = [newSongs[idx], newSongs[idx-1]]; setSongs(newSongs); }}}
                      className={`w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 transition-colors ${idx === 0 ? 'opacity-30 cursor-default' : ''}`}
                      tabIndex={-1}
                      aria-label="위로"
                      disabled={idx === 0}
                    >
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); if(idx < songs.length-1) { const newSongs = [...songs]; [newSongs[idx+1], newSongs[idx]] = [newSongs[idx], newSongs[idx+1]]; setSongs(newSongs); }}}
                      className={`w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 transition-colors ${idx === songs.length-1 ? 'opacity-30 cursor-default' : ''}`}
                      tabIndex={-1}
                      aria-label="아래로"
                      disabled={idx === songs.length-1}
                    >
                      <ArrowDown className="w-4 h-4 text-gray-400" />
                    </button>
                    {/* Play 아이콘 */}
                    <button
                      onClick={e => { e.stopPropagation(); setExpandedSong(song.id); }}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-transparent focus:bg-transparent transition-none"
                      tabIndex={-1}
                      aria-label="재생 옵션 열기"
                    >
                      <Play className="text-gray-400 w-6 h-6" />
                    </button>
                    {/* 점 세개(더보기) 버튼 및 하위 메뉴 */}
                    <div className="relative">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setExpandedSong(expandedSong === song.id + '-menu' ? null : song.id + '-menu');
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-transparent focus:bg-transparent transition-none"
                        tabIndex={-1}
                        aria-label="더보기"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                      </button>
                      {expandedSong === song.id + '-menu' && (
                        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[100px]">
                          <button
                            onClick={e => { e.stopPropagation(); setEditSong(song); setExpandedSong(null); }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                          >수정</button>
                          <button
                            onClick={e => { e.stopPropagation(); if(window.confirm('정말 삭제할까요?')) handleDeleteSong(song.id); setExpandedSong(null); }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500"
                          >삭제</button>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* 옵션 메뉴 */}
                  {expandedSong === song.id && (
                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                      {PLAY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayOption(song, option);
                            setExpandedSong(null);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                        >
                          <span className="text-gray-700 group-hover:text-gray-900">{option.label}</span>
                          <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      {showAddSong && <AddSongModal />}
      {showOnboarding && <OnboardingModal />}

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

      {/* 수정 모달 */}
      {editSong && (
        <EditSongModal song={editSong} onClose={() => setEditSong(null)} onSave={updated => {
          setSongs(songs.map(s => s.id === updated.id ? updated : s));
          setEditSong(null);
        }} />
      )}
    </div>
  );
}

// EditSongModal 컴포넌트 추가
function EditSongModal({ song, onClose, onSave }: { song: Song, onClose: () => void, onSave: (s: Song) => void }) {
  const [title, setTitle] = useState(song.title);
  const [youtubeUrl, setYoutubeUrl] = useState(song.youtubeUrl);
  const [climaxMinute, setClimaxMinute] = useState(Math.floor(song.climaxTime / 60));
  const [climaxSecond, setClimaxSecond] = useState(song.climaxTime % 60);
  const [loadingTitle, setLoadingTitle] = useState(false);

  // 유튜브 제목 자동 입력
  const fetchYoutubeTitle = async (url: string) => {
    setLoadingTitle(true);
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
      }
    } catch {}
    setLoadingTitle(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">에너지 포인트 수정</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave({
              ...song,
              title,
              youtubeUrl,
              climaxTime: climaxMinute * 60 + climaxSecond
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={async (e) => {
                setYoutubeUrl(e.target.value);
                if (e.target.value.includes('youtube.com/watch?v=')) {
                  await fetchYoutubeTitle(e.target.value);
                }
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">노래 제목</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-800"
              placeholder="유튜브에서 자동 입력됨"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">클라이맥스 시간</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min="0"
                value={climaxMinute}
                onChange={e => setClimaxMinute(Number(e.target.value.replace(/\D/g, '')))}
                className="w-14 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                placeholder="0"
                required
              />
              <span className="text-gray-500">분</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min="0"
                max="59"
                value={climaxSecond}
                onChange={e => setClimaxSecond(Number(e.target.value.replace(/\D/g, '')))}
                className="w-14 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                placeholder="0"
                required
              />
              <span className="text-gray-500">초</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">예: 2분 30초</p>
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;