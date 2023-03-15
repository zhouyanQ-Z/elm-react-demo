import { Fragment, Suspense } from 'react';
import { useRoutes } from 'react-router-dom'
import FooterTabbar from './components/footer-tabbar';
import routes from './routes'

export default function App() {
  // 根据路由表生成对应的路由规则
  const element = useRoutes(routes)
  // console.log(element);
  return (
    <Suspense fallback={<Fragment></Fragment>}>
      <div>
        {element}
        {element.props.match.route.showFooter && <FooterTabbar />}
      </div>
    </Suspense>
  )
}