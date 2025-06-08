import { useState, useEffect } from 'react';
import { Song } from '../types';
import * as songsApi from '../api/songs';

export const useSongs = (isLoggedIn: boolean) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  // 곡 목록 불러오기
  const loadSongs = async () => {
    if (!isLoggedIn) {
      setSongs([]);
      return;
    }

    setLoading(true);
    try {
      const data = await songsApi.getSongs();
      setSongs(data);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 로그인 상태 변화 시 곡 목록 불러오기
  useEffect(() => {
    if (isLoggedIn) {
      loadSongs();
    } else {
      setSongs([]);
    }
  }, [isLoggedIn]);

  // 곡 추가
  const addSong = async (songData: Omit<Song, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSong = await songsApi.createSong(songData);
      if (newSong) {
        setSongs(prev => [...prev, newSong]);
      }
      return { success: true, message: '곡이 추가되었습니다.' };
    } catch (error: any) {
      return { success: false, message: '곡 추가 실패: ' + error.message };
    }
  };

  // 곡 수정
  const updateSong = async (id: string, updates: Partial<Song>) => {
    try {
      const updatedSong = await songsApi.updateSong(id, updates);
      if (updatedSong) {
        setSongs(prev => prev.map(song => 
          song.id === id ? updatedSong : song
        ));
      }
      return { success: true, message: '곡이 수정되었습니다.' };
    } catch (error: any) {
      return { success: false, message: '곡 수정 실패: ' + error.message };
    }
  };

  // 곡 삭제
  const deleteSong = async (id: string) => {
    try {
      await songsApi.deleteSong(id);
      setSongs(prev => prev.filter(song => song.id !== id));
      return { success: true, message: '곡이 삭제되었습니다.' };
    } catch (error: any) {
      return { success: false, message: '곡 삭제 실패: ' + error.message };
    }
  };

  // 곡 순서 변경
  const reorderSongs = async (newOrder: Song[]) => {
    // 먼저 UI 업데이트 (즉각적인 반응)
    setSongs(newOrder);
    
    try {
      await songsApi.reorderSongs(newOrder);
      return { success: true };
    } catch (error: any) {
      // 실패하면 다시 불러오기
      await loadSongs();
      return { success: false, message: '순서 변경 실패: ' + error.message };
    }
  };

  // 곡 순서 위로 이동
  const moveSongUp = async (index: number) => {
    if (index > 0) {
      const newSongs = [...songs];
      [newSongs[index - 1], newSongs[index]] = [newSongs[index], newSongs[index - 1]];
      await reorderSongs(newSongs);
    }
  };

  // 곡 순서 아래로 이동
  const moveSongDown = async (index: number) => {
    if (index < songs.length - 1) {
      const newSongs = [...songs];
      [newSongs[index + 1], newSongs[index]] = [newSongs[index], newSongs[index + 1]];
      await reorderSongs(newSongs);
    }
  };

  // 기본곡 추가
  const addDefaultSongs = async () => {
    try {
      const defaultSongs = await songsApi.addDefaultSongsForNewUser();
      setSongs(defaultSongs);
      return { success: true, message: '기본곡이 추가되었습니다!' };
    } catch (error: any) {
      return { success: false, message: '기본곡 추가 실패: ' + error.message };
    }
  };

  return {
    songs,
    loading,
    addSong,
    updateSong,
    deleteSong,
    moveSongUp,
    moveSongDown,
    addDefaultSongs,
    refreshSongs: loadSongs
  };
}; 