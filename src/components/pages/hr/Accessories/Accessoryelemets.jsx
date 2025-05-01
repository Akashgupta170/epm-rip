import React from 'react'
// import { Accessories } from './Accessories'
import { AssignAccessoryProvider } from '../../../context/AssignAccessoryContext'
import { EmployeeProvider } from '../../../context/EmployeeContext'
import { AssignAccessoryTable } from './Accessorytable'
import { CategoryProvider } from '../../../context/CategoryContext'

export const Accessoryelements  = () => {
  return (
    <div>
        <AssignAccessoryProvider>
          <CategoryProvider>
              <EmployeeProvider>
                    <AssignAccessoryTable />
              </EmployeeProvider>
            </CategoryProvider>
        </AssignAccessoryProvider>
    </div>
  )
}
