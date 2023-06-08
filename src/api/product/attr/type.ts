//分类相关数据的ts类型

export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

//分类ts类型
export interface CategoryObj {
    id: number | string,
    name: string,
    category1Id?: number,
    category2Id?: number,
}

//分类查询接口返回数据的类型
export interface CategoryResponseData extends ResponseData {
    data: CategoryObj[]
}

//属性与属性值ts类型
//属性值对象ts类型。新增属性时，没有id与attrId
export interface AttrValue {
    id?: number,
    valueName: string,
    attrId?: number,
    //属性值表格中，一行数据是否在编辑中的标志
    editFlag?: boolean,
}

//属性值对象数组类型
export type AttrValueList = AttrValue[];

//属性对象
export interface AttrObj {
    id?: number,
    attrName: string,
    categoryId: number | string,
    categoryLevel: number,
    attrValueList: AttrValueList
}

//属性对象数组
export type AttrObjList = AttrObj[];

//属性查询接口返回类型
export interface AttrResponseData extends ResponseData {
    data: AttrObjList
}
