import { IRouterConfig } from 'ice';
import BasicLayout from '@/layouts/BasicLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import Lists from '@/pages/Lists';
import Videos from '@/pages/Videos';
import LoginWrapper from '@/components/LoginWrapper/';

const routerConfig: IRouterConfig[] = [
  { path: '/notfound', component: NotFound },
  {
    path: "/user",
    children: [
      { path: '/register', component: Register },
      { path: '/login', component: Login },
    ]
  },
  {
    path: '/details',
    component: BasicLayout,
    wrappers: [LoginWrapper],
    children: [
      { path: '/lists', component: Lists },
      { path: '/videos', component: Videos },
    ],
  },
  {
    path: '/',
    redirect: '/details/dashboard',
  },
];

export default routerConfig;
