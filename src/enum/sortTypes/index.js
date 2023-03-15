import Enum from "../index.js"
// 枚举类： 排序类型
export const sortTypes = new Enum([
  {key: 'SMART_SORTING', name: '智能排序',value: '0',icon:'switch'},
  {key: 'DISTANCE_CLOSEST', name: '距离最近',value: '5',icon:'dingwei'},
  {key: 'SALES_HIGHEST', name: '销量最高',value: '6',icon:'hot'},
  {key: 'STARTING_PRICE_LOWEST', name: '起送价最低',value: '1',icon:'price'},
  {key: 'DELIVERY_SPEED_FASTEST', name: '配送速度最快',value: '2',icon:'shijian'},
  {key: 'SCORE_HIGHEST', name: '评分最高',value: '3',icon:'star'},
])