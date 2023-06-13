//SKU管理相关接口
import request from "@/utils/request";
import type {SKUResponseData} from "@/api/product/sku/types";

enum API {
    SKU_LIST_URL = '/admin/product/list',//获取所有SKU数据
}

//获取所有SKU数据
export const reqSKUList = (page: number, limit: number) =>
    request.get<any, SKUResponseData>(`${API.SKU_LIST_URL}/${page}/${limit}`);
