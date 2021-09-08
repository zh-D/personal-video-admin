export default {
    // 简单场景
    async createList(data) {

        const res = await fetch(`/api/lists`, {
            headers: {
                'Content-Type': 'application/json',
                token: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        console.log(await res.json());
    }
}