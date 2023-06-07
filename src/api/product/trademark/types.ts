//所有产品相关接口都包含的数据
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//单个品牌数据的数据类型
export interface Trademark {
    id?: number,
    tmName: string,//品牌名称
    logoUrl: string,//品牌logo url
}

//品牌数据数组的ts类型
export type Records = Trademark[];

//查询品牌数据接口返回数据的ts数据类型
export interface TrademarkResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}
