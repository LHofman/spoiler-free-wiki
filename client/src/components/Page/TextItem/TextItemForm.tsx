import { Button, Textarea, NumberInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect } from 'react';

interface TextItem {
  text: string;
  season: number;
  episode: number;
}
interface TextItemProps {
  handleSubmit: (values: TextItem) => void;
  initialValues?: TextItem;
}

function TextItemForm(props: TextItemProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      season: props.initialValues?.season || 0,
      episode: props.initialValues?.episode || 0,
      text: props.initialValues?.text || '',
    },
    validate: {
      text: isNotEmpty('Text is required'),
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

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <NumberInput key={form.key('season')} {...form.getInputProps('season')} label="Season" min={0} />
      <NumberInput key={form.key('episode')} {...form.getInputProps('episode')} label="Episode" min={0} />
      <Textarea key={form.key('text')} {...form.getInputProps('text')} label="Text" autosize minRows={2} placeholder="Enter text" />
      <br />
      <Button type='submit'>Submit</Button>
    </form>
  );
}

export default TextItemForm;
