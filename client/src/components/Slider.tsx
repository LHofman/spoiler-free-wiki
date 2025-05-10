import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProgress } from '../store/progressSlice';

function Slider() {
  const progress = useAppSelector((state) => state.progress);

  const dispatch = useAppDispatch();

  const handleSeasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateProgress({ season: Number(e.target.value), episode: progress.episode }));
  }
  const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateProgress({ season: progress.season, episode: Number(e.target.value) }));
  }

  return (
    <>
      <input type="range" min="1" max="3" value={progress.season} onChange={handleSeasonChange}/> {progress.season}
      <br />
      <input type="range" min="0" max="13" value={progress.episode} onChange={handleEpisodeChange} /> {progress.episode}
    </>
  )
}

export default Slider;
