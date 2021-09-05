import { IRouterConfig } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';
import Lists from '@/pages/Lists';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Videos from '@/pages/Videos';
import Video from '@/pages/Video';
import NewVideo from '@/pages/NewVideo';
import List from '@/pages/List';
import NewList from '@/pages/NewList';

const routerConfig: IRouterConfig[] = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/list/:listId', component: List },
  { path: '/video/:videoId', component: Video },
  {
    path: '/',
    component: BasicLayout,
    children: [
      { path: '/lists', component: Lists },
      { path: '/videos', component: Videos },
      { path: '/newVideo', component: NewVideo },
      { path: '/newlist', component: NewList },
      { path: '/', exact: true, component: Lists },
    ],
  },
];

export default routerConfig;
