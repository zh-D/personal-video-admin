import { useHistory } from 'ice';
import React, { useState } from 'react';
import { Input, Message, Form, Loading } from '@alifd/next';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';
import store from "@/store"

const { Item } = Form;

export interface IDataSource {
  email: string;
  password: string;
}

interface LoginProps {
  dataSource?: IDataSource;
}

const LoginBlock: React.FunctionComponent<LoginProps> = (
): JSX.Element => {

  const [, userDispatchers] = store.useModel('user');
  const { login: { isLoading, error: loginError } } = store.useModelEffectsState('user');
  const history = useHistory()
  const [values, setValue] = useState<IDataSource>({ email: "", password: "" });

  const formChange = (values: IDataSource) => {
    setValue(values);
  };

  const handleSubmit = async (values: IDataSource, errors: []) => {
    if (errors) {
      console.log('errors', errors);
      return;
    }
    console.log('values:', values);
    await userDispatchers.login(values)
    console.log(loginError);
    
    if (loginError) {
      Message.error('登录失败');
    } else {
      Message.success('登录成功');
      history.push('/details/dashboard');
    }

  };

  return (
    <div className={styles.LoginBlock}>
      <div className={styles.innerBlock} >
        <a href="#">
          <img
            className={styles.logo}
            src="https://img.alicdn.com/tfs/TB1KtN6mKH2gK0jSZJnXXaT1FXa-1014-200.png"
            alt="logo"
          />
        </a>

        {isLoading && <Loading />}

        <Form value={values} onChange={formChange} size="large" style={{ marginTop: 10 }}>
          <Item required requiredMessage="必填">
            <Input name="email" maxLength={20} placeholder="邮箱" />
          </Item>
          <Item required requiredMessage="必填" style={{ marginBottom: 10 }}>
            <Input.Password name="password" htmlType="password" placeholder="密码" />
          </Item>

          <Item style={{ marginBottom: 10, marginTop: 10 }}>
            <Form.Submit
              type="primary"
              onClick={handleSubmit}
              className={styles.submitBtn}
              validate
            >
              登录
            </Form.Submit>
          </Item>
          <div className={styles.infoLine}>
            <Link to="/user/notfound" className={styles.link}>
              忘记密码
            </Link>
            <Link to="/user/register" className={styles.link}>
              注册账号
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginBlock;
