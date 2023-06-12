//属性管理相关API
import request from "@/utils/request";
import type {AttrObj, AttrResponseData, CategoryResponseData} from "@/api/product/attr/types";

//属性管理相关请求URL
enum API {
    C1_URL = '/admin/product/getCategory1',//获取一级分类
    C2_URL = '/admin/product/getCategory2',//获取二级分类
    C3_URL = '/admin/product/getCategory3',//获取三级分类
    ATTR_URL = '/admin/product/attrInfoList',//获取分类下已有属性与属性值
    ADD_UPDATE_ATTR_URL = '/admin/product/saveAttrInfo',//添加、修改属性
    DELETE_ATTR_URL = '/admin/product/deleteAttr',//删除属性
}

//获取一级分类
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL);

//获取二级分类
export const reqC2 = (c1Id: number | string) => request.get<any, CategoryResponseData>(`${API.C2_URL}/${c1Id}`);

//获取三级分类
export const reqC3 = (c2Id: number | string) => request.get<any, CategoryResponseData>(`${API.C3_URL}/${c2Id}`);

//获取分类下已有属性与属性值
export const reqAttrs = (c1Id: number | string, c2Id: number | string, c3Id: number | string) =>
    request.get<any, AttrResponseData>(`${API.ATTR_URL}/${c1Id}/${c2Id}/${c3Id}`);

//添加、修改属性
export const reqAddOrUpdateAttr = (data: AttrObj) => request.post<any, any>(API.ADD_UPDATE_ATTR_URL, data);

//删除属性
export const reqDeleteAttr = (attrId: number) => request.delete(`${API.DELETE_ATTR_URL}/${attrId}`);
