import { useState } from 'react';
import { TextSection, TextItem } from '../../../../types/PageTypes';
import EditPageTextItems from '../EditPageTextItems';
import EditPageTextItemVersions from '../TextItem/EditPageTextItemVersions';
import { useDisclosure } from '@mantine/hooks';
import { Card, Modal, Tabs } from '@mantine/core';
import TextItemForm from '../TextItem/TextItemForm';
import { getLastItem } from '../../../../utils/arrayUtils';
import DragAndDropList from '../../../Shared/Edit/DragAndDropList';

interface EditTextSectionsProps {
  textSections: TextSection[];
  update: (updatedTextSections: TextSection[]) => Promise<void>;
}
function EditTextSections(props: EditTextSectionsProps) {
  const [isModelOpen, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  const handleAddEditTextSection = (textSectionIndex: number, textSection: TextSection) => {
    const updatedTextSections = props.textSections;
    if (textSectionIndex === -1) {
      updatedTextSections.push(textSection);
    } else {
      updatedTextSections[textSectionIndex] = textSection;
    }

    props.update(updatedTextSections);
  };

  const deleteTextSection = async (textSectionIndex: number): Promise<void> => {
    if (props.textSections[textSectionIndex].text.length ?? 0 > 0) {
      alert('Cannot delete a property that has text');
      return;
    }

    const updatedTextSections = props.textSections;
    updatedTextSections.splice(textSectionIndex, 1);
    
    props.update(updatedTextSections);
  }
    
  const handleAddTextSection = async (values: TextItem) => {
    const newTextSection: TextSection = {
      title: [values],
      text: [],
    };

    handleAddEditTextSection(-1, newTextSection);

    close();
  };

  const updateTitles = async (
    textSectionIndex: number,
    updatedTitles: TextItem[]
  ): Promise<void> => {
    const updatedTextSections = props.textSections;

    updatedTextSections[textSectionIndex].title = updatedTitles;

    props.update(updatedTextSections);
  };

  const updateTextItems = async (textSectionIndex: number, updatedTextItems: TextItem[][]): Promise<void> => {
    const updatedTextSections = props.textSections;

    updatedTextSections[textSectionIndex].text = updatedTextItems;

    props.update(updatedTextSections);
  }

  const reorderTextSection = (sourceIndex: number, destinationIndex: number) => {
    const updatedTextSections = props.textSections;
    const [removed] = updatedTextSections.splice(sourceIndex, 1);
    updatedTextSections.splice(destinationIndex, 0, removed);

    props.update(updatedTextSections);
  }
    
  return (
    <>
      <Modal opened={isModelOpen} onClose={close} size='lg' title='Add Text Section' centered>
        <TextItemForm handleSubmit={handleAddTextSection} />
      </Modal>

      <h2>Text Sections</h2>

      <Tabs color='red' defaultValue={'overview'} value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value='overview'>Overview</Tabs.Tab>
          { props.textSections.map((textSection, index) => (
            <Tabs.Tab key={index} value={'' + index}>{getLastItem(textSection.title)!.text}</Tabs.Tab>
          )) }
          <Tabs.Tab value={'' + props.textSections.length} onClick={open}>Add New Text Section</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel key='overview' value={'overview'}>
          <DragAndDropList<TextSection>
            items={props.textSections}
            reorder={reorderTextSection}
            renderItem={(textSection: TextSection) => (
              <Card style={{margin: '1em auto'}}>
                {getLastItem(textSection.title)!.text}
              </Card>
            )} />
        </Tabs.Panel>
        
        { props.textSections.map((textSection, index) => (
          <Tabs.Panel key={index} value={'' + index}>
            <EditPageTextItemVersions
              key={index}
              textItemVersions={textSection.title}
              update={ (updatedTextItemVersions) => updateTitles(index, updatedTextItemVersions) }
              canDelete={ () => textSection.title.length > 1 || textSection.text.length === 0 }
              delete={ () => deleteTextSection(index) } />

            <EditPageTextItems
              textItems={textSection.text}
              update={ (updatedTextItems: TextItem[][]) => updateTextItems(index, updatedTextItems) } />
          </Tabs.Panel>
        )) }
      </Tabs>
    </>
  );
}

export default EditTextSections;