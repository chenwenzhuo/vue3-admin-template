//用户管理相关接口
import request from "@/utils/request";
import type {UserData, UserInfoResponseData} from "@/api/acl/user/types";

enum API {
    USER_INFO_URL = '/admin/acl/user',//查询所有用户
    ADD_USER_URL = "/admin/acl/user/save",//添加一个新的用户
    UPDATE_USER_URL = "/admin/acl/user/update",//更新已有的用户
}

//查询所有用户
export const reqUsersInfo = (pageNo: number, limit: number) =>
    request.get<any, UserInfoResponseData>(`${API.USER_INFO_URL}/${pageNo}/${limit}`);

//添加一个新的用户或更新已有的用户
export const reqAddOrUpdateUser = (data: UserData) => {
    //数据有id时执行更新，否则执行新增
    if (!!data.id) {
        return request.put<any, any>(API.UPDATE_USER_URL, data);
    } else {
        return request.post<any, any>(API.ADD_USER_URL, data);
    }
}
