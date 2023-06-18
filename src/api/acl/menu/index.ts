//菜单管理相关接口
import request from "@/utils/request";
import type {MenuResponseData} from "@/api/acl/menu/types";

//枚举地址
enum API {
    ALL_MENU_URL = '/admin/acl/permission',//获取全部菜单与按钮的标识数据
    ADD_MENU_URL = '/admin/acl/permission/save',//给某一级菜单新增一个子菜单
    UPDATE_MENU_URL = '/admin/acl/permission/update',//更新某一个已有的菜单
    DELETE_MENU_URL = '/admin/acl/permission/remove'//删除已有的菜单
}

//获取菜单数据
export const reqAllMenus = () => request.get<any, MenuResponseData>(API.ALL_MENU_URL);
