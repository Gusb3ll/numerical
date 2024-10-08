import { useAtom } from 'jotai'

import AppLayout from '@/components/Layouts/App'
import BisectionScene from '@/scenes/Root/Bisection'
import FalsePositionScene from '@/scenes/Root/FalsePosition'
import GraphicalScene from '@/scenes/Root/Graphical'
import NewtonScene from '@/scenes/Root/Newton'
import OnePointScene from '@/scenes/Root/OnePoint'
import SecantScene from '@/scenes/Root/Secant'
import { Method, methodAtom } from '@/utils'

const Home = () => {
  const [currentMethod] = useAtom(methodAtom)

  return (
    <AppLayout>
      {currentMethod === Method.GRAPHICAL ? (
        <GraphicalScene />
      ) : currentMethod === Method.BISECTION ? (
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
