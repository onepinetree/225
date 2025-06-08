import React, { useState, useEffect } from 'react';
import { Song } from '../types';
import { fetchYoutubeTitle, getYoutubeVideoId } from '../api/songs';

interface EditSongModalProps {
  song: Song;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Song>) => Promise<{ success: boolean; message: string }>;
}

export const EditSongModal: React.FC<EditSongModalProps> = ({ song, onClose, onSave }) => {
  const [title, setTitle] = useState(song.title);
  const [youtubeUrl, setYoutubeUrl] = useState(song.youtubeUrl);
  const [climaxMinute, setClimaxMinute] = useState(Math.floor(song.climaxTime / 60));
  const [climaxSecond, setClimaxSecond] = useState(song.climaxTime % 60);
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

  // 유튜브 제목 자동 입력 및 유효성 검사
  const handleUrlChange = async (url: string) => {
    setYoutubeUrl(url);
    setUrlError('');
    setTitle('');
    if (!url) return;
    const videoId = getYoutubeVideoId(url);
    if (!videoId) {
      setUrlError('유효하지 않은 유튜브 링크입니다.');
      return;
    }
    setLoadingTitle(true);
    try {
      const fetchedTitle = await fetchYoutubeTitle(url);
      if (fetchedTitle) {
        setTitle(fetchedTitle);
      } else {
        setUrlError('유효하지 않은 유튜브 링크입니다.');
      }
    } catch (error) {
      setUrlError('유효하지 않은 유튜브 링크입니다.');
    } finally {
      setLoadingTitle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const climaxTime = climaxMinute * 60 + climaxSecond;
      const result = await onSave(song.id, {
        title,
        youtubeUrl,
        climaxTime
      });
      if (result.success) {
        onClose();
      }
      // 실패해도 조용히 처리
    } catch (error) {
      // 오류 발생해도 조용히 처리
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">에너지 포인트 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
              required
              disabled={submitting}
            />
            {urlError && <p className="text-xs text-red-500 mt-1">{urlError}</p>}
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
              disabled={loadingTitle || submitting}
            />
            {loadingTitle && <p className="text-xs text-gray-500 mt-1">제목을 가져오는 중...</p>}
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
              disabled={submitting || !title || !!urlError}
            >
              {submitting ? '저장중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 