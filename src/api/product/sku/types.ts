//SKU管理相关数据类型
import type {SKUData} from "@/api/product/spu/types";

export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//查询所有SKU数据的接口的返回类型
export interface SKUResponseData extends ResponseData {
    data: {
        records: SKUData[],
        total: number,
        size: number,
        current: number,
        pages: number,
        optimizeCountSql: boolean,
        hitCount: boolean,
        searchCount: boolean,
        orders: [],
        countId: null
        maxLimit: null
    }
}
