const pageList = [
  {
    url: '/home',
    name: 'Home',
    nameCn: '首页'
  },
  {
    url: '/my-task',
    name: 'MyTask',
    nameCn: '我的任务'
  },
  {
    name: 'Scheme',
    nameCn: '我的方案',
    children: [
      {
        url: '/my-product-scheme',
        name: 'MyProductScheme',
        nameCn: '产品方案'
      },
      {
        url: '/my-dna-scheme',
        name: 'MyDnascheme',
        nameCn: 'DNA方案'
      }
    ]
  },
  {
    url: '/top-dna-scheme',
    name: 'TopDnaScheme',
    nameCn: '精品DNA'
  },
  {
    url: '/project-household',
    name: 'ProjectHousehold',
    nameCn: '项目户型'
  }
]

export default pageList
