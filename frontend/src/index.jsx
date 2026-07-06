import axios from 'axios';
import './fonts.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
      retry: 1,
    },
  },
});

axios.defaults.withCredentials = true;

axios.defaults.withCredentials = true;

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <BrowserRouter
    future={{
      v7_relativeSplatPath: true, // Улучшенное разрешение относительных путей для сплат-маршрутов
      v7_startTransition: true, // Обёртывание обновлений в React.startTransition для плавности
      v7_fetcherPersist: true, // Сохранение состояния fetchers дольше
      v7_normalizeFormMethod: true, // Приведение методов форм к верхнему регистру
      v7_partialHydration: true, // Поддержка частичной гидратации
      v7_skipActionErrorRevalidation: true, // Пропуск повторной проверки загрузчиков после ошибок действий
    }}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <App />
        </DndProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>
);
