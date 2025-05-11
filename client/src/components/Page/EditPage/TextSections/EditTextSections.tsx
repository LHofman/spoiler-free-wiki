import { Fragment } from 'react';
import { TextSection, TextItem } from '../../../../types/PageTypes';
import EditPageTextItems from '../EditPageTextItems';
import EditPageTextItemVersions from '../TextItem/EditPageTextItemVersions';
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal } from '@mantine/core';
import TextItemForm from '../TextItem/TextItemForm';

interface EditTextSectionsProps {
  textSections: TextSection[];
  update: (textSectionIndex: number, textSection: TextSection) => void;
  delete: (textSectionIndex: number) => void;
}
function EditTextSections(props: EditTextSectionsProps) {
  const [isModelOpen, { open, close }] = useDisclosure(false);
    
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

      { props.textSections.map((textSection, index) => (
        <Fragment key={index}>
          <EditPageTextItemVersions
            key={index}
            textItemVersions={textSection.title}
            update={ (versionIndex: number, textItem: TextItem) => handleAddEditTitle(index, versionIndex, textItem) }
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
        </Fragment>
      )) }
      <br /><br />
      <Button variant='filled' onClick={open}>Add New Text Section</Button>
    </>
  );
}

export default EditTextSections;