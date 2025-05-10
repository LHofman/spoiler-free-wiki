import { createFileRoute } from '@tanstack/react-router';
import PageList from '../components/PageList';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <PageList />
  );
}
