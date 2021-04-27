import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  playNext: () => void;
  playPrevious: () => void;
  playList: (list: Array<Episode>, index: number) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  setPlayingState: (state: boolean) => void;
};
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
};
export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  function playList(list: Array<Episode>, index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }
  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }
  function toggleLoop() 
  {
    setIsLooping(!isLooping);
  }; 

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }
  const hasNext = currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }
  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }
  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        hasNext, 
        hasPrevious,
        isLooping, 
        playNext,
        playPrevious,
        playList,
        isPlaying,
        togglePlay,
        toggleLoop,
        setPlayingState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => 
{
  return useContext(PlayerContext);
}