import React from "react";

import styles from './Drawer.module.css'

type DrawerProps = {
    children: React.ReactNode
}

function Drawer ({ children }: DrawerProps) {
    return (
        <div className={styles.drawer}>
            {children}
        </div>
    )
}

export default Drawer;