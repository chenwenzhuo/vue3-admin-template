//用户管理相关数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//用户数据对象类型
export interface UserData {
    id?: number,
    createTime?: string,
    updateTime?: string,
    username: string,
    password?: string,
    name?: string,
    phone?: string,
    roleName: string
}

//用户查询接口返回数据类型
export interface UserInfoResponseData extends ResponseData {
    data: {
        records: UserData[],
        total: number,
        size: number,
        current: number,
        pages: number
    }
}
