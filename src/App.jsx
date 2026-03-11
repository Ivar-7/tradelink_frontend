import { RouterProvider } from 'react-router-dom';
import ContextProvider from './shared/providers/ContextProvider';
import router from './routes';

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
}

export default App;
