import axios from "axios"
export function getUser() {
    if (!window.currUser) {
        axios({
            method: "post",
            url: "/Account/GetInfo",
            data: {}
        }).then(resp => {
            var data = resp.data
            if (data.code == 0) {
                window.currUser = data.data;
                // window.currUser = data.data.user;
            }
        }).catch();
    }
    return window.currUser.user;
}
export function getAll(id) {
    if (!window.allInfo) {
        axios(
            {
                method: 'post',
                url: '/Home/GetDesignPro?parameter=' + id
            }
        ).then(resp =>{
            window.allInfo = resp.data;
        }).catch();
    }
    return window.allInfo
}
export default {
    getUser,
    getAll
}