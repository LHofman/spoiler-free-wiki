import axios from 'axios';
import { useState, useEffect } from 'react'
import { useAppSelector } from '../store/hooks';

interface Page {
  _id: string;
  title: string;
  text: string[];
}

function PageDetails() {
  const progress = useAppSelector((state) => state.progress);
  const [page, setPage] = useState<Page|null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get<Page>(
          `http://localhost:3000/api/pages/6808fd7b71fcf4b8e2dd56a7/${progress.season}/${progress.episode}`
        );
        console.log("Fetched page:", response.data);
        setPage(response.data);
      } catch (error) {
        console.error("Error fetching page:", error);
      }
    };
    fetchPage();
  }, [progress]);

  return page && (
    <>
      <h1>{ page.title }</h1>
      { page.text.map((textLine, idx) => <p key={idx}>{ textLine }</p>) }
    </>
  );
}

export default PageDetails;
