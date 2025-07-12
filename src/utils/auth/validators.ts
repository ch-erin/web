export const validateCredentials = {
    username: (value: string, callback: Function) => {
        if (!value) {
            callback(new Error('用户名不能为空'))
        } else if (value.length < 3) {
            callback(new Error('用户名至少需要 3 个字符'))
        } else {
            callback()
        }
    },

    password: (value: string, callback: Function) => {
        if (!value) {
            callback(new Error('密码不能为空'))
        } else if (value.length < 6) {
            callback(new Error('密码至少需要 6 个字符'))
        } else {
            callback()
        }
    }
}