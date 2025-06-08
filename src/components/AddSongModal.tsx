import React, { useState } from 'react';
import { Song } from '../types';
import { fetchYoutubeTitle } from '../api/songs';
import { useToast } from '../hooks/useToast';

interface AddSongModalProps {
  onClose: () => void;
  onAdd: (song: Omit<Song, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean; message: string }>;
}

export const AddSongModal: React.FC<AddSongModalProps> = ({ onClose, onAdd }) => {
  const toast = useToast();
  const [newSong, setNewSong] = useState({
    title: '',
    youtubeUrl: '',
    climaxTime: 0
  });
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [climaxMinute, setClimaxMinute] = useState(0);
  const [climaxSecond, setClimaxSecond] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // 유튜브 제목 자동 입력
  const handleUrlChange = async (url: string) => {
    setNewSong({ ...newSong, youtubeUrl: url });
    
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      setLoadingTitle(true);
      try {
        const title = await fetchYoutubeTitle(url);
        if (title) {
          setNewSong(prev => ({ ...prev, title }));
        }
      } catch (error) {
        console.error('Failed to fetch title:', error);
      } finally {
        setLoadingTitle(false);
      }
    } else {
      setNewSong(prev => ({ ...prev, title: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const climaxTime = climaxMinute * 60 + climaxSecond;
      const result = await onAdd({
        ...newSong,
        climaxTime
      });
      
      if (result.success) {
        onClose();
        setNewSong({ title: '', youtubeUrl: '', climaxTime: 0 });
        setClimaxMinute(0);
        setClimaxSecond(0);
        toast.success('새 에너지 포인트 추가!', '완벽한 클라이맥스를 찾았네요 🎯');
      } else {
        toast.error('곡 추가 실패', result.message);
      }
    } catch (error) {
      toast.error('오류 발생', '곡 추가 중 문제가 발생했습니다 😅');
    } finally {
      setSubmitting(false);
    }
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
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
              required
              disabled={submitting}
            />
          </div>
          
          {newSong.title && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">노래 제목</label>
              <input
                type="text"
                value={newSong.title}
                onChange={e => setNewSong({ ...newSong, title: e.target.value })}
                className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg text-gray-800"
                placeholder="유튜브에서 자동 입력됨"
                required
                disabled={loadingTitle || submitting}
              />
              {loadingTitle && <p className="text-xs text-gray-500 mt-1">제목을 가져오는 중...</p>}
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
                disabled={submitting}
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
                disabled={submitting}
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
              disabled={submitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 disabled:opacity-50"
              disabled={submitting || !newSong.title}
            >
              {submitting ? '추가중...' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 