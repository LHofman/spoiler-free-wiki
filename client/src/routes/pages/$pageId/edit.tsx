import { createFileRoute } from '@tanstack/react-router';
import EditPage from '../../../components/Page/EditPage';

export const Route = createFileRoute('/pages/$pageId/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pageId } = Route.useParams();
  return <EditPage pageId={pageId} />
}
