import { useState } from 'react';
import { TextSection, TextItem } from '../../../../types/PageTypes';
import EditPageTextItems from '../EditPageTextItems';
import EditPageTextItemVersions from '../TextItem/EditPageTextItemVersions';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Tabs } from '@mantine/core';
import TextItemForm from '../TextItem/TextItemForm';
import { getLastItem } from '../../../../utils/arrayUtils';

interface EditTextSectionsProps {
  textSections: TextSection[];
  update: (textSectionIndex: number, textSection: TextSection) => void;
  delete: (textSectionIndex: number) => void;
}
function EditTextSections(props: EditTextSectionsProps) {
  const [isModelOpen, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string | null>('0');
    
  const handleAddTextSection = async (values: TextItem) => {
    const newTextSection: TextSection = {
      title: [values],
      text: [],
    };

    props.update(-1, newTextSection);

    close();
  };

  const handleAddEditTitle = (textSectionIndex: number, titleIndex: number, title: TextItem) => {
    const updatedTextSection = Object.assign({}, props.textSections[textSectionIndex]);

    if (titleIndex === -1) {
      updatedTextSection.title.push(title);
    } else {
      updatedTextSection.title[titleIndex] = title;
    }

    props.update(textSectionIndex, updatedTextSection);
  };

  const handleDeleteTitle = (textSectionIndex: number, titleIndex: number) => {
    const updatedTextSection = Object.assign({}, props.textSections[textSectionIndex]);

    updatedTextSection.title.splice(titleIndex, 1);

    if (updatedTextSection.title.length === 0) {
      props.delete(textSectionIndex);
      setActiveTab('0');
      return;
    }
    
    props.update(textSectionIndex, updatedTextSection);
  }

  const handleAddEditTextItem = (
    textSectionIndex: number,
    textItemIndex: number,
    textItemVersionIndex: number,
    textItem: TextItem
  ) => {
    const updatedTextSection = Object.assign({}, props.textSections[textSectionIndex]);
    if (!updatedTextSection.text[textItemIndex]) {
      updatedTextSection.text[textItemIndex] = [];
    }

    if (textItemVersionIndex === -1) {
      updatedTextSection.text[textItemIndex].push(textItem);
    } else {
      updatedTextSection.text[textItemIndex][textItemVersionIndex] = textItem;
    }

    props.update(textSectionIndex, updatedTextSection);
  }

  const handleDeleteTextItemVersion = (
    textSectionIndex: number,
    textItemIndex: number,
    textItemVersionIndex: number
  ) => {
    const updatedTextSection = Object.assign({}, props.textSections[textSectionIndex]);
    updatedTextSection.text[textItemIndex].splice(textItemVersionIndex, 1);
    if (updatedTextSection.text[textItemIndex].length === 0) {
      updatedTextSection.text.splice(textItemIndex, 1);
    }
    
    props.update(textSectionIndex, updatedTextSection);
  }

  return (
    <>
      <Modal opened={isModelOpen} onClose={close} title='Add Text Section' centered>
        <TextItemForm handleSubmit={handleAddTextSection} />
      </Modal>

      <h2>Text Sections</h2>

      <Tabs color='red' defaultValue={'0'} value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          { props.textSections.map((textSection, index) => (
            <Tabs.Tab key={index} value={'' + index}>{getLastItem(textSection.title)!.text}</Tabs.Tab>
          )) }
          <Tabs.Tab value={'' + props.textSections.length} onClick={open}>Add New Text Section</Tabs.Tab>
        </Tabs.List>
        
        { props.textSections.map((textSection, index) => (
          <Tabs.Panel key={index} value={'' + index}>
            <EditPageTextItemVersions
              key={index}
              textItemVersions={textSection.title}
              update={ (versionIndex: number, textItem: TextItem) => handleAddEditTitle(index, versionIndex, textItem) }
              canDelete={ () => textSection.title.length > 1 || textSection.text.length === 0 }
              delete={ (versionIndex: number) => handleDeleteTitle(index, versionIndex) } />

            <EditPageTextItems
              textItems={textSection.text}
              update={
                (textItemIndex: number, textItemVersionIndex: number, textItem: TextItem) =>
                  handleAddEditTextItem(index, textItemIndex, textItemVersionIndex, textItem)
              }
              delete={
                (textItemIndex: number, textItemVersionIndex: number) =>
                  handleDeleteTextItemVersion(index, textItemIndex, textItemVersionIndex)
              } />
          </Tabs.Panel>
        )) }
      </Tabs>
    </>
  );
}

export default EditTextSections;