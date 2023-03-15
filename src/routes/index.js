/* 
    专门用于配置路由表
*/
import { Navigate } from 'react-router-dom'
import { lazy } from 'react'

const Msite = lazy(() => import('@/pages/msite'));
const Search = lazy(() => import('@/pages/search'));
const Order = lazy(() => import('@/pages/order'));
const Profile = lazy(() => import('@/pages/profile'));
const Food = lazy(() => import('@/pages/food'));
const Shop = lazy(() => import('@/pages/shop'));
const ShopDetail = lazy(() => import('@/pages/shop/children/shop-detail'));
const FoodDetail = lazy(() => import('@/pages/shop/children/food-detail'));
const ShopSafe = lazy(() => import('@/pages/shop/children/shop-detail/children/shop-safe'));
const Login = lazy(() => import('@/pages/login'));
const Forget = lazy(() => import('@/pages/forget'));
const Location = lazy(() => import('@/pages/location'));
const City = lazy(() => import('@/pages/city'));
const ConfirmOrder = lazy(() => import('@/pages/confirm-order'));
const Remark = lazy(() => import('@/pages/confirm-order/children/remark'));
const Invoice = lazy(() => import('@/pages/confirm-order/children/invoice'));
const ChooseAddress = lazy(() => import('@/pages/confirm-order/children/choose-address'));
const AddAddress = lazy(() => import('@/pages/confirm-order/children/children/add-address'));
const SearchAddress = lazy(() => import('@/pages/confirm-order/children/children/search-address'));
const UserValidation = lazy(() => import('@/pages/confirm-order/children/user-validation'));
const Payment = lazy(() => import('@/pages/confirm-order/children/payment'));
const OrderDetail = lazy(() => import('@/pages/order/children/order-detail'));
const Info = lazy(() => import('@/pages/profile/children/info'));
const SetUsername = lazy(() => import('@/pages/profile/children/setUsername'));
const Address = lazy(() => import('@/pages/profile/children/address'));
const AddressAdd = lazy(() => import('@/pages/profile/children/add'));
const AddDetail = lazy(() => import('@/pages/profile/children/addDetail'));
const Balance = lazy(() => import('@/pages/balance'));
const BalanceDetail = lazy(() => import('@/pages/balance/children/detail'));
const Benefit = lazy(() => import('@/pages/benefit'));
const BenefitDesc = lazy(() => import('@/pages/benefit/children/description'));
const HbHistory = lazy(() => import('@/pages/benefit/children/hbHistory'));
const Exchange = lazy(() => import('@/pages/benefit/children/exchange'));
const Commend = lazy(() => import('@/pages/benefit/children/commend'));
const Coupon = lazy(() => import('@/pages/benefit/children/coupon'));
const Download = lazy(() => import('@/pages/download'));
const Points = lazy(() => import('@/pages/points'));
const PointsDetail = lazy(() => import('@/pages/points/children/detail'));
const VipCard = lazy(() => import('@/pages/vipcard'));
const VipDescription = lazy(() => import('@/pages/vipcard/children/description'));
const UseCard = lazy(() => import('@/pages/vipcard/children/useCard'));
const InvoiceRecord = lazy(() => import('@/pages/vipcard/children/invoiceRecord'));
const Service = lazy(() => import('@/pages/service'));
const QuestionDetail = lazy(() => import('@/pages/service/children/questionDetail'));

const routes = [
  {
    path: '/msite',
    element: <Msite />,
    showFooter: true
  },
  {
    path: '/search',
    element: <Search />,
    showFooter: true
  },
  {
    path: '/order',
    element: <Order />,
    showFooter: true,
    children: [
      {
        path: 'orderDetail',
        element: <OrderDetail />
      }
    ]
  },
  {
    path: '/profile',
    element: <Profile />,
    showFooter: true,
    children: [
      {
        path: 'info',
        element: <Info />,
        children: [
          {
            path: 'setUsername',
            element: <SetUsername />
          },
          {
            path: 'address',
            element: <Address />,
            children: [
              {
                path: 'add',
                element: <AddressAdd />,
                children: [
                  {
                    path: 'addDetail',
                    element: <AddDetail />
                  }
                ]
              }
            ]
          }
        ]
      },
      
    ]
  },
  {
    path: '/food',
    element: <Food />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/forget',
    element: <Forget />
  },
  {
    path: '/location',
    element: <Location />
  },
  {
    path: '/city/:cityId',
    element: <City />
  },
  {
    path: '/shop',
    element: <Shop />,
    children: [
      {
        path: 'shopDetail',
        element: <ShopDetail />,
        children: [
          {
            path: 'shopSafe',
            element: <ShopSafe />
          }
        ],
        exact: true
      },
      {
        path: 'foodDetail',
        element: <FoodDetail />
      }
    ]
  },
  {
    path: '/confirmOrder',
    element: <ConfirmOrder />,
    children: [
      {
        path: 'remark',
        element: <Remark />
      },
      {
        path: 'invoice',
        element: <Invoice />
      },
      {
        path: 'chooseAddress',
        element: <ChooseAddress />,
        children: [
          {
            path: 'addAddress',
            element: <AddAddress />,
            children: [
              {
                path: 'searchAddress',
                element: <SearchAddress />
              }
            ]
          }
        ]
      },
      {
        path: 'userValidation',
        element: <UserValidation />
      },
      {
        path: 'payment',
        element: <Payment />
      },
    ]
  },
  {
    path: '/balance',
    element: <Balance />,
    children: [
      {
        path: 'detail',
        element: <BalanceDetail />
      }
    ]
  },
  {
    path: '/benefit',
    element: <Benefit />,
    children: [
      {
        path: 'hbDescription',
        element: <BenefitDesc />
      },
      {
        path: 'hbHistory',
        element: <HbHistory />
      },
      {
        path: 'exchange',
        element: <Exchange />
      },
      {
        path: 'commend',
        element: <Commend />
      },
      {
        path: 'coupon',
        element: <Coupon />
      },
    ]
  },
  {
    path: 'download',
    element: <Download />
  },
  {
    path: 'points',
    element: <Points />,
    children: [
      {
        path:'detail',
        element: <PointsDetail />
      }
    ]
  },
  {
    path: 'vipcard',
    element: <VipCard />,
    children: [
      {
        path: 'vipDescription',
        element: <VipDescription />
      },
      {
        path: 'useCard',
        element: <UseCard />
      },
      {
        path: 'invoiceRecord',
        element: <InvoiceRecord />
      },
    ]
  },
  {
    path: 'service',
    element: <Service />,
    children: [
      {
        path: 'questionDetail',
        element: <QuestionDetail />
      }
    ]
  },
  {
    path: '/',
    element: <Navigate to="/msite" />
  }
]

export default routes