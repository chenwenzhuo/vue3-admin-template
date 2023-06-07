//定义用户相关数据的TS类型
//登录接口携带的参数ts类型
export interface loginFormData {
    username: string,
    password: string,
}

//定义全部接口返回数据都包含的TS类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//登录接口返回的数据类型
export interface loginResponseData extends ResponseData {
    data: string,
}

//服务器返回用户信息相关的数据类型
export interface userInfoResponseData extends ResponseData {
    data: {
        routes: string[],
        roles: string[],
        buttons: string[],
        name: string,
        avatar: string
    }
}
