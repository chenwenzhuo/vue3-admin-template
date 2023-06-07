//品牌管理相关接口
import request from "@/utils/request";
import type {Trademark, TrademarkResponseData} from "@/api/product/trademark/types";

//品牌管理接口地址
enum API {
    TRADEMARK_URL = '/admin/product/baseTrademark',//查询已有品牌
    ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',//添加品牌
    UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',//修改品牌
    DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove',//删除品牌
}

//获取已有品牌
//page：要获取的页码，limit：单页数据条数
export const reqExistingTrademark = (page: number, limit: number) =>
    request.get<any, TrademarkResponseData>(`${API.TRADEMARK_URL}/${page}/${limit}`);

//添加、修改品牌
export const reqAddOrUpdateTrademark = (data: Trademark) => {
    if (data.id) {//data中有id属性，修改品牌
        return request.put<any, any>(API.UPDATE_TRADEMARK_URL, data);
    } else {//添加品牌
        return request.post<any, any>(API.ADD_TRADEMARK_URL, data);
    }
}

//删除品牌
export const reqDeleteTrademark = (id: number) => request.delete<any, any>(`${API.DELETE_TRADEMARK_URL}/${id}`);
