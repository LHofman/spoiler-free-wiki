import { createFileRoute } from '@tanstack/react-router';
import Slider from '../../../components/Slider';
import PageDetails from '../../../components/Page/PageDetails';

export const Route = createFileRoute('/pages/$pageId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pageId } = Route.useParams();
  return (
    <>
      <Slider />
      <PageDetails pageId={pageId} />
    </>
  );
}
