import About from './shared/pages/About'
import ArticleList from './shared/pages/Article/ArticleList'
import ArticleDetail from './shared/pages/Article/ArticleDetail'
import MediaList from './shared/pages/Lecture/MediaList'
import LectureDetail from './shared/pages/Lecture/LectureDetail'
import Home from './shared/pages/Home'
import ThemePage from './shared/pages/ThemePage'
import Search from './shared/pages/Search/Search'

const Routes = [
  {
    path: '/about',
    component: About
  },
  {
    path: '/articles/:cateId/:subCateId?',
    component: ArticleList
  },
  {
    path: '/article/:id',
    component: ArticleDetail
  },
  {
    path: '/media/:cateId/:subCateId?',
    component: MediaList
  },
  {
    path: '/lecture/:id',
    component: LectureDetail
  },
  {
    path: '/page/:id',
    component: ThemePage
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/',
    component: Home
  }
]

export default Routes
