import { createFileRoute, Link } from '@tanstack/react-router';
import Slider from '../../../components/Slider';
import PageDetails from '../../../components/Page/PageDetails/PageDetails';

export const Route = createFileRoute('/pages/$pageId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pageId } = Route.useParams();
  return (
    <>
      <Link to={'/'}>Back to Page List</Link>
      <br /><br />
      <Slider />
      <PageDetails pageId={pageId} />
    </>
  );
}
