/*redux最核心的管理对象模块,代码固定的*/
import {createStore,applyMiddleware} from "redux"
import thunk from "redux-thunk"
/*引入控制中间件*/
import {composeWithDevTools} from "redux-devtools-extension"
import reducers from "./reducers"

export default createStore(reducers,composeWithDevTools(applyMiddleware(thunk)))
