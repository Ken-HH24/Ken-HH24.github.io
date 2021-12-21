export interface BasicCascaderData {
    [x: string]: any
    value: string
    key: string
    disabled?: boolean
    children?: BasicCascaderData[]
}

export interface BasicEntity {
    data: BasicCascaderData
    children?: Array<BasicEntity>
    key: string
    pos: string
    parent?: BasicEntity
    parentKey?: string | null
    path?: string[]
    valuePath?: string[]
}