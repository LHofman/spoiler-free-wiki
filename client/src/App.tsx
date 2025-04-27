import axios from 'axios';
import { useState, useEffect } from 'react'
import './App.css'

interface Page {
  _id: string;
  title: string;
  text: string[];
}

function App() {
  const [page, setPage] = useState<Page|null>(null);
  const [season, setSeason] = useState<number>(0);
  const [episode, setEpisode] = useState<number>(0);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get<Page>(`http://localhost:3000/api/pages/6808fd7b71fcf4b8e2dd56a7/${season}/${episode}`);
        console.log("Fetched page:", response.data);
        setPage(response.data);
      } catch (error) {
        console.error("Error fetching page:", error);
      }
    };
    fetchPage();
  }, [season, episode]);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLInputElement>) => { setSeason(Number(e.target.value)); }
  const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement>) => { setEpisode(Number(e.target.value)); }

  return (
    <>
      <input type="range" min="0" max="3" value={season} onChange={handleSeasonChange}/> { season }
      <br />
      <input type="range" min="0" max="10" value={episode} onChange={handleEpisodeChange} /> { episode }
      { page && (
        <>
          <h1>{ page.title }</h1>
          { page.text.map((textLine, idx) => <p key={idx}>{ textLine }</p>) }
        </>
      ) }
    </>
  )
}

export default App
