import { usePlayer } from '../context/PlayerContext';

/**
 * Thin convenience hook that re-exports the player context.
 * Kept separate so components can depend on `useAudioPlayer()`
 * without knowing the state lives in React context.
 */
const useAudioPlayer = () => usePlayer();

export default useAudioPlayer;
