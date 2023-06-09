//SPU管理模块的数据类型

export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//SPU数据的类型
export interface SPUData {
    id?: number,
    spuName: string,
    tmId: number | string,
    description: string,
    category3Id: number | string,
    spuImageList: SPUImage[] | null,
    spuSaleAttrList: SaleAttr[] | null,
}

//SPU数据数据类型
export type Records = SPUData[];

//查询已有SPU接口返回数据的类型
export interface ExistingSPUResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number,
    }
}

//单个品牌数据的数据类型
export interface Trademark {
    id?: number,
    tmName: string,//品牌名称
    logoUrl: string,//品牌logo url
}

//品牌查询接口返回的数据类型
export interface AllTrademarkResponseData extends ResponseData {
    data: Trademark[]
}

//单个商品图片的数据类型
export interface SPUImage {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    imgName: string,
    imgUrl: string,
}

//图片查询接口返回的数据类型
export interface ImageListResponseData extends ResponseData {
    data: SPUImage[]
}

//单个商品属性的数据类型
export interface SaleAttrValue {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}

//存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[];

//销售属性对象ts类型
export interface SaleAttr {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: SpuSaleAttrValueList
    flag?: boolean,
    saleAttrValue?: string,
}

//属性查询接口返回的数据类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}

//已有的全部SPU的返回数据ts类型
export interface ExistingSaleAttr {
    id: number,
    name: string
}

export interface ExistingSaleAttrResponseData extends ResponseData {
    data: ExistingSaleAttr[]
}
