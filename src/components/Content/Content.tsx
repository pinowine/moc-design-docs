import React from 'react'
import { Outlet } from 'react-router-dom'

const Content: React.FC = () => (
  <main>
    <Outlet />
  </main>
)

export default Content
