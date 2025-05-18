import { Button, Textarea, NumberInput, ActionIcon, Modal, TextInput, Select } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { TextItem } from '../../../../types/PageTypes';
import { IconLinkPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import PageList from '../../../PageList';

interface TextItemProps {
  handleSubmit: (values: TextItem) => void;
  initialValues?: TextItem;
}

function TextItemForm(props: TextItemProps) {
  const [isLinkModelOpen, { open: openLinkModel, close: closeLinkModel }] = useDisclosure(false);
  const [allPages, setAllPages] = useState<{ value: string, label: string }[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number[]>([0, 0]);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      season: props.initialValues?.season || 0,
      episode: props.initialValues?.episode || 0,
      text: props.initialValues?.text || '',
    },
    validate: {
      text: isNotEmpty('Text is required'),
      episode: (value, values) => values.season === 0 && value > 0 ? 'Episode can only be 0 if season is 0' : null,
    },
  });

  useEffect(() => {
    if (props.initialValues) {
      form.setValues({
        season: props.initialValues.season,
        episode: props.initialValues.episode,
        text: props.initialValues.text,
      });
    }
  }, [props.initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (values: typeof form.values) => props.handleSubmit(values);

  const openLinkForm = async () => {
    if (Object.keys(allPages).length) {
      linkForm.reset();
      prefillLinkTextWithSelection();
      openLinkModel();
      return;
    }

    try {
      const response = await axios.get<PageList>('http://localhost:3000/api/pages');
      
      const pages = response.data.map((page) => ({ value: page._id, label: page.title }));
      setAllPages(pages);

      prefillLinkTextWithSelection();
      openLinkModel();
    } catch (error) {
      console.error("Error fetching page list:", error);
    }
  }

  const prefillLinkTextWithSelection = () => {
    if (cursorPosition[0] === cursorPosition[1]) {
      return;
    }

    const text = form.getValues().text;
    const selectedText = text.substring(cursorPosition[0], cursorPosition[1]);
    linkForm.setValues({ text: selectedText });
  }

  const linkForm = useForm({
    mode: 'uncontrolled',
    initialValues: { text: '', link: '' },
  });

  const handleLinkFormSubmit = async (values: typeof linkForm.values) => {
    const text = form.getValues().text;

    form.setValues({
      text:
        text.substring(-1, cursorPosition[0])
        + `[[${values.link}|${values.text}]]`
        + text.substring(cursorPosition[1])
    });
    closeLinkModel();
  }

  const saveCursorPosition = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    setCursorPosition([textarea.selectionStart, textarea.selectionEnd]);
  }

  return (
    <>
      <Modal opened={isLinkModelOpen} onClose={closeLinkModel} size='sm' title='Add Link' centered>
        <form onSubmit={linkForm.onSubmit(handleLinkFormSubmit)}>
          <Select key={linkForm.key('link')} {...linkForm.getInputProps('link')} label='Link' placeholder='Link' required
            data={allPages}
            searchable
            clearable
            limit={5} />
          <TextInput key={linkForm.key('text')} {...linkForm.getInputProps('text')} label='Text' placeholder='Text' required />
          <br />
          <Button type='submit'>Submit</Button>
        </form>
      </Modal>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <NumberInput key={form.key('season')} {...form.getInputProps('season')} label="Season" min={0} />
        <NumberInput key={form.key('episode')} {...form.getInputProps('episode')} label="Episode" min={0} />
        <Textarea key={form.key('text')} {...form.getInputProps('text')} label="Text" autosize minRows={2} placeholder="Enter text"
          onBlur={saveCursorPosition}/>
        <ActionIcon variant='transparent' onClick={openLinkForm}><IconLinkPlus /></ActionIcon>
        <br /><br />
        <Button type='submit'>Submit</Button>
      </form>
    </>
  );
}

export default TextItemForm;
