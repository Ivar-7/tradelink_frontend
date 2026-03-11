import { RouterProvider } from 'react-router-dom';
import ContextProvider from './context_provider';
import router from './routes';

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
}

export default App;
