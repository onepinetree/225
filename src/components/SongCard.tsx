import React, { useState } from 'react';
import { Play, MoreVertical, ChevronUp, ChevronDown, ExternalLink, Music } from 'lucide-react';
import { Song, PlayOption } from '../types';
import { PLAY_OPTIONS } from '../constants';
import { ConfirmDialog } from './ConfirmDialog';

interface SongCardProps {
  song: Song;
  index: number;
  totalSongs: number;
  expandedSong: string | null;
  onExpandSong: (songId: string) => void;
  onPlayOption: (song: Song, option: PlayOption) => void;
  onEdit: (song: Song) => void;
  onDelete: (songId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  index,
  totalSongs,
  expandedSong,
  onExpandSong,
  onPlayOption,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isPlayMenuOpen = expandedSong === song.id;
  const isMoreMenuOpen = expandedSong === song.id + '-menu';

  const generatePlayUrl = (song: Song, option: PlayOption) => {
    const videoId = song.youtubeUrl.split('v=')[1]?.split('&')[0];
    
    if (option.secondsBefore === -1) {
      return `https://youtube.com/watch?v=${videoId}`;
    } else {
      const startTime = Math.max(0, song.climaxTime - option.secondsBefore);
      return `https://youtube.com/watch?v=${videoId}&t=${startTime}`;
    }
  };

  const handlePlayOption = (option: PlayOption) => {
    const url = generatePlayUrl(song, option);
    window.open(url, '_blank');
    onExpandSong(''); // 메뉴 닫기
  };

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow flex items-center space-x-4 relative cursor-pointer"
      onClick={() => onExpandSong(song.id)}
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
      
      {/* 제목 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-lg truncate">{song.title}</h3>
      </div>
      
      {/* 오른쪽 버튼 그룹 */}
      <div className="flex items-center space-x-2 ml-2">
        {/* 순위 변경 버튼 */}
        <button
          onClick={e => { e.stopPropagation(); onMoveUp(index); }}
          className={`w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 transition-colors ${index === 0 ? 'opacity-30 cursor-default' : ''}`}
          tabIndex={-1}
          aria-label="위로"
          disabled={index === 0}
        >
          <ChevronUp className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onMoveDown(index); }}
          className={`w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-gray-100 transition-colors ${index === totalSongs - 1 ? 'opacity-30 cursor-default' : ''}`}
          tabIndex={-1}
          aria-label="아래로"
          disabled={index === totalSongs - 1}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
        
        {/* Play 아이콘 */}
        <button
          onClick={e => { e.stopPropagation(); onExpandSong(song.id); }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-transparent focus:bg-transparent transition-none"
          tabIndex={-1}
          aria-label="재생 옵션 열기"
        >
          <Play className="text-gray-400 w-6 h-6" />
        </button>
        
        {/* 점 세개(더보기) 버튼 */}
        <div className="relative">
          <button
            onClick={e => {
              e.stopPropagation();
              onExpandSong(isMoreMenuOpen ? '' : song.id + '-menu');
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-transparent focus:bg-transparent transition-none"
            tabIndex={-1}
            aria-label="더보기"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* 더보기 메뉴 */}
          {isMoreMenuOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-[100px]">
              <button
                onClick={e => { e.stopPropagation(); onEdit(song); onExpandSong(''); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
              >
                수정
              </button>
              <button
                onClick={e => { 
                  e.stopPropagation(); 
                  setShowDeleteConfirm(true);
                  onExpandSong('');
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* 재생 옵션 메뉴 */}
      {isPlayMenuOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
          {PLAY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={(e) => {
                e.stopPropagation();
                handlePlayOption(option);
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between group"
            >
              <span className="text-gray-700 group-hover:text-gray-900">{option.label}</span>
              <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
            </button>
          ))}
        </div>
      )}

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="에너지 포인트 삭제"
        message={`"${song.title}"을(를) 정말 삭제할까요?\n삭제하면 되돌릴 수 없습니다.`}
        emoji="🗑️"
        confirmText="삭제하기"
        cancelText="취소"
        type="danger"
        onConfirm={() => {
          onDelete(song.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}; 