import { IRouterConfig } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Video from '@/pages/Video';
import List from '@/pages/List';
import NotFound from '@/pages/NotFound';
import Lists from '@/pages/Lists';
import Videos from '@/pages/Videos';

const routerConfig: IRouterConfig[] = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/list/:listId', component: List },
  { path: '/video/:videoId', component: Video },
  { path: '/notfound', component: NotFound },
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '/lists', component: Lists },
      { path: '/videos', component: Videos },
    ],
  },
];

export default routerConfig;
