//菜单管理相关数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//菜单数据与按钮数据的ts类型
export interface Menu {
    id?: number,
    createTime: string,
    updateTime: string,
    pid: number,
    name: string,
    code: null,
    toCode: null,
    type: number,
    status: null,
    level: number,
    children?: MenuList,
    select: boolean
}
export type MenuList = Menu[];

//菜单接口返回的数据类型
export interface MenuResponseData extends ResponseData {
    data: MenuList
}
