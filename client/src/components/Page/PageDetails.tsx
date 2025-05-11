import axios from 'axios';
import { useState, useEffect, Fragment } from 'react'
import { useAppSelector } from '../../store/hooks';
import { Link } from '@tanstack/react-router';
import { PageDetails } from '../../types/PageTypes';

interface PageDetailsProps {
  pageId: string;
}

function PageDetailsComponent(props: PageDetailsProps) {
  const progress = useAppSelector((state) => state.progress);
  const [page, setPage] = useState<PageDetails|null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get<PageDetails>(
          `http://localhost:3000/api/pages/${props.pageId}/${progress.season}/${progress.episode}`
        );
        console.log("Fetched page:", response.data);
        setPage(response.data);
      } catch (error) {
        console.error("Error fetching page:", error);
      }
    };
    fetchPage();
  }, [progress, props.pageId]);

  return page && (
    <>
      <h1>{ page.title }</h1>
      <Link to={`/pages/$pageId/edit`} params={{ pageId: page._id }}>Edit</Link>
      <h2>Properties</h2>
      { (page.properties ?? []).map((property) => (
        <p><b>{ property.property }</b>: { property.value }</p>
      )) }
      <hr />
      <h2>Information</h2>
      { page.text.map((textLine, idx) => <p key={idx}>{ textLine }</p>) }
      <hr />
      {
        page.textSections.map((section, idx) => (
          <Fragment key={idx}>
            <h3>{ section.title }</h3>
            { section.text.map((textLine, idx) => <p key={idx}>{ textLine }</p>) }
          </Fragment>
        ))
      }
    </>
  );
}

export default PageDetailsComponent;
