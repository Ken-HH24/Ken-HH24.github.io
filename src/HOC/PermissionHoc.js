import { createContext } from 'react'

// 创建Context
export const PermissionContext = createContext([]);

// 提示页面
const NoPermissionPage = () => {
    return (
        <div>
            no permission
        </div>
    )
}

// authorizeName对应组件的permission名称
const PermissionHoc = (authorizeName) => {
    return function (Component) {
        return function Home(props) {
            return (
                // 对PermissionContext进行消费
                <PermissionContext.Consumer>
                    {
                        ({ permissionList }) => {
                            // 组件存在于名单里，正常渲染
                            if (permissionList.includes(authorizeName))
                                return <Component {...props} />
                            // 组件不存在于名单里，渲染提示页面
                            else
                                return <NoPermissionPage />
                        }
                    }
                </PermissionContext.Consumer>
            )
        }
    }
}

export default PermissionHoc;