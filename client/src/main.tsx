import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import './index.css';
import './App.css';
import { routeTree } from './routeTree.gen';
import { store } from './store/store.ts';
import NavBar from './components/NavBar.tsx';


const router = createRouter({ routeTree });
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router,
  }
};

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <Provider store={store}>
        <MantineProvider defaultColorScheme="dark">
          <NavBar />
          <RouterProvider router={router} />
        </MantineProvider>
      </Provider>
    </StrictMode>,
  );
}
