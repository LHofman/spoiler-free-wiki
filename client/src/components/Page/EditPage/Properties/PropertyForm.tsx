import { Button, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect } from 'react';
import { Property } from '../../../../types/PageTypes';

interface PropertyFormProps {
  handleSubmit: (values: Property) => void;
  initialValues?: Property;
}

function PropertyForm(props: PropertyFormProps) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      property: props.initialValues?.property || '',
    },
    validate: {
      property: isNotEmpty('Property is required'),
    },
  });

  useEffect(() => {
    if (props.initialValues) {
      form.setValues({
        property: props.initialValues.property,
      });
    }
  }, [props.initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (values: typeof form.values) => props.handleSubmit({ property: values.property, value: [] });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput key={form.key('property')} {...form.getInputProps('property')} label="Property" placeholder="Property Name" />
      <br />
      <Button type='submit'>Submit</Button>
    </form>
  );
}

export default PropertyForm;
