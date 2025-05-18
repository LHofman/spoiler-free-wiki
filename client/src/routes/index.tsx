import { createFileRoute } from '@tanstack/react-router';
import PageList from '../components/PageList';
import Slider from '../components/Slider';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Slider />
      <br /><br />
      <PageList />
    </>
  );
}
