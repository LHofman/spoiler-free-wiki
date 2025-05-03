import { Link } from '@tanstack/react-router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import EditPageTextItems from './TextItem/EditPageTextItems';

interface TextItem {
  text: string;
  season: number;
  episode: number;
}
interface Page {
  _id: string;
  title: string;
  text: TextItem[][];
}

interface EditPageProps {
  pageId: string;
}

function EditPage(props: EditPageProps) {
  const [page, setPage] = useState<Page|null>(null);
  
  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get<Page>(
          `http://localhost:3000/api/pages/raw/${props.pageId}`
        );
        console.log('Fetched page:', response.data);
        setPage(response.data);
      } catch (error) {
        console.error('Error fetching page:', error);
      }
    };
    fetchPage();
  }, [props.pageId]);

  const handleAddEditTextItem = (textItemIndex: number, textItemVersionIndex: number, textItem: TextItem) => {
    const updatedPage = Object.assign({}, page);
    if (!updatedPage.text[textItemIndex]) {
      updatedPage.text[textItemIndex] = [];
    }

    if (textItemVersionIndex === -1) {
      updatedPage.text[textItemIndex].push(textItem);
    } else {
      updatedPage.text[textItemIndex][textItemVersionIndex] = textItem;
    }

    updatePage(updatedPage);
  };

  const handleDeleteTextItemVersion = (textItemIndex: number, textItemVersionIndex: number) => {
    const updatedPage = Object.assign({}, page);
    updatedPage.text[textItemIndex].splice(textItemVersionIndex, 1);
    if (updatedPage.text[textItemIndex].length === 0) {
      updatedPage.text.splice(textItemIndex, 1);
    }
    
    updatePage(updatedPage);
  }

  const updatePage = async (updatedPage: Page): Promise<void> => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/pages/${updatedPage._id}`,
        updatedPage
      );
      console.log('Updated Page:', response.data);

      setPage(updatedPage);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  }

  return page && (
    <>
      <h1>{ page.title }</h1>
      <Link to={`/pages/$pageId`} params={{ pageId: page._id }}>Back to Page View</Link>
      <EditPageTextItems textItems={page.text} update={handleAddEditTextItem} delete={handleDeleteTextItemVersion} />
    </>
  );
}

export default EditPage;
