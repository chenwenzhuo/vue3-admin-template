//角色管理相关数据类型

export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//一个角色对象的数据类型
export interface RoleData {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName: string,
    remark: string
}

//全部角色的数组类型
export type RoleRecords = RoleData[];

//查询全部角色接口的返回数据类型
export interface RoleResponseData extends ResponseData {
    data: {
        records: RoleRecords,
        total: number,
        size: number,
        current: number,
        orders: [],
        optimizeCountSql: boolean,
        hitCount: boolean,
        countId: null,
        maxLimit: null,
        searchCount: boolean,
        pages: number
    }
}

//菜单与按钮权限数据的ts类型
export interface PermissionData {
    id: number,
    createTime: string,
    updateTime: string,
    pid: number,
    name: string,
    code: string,
    toCode: string,
    type: number,
    status: null,
    level: number,
    children?: PermissionList,
    select: boolean
}

export type PermissionList = PermissionData[];

//菜单权限与按钮权限查询接口的返回数据数据的ts类型
export interface PermissionResponseData extends ResponseData {
    data: PermissionList
}
