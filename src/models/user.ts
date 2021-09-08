import userService from '@/services/user';
import { IRootDispatch } from '@/store';

export default {
  // 定义 model 的初始 state
  state: JSON.parse(localStorage.getItem("user")) || {
    accessToken: '',
    username: '',
    profilePic: '',
    isAdmin: false,
  },

  // 定义改变该模型状态的纯函数
  reducers: {
    update(prevState, payload) {
      return {
        ...prevState,
        ...payload,
      };
    },
  },

  // 定义处理该模型副作用的函数
  effects: (dispatch: IRootDispatch) => ({
    async login(user) {
      const data = await userService.login(user)
      localStorage.setItem("user", JSON.stringify(data));
      dispatch.user.update(data);
    },
    async logout() {
      localStorage.removeItem("user")
      dispatch.user.update({
        accessToken: '',
        username: '',
        profilePic: '',
        isAdmin: false,
      });
    },
    async setUser(user) {
      console.log("setUser");

      dispatch.user.update(user);
    },
  }),
};