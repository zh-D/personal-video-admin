import React from 'react';
import { Overlay, Menu, Icon, Avatar } from '@alifd/next';
import styles from './index.module.scss';

import store from '@/store';

const { Item } = Menu;
const { Popup } = Overlay;

export interface Props {
  name: string;
  avatar: string;
  mail: string;
}

const UserProfile = ({ username, avatar, email }) => {
  return (
    <div className={styles.profile}>
      <div className={styles.avatar}>
        <Avatar src={avatar} alt="用户头像" />
      </div>
      <div className={styles.content}>
        <h4>{username}</h4>
        <span>{email}</span>
      </div>
    </div>
  );
};

const HeaderAvatar = (props: Props) => {
  const { name, avatar } = props;
  const [userState, userDispatchers] = store.useModel('user');
  return (
    <Popup
      trigger={
        <div className={styles.headerAvatar}>
          <Avatar size="small" src={avatar} alt="用户头像" />
          <span style={{ marginLeft: 10 }}>{userState.username}</span>
        </div>
      }
      triggerType="click"
    >
      <div className={styles.avatarPopup}>
        <UserProfile {...userState} />
        <Menu className={styles.menu}>
          <Item><Icon size="small" type="account" />个人设置</Item>
          <Item><Icon size="small" type="set" />系统设置</Item>
          <Item onClick={() => { userDispatchers.logout() }}><Icon size="small" type="exit" />退出</Item>
        </Menu>
      </div>
    </Popup>
  );
};

HeaderAvatar.defaultProps = {
  name: 'MyName',
  mail: 'name@gmail.com',
  avatar: 'https://img.alicdn.com/tfs/TB1.ZBecq67gK0jSZFHXXa9jVXa-904-826.png',
};

export default HeaderAvatar;