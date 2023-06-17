//角色管理相关接口
import request from '@/utils/request';
import type {PermissionResponseData, RoleData, RoleResponseData} from '@/api/acl/role/types';

enum API {
    ALL_ROLE_URL = '/admin/acl/role',//获取全部的职位
    ADD_ROLE_URL = '/admin/acl/role/save',//新增岗位的接口地址
    UPDATE_ROLE_URL = '/admin/acl/role/update',//更新已有的职位
    ALL_PERMISSIONS_URL = '/admin/acl/permission/toAssign',//获取全部的菜单与按钮的数据
    SET_PERMISSIONS_URL = '/admin/acl/permission/doAssign',//给相应的职位分配权限
    REMOVE_ROLE_URL = '/admin/acl/role/remove'//删除已有的职位
}

//获取全部的职位
export const reqAllRoles = (pageNo: number, limit: number, roleName: string) =>
    request.get<any, RoleResponseData>(`${API.ALL_ROLE_URL}/${pageNo}/${limit}/?roleName=${roleName}`);

//添加职位与更新已有职位接口
export const reqAddOrUpdateRole = (data: RoleData) => {
    if (!!data.id) {
        return request.put<any, any>(API.UPDATE_ROLE_URL, data);
    } else {
        return request.post<any, any>(API.ADD_ROLE_URL, data);
    }
}

//获取全部菜单与按钮权限数据
export const reqPermissionList = (roleId: number) =>
    request.get<any, PermissionResponseData>(`${API.ALL_PERMISSIONS_URL}/${roleId}`);

//给相应的职位下发权限
export const reqSetPermissions = (roleId: number, permissionId: number[]) =>
    request.post(`${API.SET_PERMISSIONS_URL}/?roleId=${roleId}&permissionId=${permissionId}`);

//删除已有的职位
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(`${API.REMOVE_ROLE_URL}/${roleId}`);
