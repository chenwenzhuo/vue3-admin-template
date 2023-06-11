//SPU管理模块的接口
import request from "@/utils/request";
import type {
    AllTrademarkResponseData, ExistingSaleAttrResponseData,
    ExistingSPUResponseData, ImageListResponseData,
    SaleAttrResponseData, SPUData
} from "@/api/product/spu/types";

enum API {
    EXISTING_SPU_URL = '/admin/product',//获取已有SPU
    ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',//获取所有品牌数据
    IMAGE_URL = '/admin/product/spuImageList',//获取某个SPU下所有商品图片
    EXISTING_SPU_SALE_ATTR_URL = '/admin/product/spuSaleAttrList',//获取某个SPU下所有销售属性
    ALL_SALE_ATTR_URL = '/admin/product/baseSaleAttrList',//获取整个项目全部的销售属性[颜色、版本、尺码]
    ADD_SPU_URL = '/admin/product/saveSpuInfo',//添加新的SPU
    UPDATE_SPU_URL = '/admin/product/updateSpuInfo',//更新已有SPU
}

//获取已有SPU
export const reqExistingSPU = (page: number, limit: number, category3Id: number | string) =>
    request.get<any, ExistingSPUResponseData>(`${API.EXISTING_SPU_URL}/${page}/${limit}?category3Id=${category3Id}`);

//获取所有品牌数据
export const reqAllTrademark = () => request.get<any, AllTrademarkResponseData>(API.ALL_TRADEMARK_URL);

//获取某个SPU下所有商品图片
export const reqSPUImageList = (spuId: number) => request.get<any, ImageListResponseData>(`${API.IMAGE_URL}/${spuId}`);

//获取某个SPU下所有销售属性
export const reqExistingSPUSaleAttr = (spuId: number) =>
    request.get<any, SaleAttrResponseData>(`${API.EXISTING_SPU_SALE_ATTR_URL}/${spuId}`);

//获取整个项目全部的销售属性[颜色、版本、尺码]
export const reqAllSaleAttr = () => request.get<any, ExistingSaleAttrResponseData>(API.ALL_SALE_ATTR_URL);

//添加新的SPU、更新已有SPU
export const reqAddOrUpdateSPU = (data: SPUData) => {
    if (!!data.id) {//有id属性，发送更新请求
        return request.post<any, any>(API.UPDATE_SPU_URL, data);
    } else {//没有id属性，发送新增请求
        return request.post<any, any>(API.ADD_SPU_URL, data);
    }
}
