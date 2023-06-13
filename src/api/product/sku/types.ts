//SKU管理相关数据类型

export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

export interface SKUData {
    id?: number,
    category3id: number | string,
    spuId: number | string,
    tmId: number | string,
    skuName: string,
    price: number | string,
    weight: number | string,
    skuDesc: string,
    skuDefaultImg: string,
    isSale: number,
    skuImageList: any[],
    skuAttrValueList: [{
        id?: number,
        attrId: number | string,
        valueId: number | string,
        valueName: string
    }],
    skuSaleAttrValueList: [{
        id?: number,
        saleAttrId: number | string,
        saleAttrValueId: number | string,
        saleAttrValueName: string
    }]
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

//获取SKU商品详情接口的ts类型
export interface SkuInfoData extends ResponseData {
    data: SKUData
}
