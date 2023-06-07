//品牌管理相关接口
import request from "@/utils/request";
import type {TrademarkResponseData} from "@/api/product/trademark/types";

//品牌管理接口地址
enum API {
    TRADEMARK_URL = '/admin/product/baseTrademark'
}

//获取已有品牌
//page：要获取的页码，limit：单页数据条数
export const reqExistingTrademark = (page: number, limit: number) =>
    request.get<any, TrademarkResponseData>(`${API.TRADEMARK_URL}/${page}/${limit}`);
