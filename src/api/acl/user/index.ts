//用户管理相关接口
import request from '@/utils/request';
import type {AllRolesResponseData, SetRoleData, UserData, UserInfoResponseData} from '@/api/acl/user/types';

enum API {
    USER_INFO_URL = '/admin/acl/user',//查询所有用户
    ADD_USER_URL = '/admin/acl/user/save',//添加一个新的用户
    UPDATE_USER_URL = '/admin/acl/user/update',//更新已有的用户
    ALL_ROLES_URL = '/admin/acl/user/toAssign/',//获取全部职位，及当前账号拥有的职位
    SET_ROLE_URL = '/admin/acl/user/doAssignRole',//给已有的用户分配角色
    DELETE_USER_URL = '/admin/acl/user/remove/',//删除某一个账号
    DELETE_USER_BATCH_URL = '/admin/acl/user/batchRemove'//批量删除
}

//查询所有用户
export const reqUsersInfo = (pageNo: number, limit: number, username: string) =>
    request.get<any, UserInfoResponseData>(`${API.USER_INFO_URL}/${pageNo}/${limit}/?username=${username}`);

//添加一个新的用户或更新已有的用户
export const reqAddOrUpdateUser = (data: UserData) => {
    //数据有id时执行更新，否则执行新增
    if (!!data.id) {
        return request.put<any, any>(API.UPDATE_USER_URL, data);
    } else {
        return request.post<any, any>(API.ADD_USER_URL, data);
    }
}

//获取全部职位，及当前账号拥有的职位
export const reqAllRoles = (userId: number) => request.get<any, AllRolesResponseData>(`${API.ALL_ROLES_URL}/${userId}`);

//给已有的用户分配角色
//分配职位
export const reqSetUserRole = (data: SetRoleData) => request.post<any, any>(API.SET_ROLE_URL, data);

//删除某一个账号的信息
export const reqRemoveUser = (userId: number) => request.delete<any, any>(`${API.DELETE_USER_URL}/${userId}`);

//批量删除的
export const reqRemoveUserBatch = (idList: number[]) => request.delete<any, any>(API.DELETE_USER_BATCH_URL, {data: idList});
