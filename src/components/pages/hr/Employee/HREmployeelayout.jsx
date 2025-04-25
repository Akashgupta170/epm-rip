import React from 'react'

import { EmployeeProvider } from '../../../context/EmployeeContext';
import { TeamProvider } from '../../../context/TeamContext';
import { RoleProvider } from '../../../context/RoleContext';
import HREmployeemanagment from './HREmployeemanagment';
export const HREmployeelayout = () => {
  return (
    <div>
        <EmployeeProvider>
   <TeamProvider>
    <RoleProvider>
                <HREmployeemanagment/>
                </RoleProvider>
                </TeamProvider>
            </EmployeeProvider>
  
    </div>
  )
}