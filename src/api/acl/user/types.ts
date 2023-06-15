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

//代表一个职位的ts类型
export interface RoleData {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName: string,
    remark: null
}

//全部职位的列表
export type RoleList = RoleData[];

//获取全部职位的接口返回的数据ts类型
export interface AllRolesResponseData extends ResponseData {
    data: {
        assignRoles: RoleList,
        allRolesList: RoleList
    }
}

export interface SetRoleData {
    roleIdList: number[],
    userId: number
}
