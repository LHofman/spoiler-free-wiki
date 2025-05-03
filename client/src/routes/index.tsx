import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  loader: () => {
    throw redirect({
      to: '/pages/$pageId',
      params: { pageId: '6808fd7b71fcf4b8e2dd56a7' }
    })
  }
});