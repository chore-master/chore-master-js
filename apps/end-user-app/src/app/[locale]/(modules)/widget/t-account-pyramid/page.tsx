'use client'

import ModuleFunction, {
  ModuleFunctionBody,
  ModuleFunctionHeader,
} from '@/components/ModuleFunction'
import Graph from './Graph'

export default function Page() {
  return (
    <ModuleFunction>
      <ModuleFunctionHeader title="T-Account Pyramid" />
      <ModuleFunctionBody>
        <Graph />
      </ModuleFunctionBody>
    </ModuleFunction>
  )
}
