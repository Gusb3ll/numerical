import { useAtom } from 'jotai'

import AppLayout from '@/components/Layouts/App'
import CramerScene from '@/scenes/Linear/Cramer'
import GaussJordanScene from '@/scenes/Linear/GaussJordan'
import GaussianScene from '@/scenes/Linear/Gaussian'
import InversionScene from '@/scenes/Linear/Inversion'
import LUDecompositionScene from '@/scenes/Linear/LUDecomposition'
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
        // Root
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
      ) : // Linear
      currentMethod === Method.CRAMER_RULE ? (
        <CramerScene />
      ) : currentMethod === Method.GAUSSIAN_ELIMINATION ? (
        <GaussianScene />
      ) : currentMethod === Method.GAUSS_JORDAN_ELIMINATION ? (
        <GaussJordanScene />
      ) : currentMethod === Method.MATRIX_INVERSION ? (
        <InversionScene />
      ) : currentMethod === Method.LU_DECOMPOSITION ? (
        <LUDecompositionScene />
      ) : (
        <></>
      )}
    </AppLayout>
  )
}

export default Home
