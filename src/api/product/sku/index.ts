//SKU管理相关接口
import request from "@/utils/request";
import type {SkuInfoData, SKUResponseData} from "@/api/product/sku/types";

enum API {
    SKU_LIST_URL = '/admin/product/list',//获取所有SKU数据
    SALE_URL = "/admin/product/onSale/",//商品上架
    CANCEL_SALE_URL = "/admin/product/cancelSale/",//商品下架
    SKU_INFO_URL = "/admin/product/getSkuInfo/",//获取商品详情
    DELETE_SKU_URL = "/admin/product/deleteSku/"//删除已有的商品
}

//获取所有SKU数据
export const reqSKUList = (page: number, limit: number) =>
    request.get<any, SKUResponseData>(`${API.SKU_LIST_URL}/${page}/${limit}`);

//已有商品上架的请求
export const reqSaleSku = (skuId: number) => request.get<any, any>(`${API.SALE_URL}/${skuId}`);

//下架的请求
export const reqCancelSaleSku = (skuId: number) => request.get<any, any>(`${API.CANCEL_SALE_URL}/${skuId}`);

//获取商品详情的接口
export const reqSkuInfo = (skuId: number) => request.get<any, SkuInfoData>(`${API.SKU_INFO_URL}/${skuId}`);

//删除已有的商品
export const reqRemoveSku = (skuId: number) => request.delete<any, any>(`${API.DELETE_SKU_URL}/${skuId}`);
