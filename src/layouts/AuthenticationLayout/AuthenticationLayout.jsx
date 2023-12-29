import React from 'react'
import { Outlet } from 'react-router-dom'

const AuthenticationLayout = () => {
    return (
        <div>
            Authorization Layout
            <Outlet />
        </div>
    )
}

export default AuthenticationLayout
