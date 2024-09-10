import { useAtom } from 'jotai'

import AppLayout from '@/components/Layouts/App'
import BisectionScene from '@/scenes/Bisection'
import FalsePositionScene from '@/scenes/FalsePosition'
import NewtonScene from '@/scenes/Newton'
import OnePointScene from '@/scenes/OnePoint'
import SecantScene from '@/scenes/Secant'
import { Method, methodAtom } from '@/utils'

const Home = () => {
  const [currentMethod] = useAtom(methodAtom)

  return (
    <AppLayout>
      {currentMethod === Method.BISECTION ? (
        <BisectionScene />
      ) : currentMethod === Method.FALSE_POSITION ? (
        <FalsePositionScene />
      ) : currentMethod === Method.NEWTON ? (
        <NewtonScene />
      ) : currentMethod === Method.SECANT ? (
        <SecantScene />
      ) : currentMethod === Method.ONE_POINT_ITERATION ? (
        <OnePointScene />
      ) : (
        <></>
      )}
    </AppLayout>
  )
}

export default Home
