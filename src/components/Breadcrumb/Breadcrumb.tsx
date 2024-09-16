import React from 'react'
import { Link } from 'react-router-dom'
import './Breadcrumb.css'

interface BreadcrumbProps {
  path: string[]
  title: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ path }) => {
  if (path.length === 0) return null

  return (
    <nav className="breadcrumbs-container" aria-label='Breadcrumb'>
      <ol typeof='BreadcrumbList' vocab='https://schema.org/' aria-label='breadcrumbs'>
        {path.map((crumb, index) => {
          const fullPath = `/${path.slice(0, index + 1).join('/')}`

          // 显示首页路径段
          if (index === 0) {
            return (
              <li key={index} property='itemListElement' typeof='ListItem'>
                <Link to='/' property='item' typeof='WebPage' className='breadcrumb'>
                  <span property='name'>首页</span>
                </Link>
                <meta property='position' content={(index + 1).toString()} />
              </li>
            )
          }

          // 最后一个路径段
          if (index === path.length - 1) {
            return (
              <li key={index} property='itemListElement' typeof='ListItem'>
                <span property='name'>{crumb}</span>
                <meta property='position' content={(index + 1).toString()} />
              </li>
            )
          }

          // 中间路径段
          return (
            <li key={index} property='itemListElement' typeof='ListItem'>
              <Link to={fullPath} property='item' typeof='WebPage' className='breadcrumb'>
                <span property='name'>{crumb}</span>
              </Link>
              <meta property='position' content={(index + 1).toString()} />
            </li>
          )
        })}
      </ol>
    </nav>
  )
}


export default Breadcrumb
