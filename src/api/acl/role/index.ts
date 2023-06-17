//角色管理相关接口
import request from "@/utils/request";
import type {RoleData, RoleResponseData} from "@/api/acl/role/types";

enum API {
    ALL_ROLE_URL = '/admin/acl/role',//获取全部的职位
    ADD_ROLE_URL = '/admin/acl/role/save',//新增岗位的接口地址
    UPDATE_ROLE_URL = '/admin/acl/role/update',//更新已有的职位
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
