import { Button, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect } from 'react';

interface Page {
  title: string;
}
interface PageProps {
  handleSubmit: (values: Page) => void;
  initialValues?: Page;
}

function PageForm(props: PageProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: props.initialValues?.title || '',
    },
    validate: {
      title: isNotEmpty('Title is required'),
    },
  });

  useEffect(() => {
    if (props.initialValues) {
      form.setValues({
        ...props.initialValues,
      });
    }
  }, [props.initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (values: typeof form.values) => props.handleSubmit(values);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput key={form.key('title')} {...form.getInputProps('title')} label="Title" placeholder="Title" />
      <br />
      <Button type='submit'>Submit</Button>
    </form>
  );
}

export default PageForm;
