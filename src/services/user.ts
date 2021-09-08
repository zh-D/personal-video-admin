import { request } from 'ice';

export default {
    // 简单场景
    async login(user) {
        return await request.post('/api/auth/login', user);
    },
}