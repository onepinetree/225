import { supabase } from '../supabaseClient';
import { Song } from '../types';

// DB에서 받은 데이터를 앱에서 사용하는 형식으로 변환
const transformFromDB = (dbSong: any): Song => ({
  id: dbSong.id,
  title: dbSong.title,
  artist: dbSong.artist,
  youtubeUrl: dbSong.youtube_url,
  climaxTime: dbSong.climax_time,
  thumbnailUrl: dbSong.thumbnail_url,
  user_id: dbSong.user_id,
  order_index: dbSong.order_index,
  created_at: dbSong.created_at,
  updated_at: dbSong.updated_at
});

// 앱에서 사용하는 데이터를 DB 형식으로 변환
const transformToDB = (song: Partial<Song>): any => {
  const dbSong: any = {};
  
  if (song.title !== undefined) dbSong.title = song.title;
  if (song.artist !== undefined) dbSong.artist = song.artist;
  if (song.youtubeUrl !== undefined) dbSong.youtube_url = song.youtubeUrl;
  if (song.climaxTime !== undefined) dbSong.climax_time = song.climaxTime;
  if (song.thumbnailUrl !== undefined) dbSong.thumbnail_url = song.thumbnailUrl;
  if (song.user_id !== undefined) dbSong.user_id = song.user_id;
  if (song.order_index !== undefined) dbSong.order_index = song.order_index;
  
  return dbSong;
};

// 사용자의 모든 곡 조회 (order_index 순으로 정렬)
export const getSongs = async (): Promise<Song[]> => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('order_index', { ascending: true });
  
  if (error) {
    console.error('Error fetching songs:', error);
    return [];
  }
  
  return (data || []).map(transformFromDB);
};

// 곡 추가
export const createSong = async (song: Omit<Song, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Song | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('사용자 인증이 필요합니다.');
  }

  // 다음 order_index 계산
  const { data: lastSong } = await supabase
    .from('songs')
    .select('order_index')
    .eq('user_id', user.id)
    .order('order_index', { ascending: false })
    .limit(1);
  
  const nextOrderIndex = lastSong && lastSong[0] ? lastSong[0].order_index + 1 : 0;

  const dbSong = transformToDB({
    ...song,
    user_id: user.id,
    order_index: nextOrderIndex
  });

  const { data, error } = await supabase
    .from('songs')
    .insert([dbSong])
    .select()
    .single();

  if (error) {
    console.error('Error creating song:', error);
    throw error;
  }

  return transformFromDB(data);
};

// 곡 수정
export const updateSong = async (id: string, updates: Partial<Song>): Promise<Song | null> => {
  const dbUpdates = transformToDB(updates);
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('songs')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating song:', error);
    throw error;
  }

  return transformFromDB(data);
};

// 곡 삭제
export const deleteSong = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting song:', error);
    throw error;
  }
};

// 곡 순서 변경 (두 곡의 order_index 교환)
export const reorderSongs = async (songs: Song[]): Promise<void> => {
  try {
    // 각 곡의 order_index를 개별적으로 업데이트
    for (let i = 0; i < songs.length; i++) {
      const { error } = await supabase
        .from('songs')
        .update({ order_index: i })
        .eq('id', songs[i].id);
      
      if (error) {
        console.error('Error updating song order:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error reordering songs:', error);
    throw error;
  }
};

// 유튜브 제목 자동 입력
export const fetchYoutubeTitle = async (url: string): Promise<string> => {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (res.ok) {
      const data = await res.json();
      return data.title;
    }
  } catch (error) {
    console.error('Error fetching YouTube title:', error);
  }
  return '';
};

// 새 사용자를 위한 기본곡 추가
export const addDefaultSongsForNewUser = async (): Promise<Song[]> => {
  const defaultSongs = [
    {
      title: 'ARMY (ft. 박재훈)',
      youtubeUrl: 'https://www.youtube.com/watch?v=jTq2GtCt674',
      climaxTime: 2 * 60 + 24
    },
    {
      title: 'Legends Never Die',
      youtubeUrl: 'https://music.youtube.com/watch?v=R4hDcd9fzRk&si=vc6MrfqBNSVd-pXO',
      climaxTime: 2 * 60 + 56
    },
    {
      title: 'The Crown (ft. 터질라)',
      youtubeUrl: 'https://music.youtube.com/watch?v=eGpZmqBseqA&si=ufSZCY9rqyngwlt-',
      climaxTime: 38
    },
    {
      title: 'Royalty (ft. 박재훈)',
      youtubeUrl: 'https://www.youtube.com/watch?v=FEr3Cp5b2Uo',
      climaxTime: 1 * 60 + 21
    }
  ];

  const createdSongs: Song[] = [];
  
  // 순차적으로 기본곡 추가
  for (let i = 0; i < defaultSongs.length; i++) {
    try {
      const songData = {
        ...defaultSongs[i],
        order_index: i
      };
      const newSong = await createSong(songData);
      if (newSong) {
        createdSongs.push(newSong);
      }
    } catch (error) {
      console.error('Error creating default song:', error);
    }
  }
  
  return createdSongs;
}; 