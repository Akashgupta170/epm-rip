import React from 'react'
import { AccessoryProvider } from '../../../context/AccessoryContext'
import { Accessorytable } from './Accessorytable'
import { CategoryProvider } from '../../../context/CategoryContext'

export const Accessoryelements = () => {
  return (
    <div>
      <AccessoryProvider>
        <CategoryProvider>
            <Accessorytable />
        </CategoryProvider>
      </AccessoryProvider>
    </div>
  )
}
