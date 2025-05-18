import axios from 'axios';
import { useState, useEffect } from 'react'
import { useAppSelector } from '../../../store/hooks';
import { Link } from '@tanstack/react-router';
import { PageDetails } from '../../../types/PageTypes';
import { IconEdit } from '@tabler/icons-react';
import { Button, Card, Collapse, Flex, Group, Text } from '@mantine/core';
import TextItem from './TextItem';

interface PageDetailsProps {
  pageId: string;
}

function PageDetailsComponent(props: PageDetailsProps) {
  const progress = useAppSelector((state) => state.progress);
  const [page, setPage] = useState<PageDetails|null>(null);
  const [openSections, setOpenSections] = useState<number[]>([]);

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

  const toggleOpenSection = (index: number) => {
    if (openSections.includes(index)) {
      setOpenSections(openSections.filter((i) => i !== index));
    } else {
      setOpenSections([...openSections, index]);
    }
  }

  return page && (
    <>
      <h1>
        { page.title }
        &nbsp;
        <Link to={`/pages/$pageId/edit`} params={{ pageId: page._id }}>
          <IconEdit color='orange' />
        </Link>
      </h1>
      <Flex justify='center' wrap='wrap'>
        <Card radius='sm' withBorder style={{ margin: '1em', width: '25%', minWidth: '250px' }}>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="center">
              <Text fw={500}>Properties</Text>
            </Group>
          </Card.Section>
          <Card.Section style={{ padding: '2em' }}>
            { (page.properties ?? []).map((property, index) => (
              <p key={index}><b>{ property.property }</b>: <TextItem text={ property.value } /></p>
            )) }
          </Card.Section>
        </Card>
        <div style={{ width: '70%', minWidth: '500px' }}>
          <Card radius='sm' withBorder style={{ margin: '1em' }}>
            <Card.Section withBorder inheritPadding py="xs">
              <Group justify="center">
                <Text fw={500}>Information</Text>
              </Group>
            </Card.Section>
            <Card.Section style={{ padding: '2em' }}>
              { page.text.map((textLine, idx) => <p key={idx}><TextItem text={ textLine } /></p>) }
            </Card.Section>
          </Card>
          <Card radius='sm' withBorder style={{ margin: '1em' }}>
            { page.textSections.map((section, idx) => (
              <Card.Section withBorder key={idx} style={{ padding: '2em' }}>
                <h3><Button onClick={() => toggleOpenSection(idx)}>{ section.title }</Button></h3>
                <Collapse in={openSections.includes(idx)}>
                  { section.text.map((textLine, idx) => <p key={idx}><TextItem text={ textLine } /></p>) }
                </Collapse>
              </Card.Section>
            )) }
          </Card>
        </div>
      </Flex>
    </>
  );
}

export default PageDetailsComponent;
