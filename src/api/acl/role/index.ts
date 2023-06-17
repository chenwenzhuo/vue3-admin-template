//角色管理相关接口
import request from "@/utils/request";
import type {RoleResponseData} from "@/api/acl/role/types";

enum API {
    ALL_ROLE_URL = '/admin/acl/role',//获取全部的职位
}

//获取全部的职位
export const reqAllRoles = (pageNo: number, limit: number, roleName: string) =>
    request.get<any, RoleResponseData>(`${API.ALL_ROLE_URL}/${pageNo}/${limit}/?roleName=${roleName}`);
