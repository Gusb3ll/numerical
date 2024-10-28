import { useAtom } from 'jotai'

import AppLayout from '@/components/Layouts/App'
import LagrangeScene from '@/scenes/Interpolation/Lagrange'
import NewtonDividedScene from '@/scenes/Interpolation/NewtonDivided'
import SplineScene from '@/scenes/Interpolation/Spline'
import ConjugateScene from '@/scenes/Linear/Conjugate'
import CramerScene from '@/scenes/Linear/Cramer'
import GaussJordanScene from '@/scenes/Linear/GaussJordan'
import GaussSeidelScene from '@/scenes/Linear/GaussSeidel'
import GaussianScene from '@/scenes/Linear/Gaussian'
import InversionScene from '@/scenes/Linear/Inversion'
import JacobiScene from '@/scenes/Linear/Jacobi'
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
      ) : currentMethod === Method.JACOBI_ITERATION ? (
        <JacobiScene />
      ) : currentMethod === Method.GAUSS_SEIDEL_ITERATION ? (
        <GaussSeidelScene />
      ) : currentMethod === Method.CONJUGATE_GRADIENT ? (
        <ConjugateScene />
      ) : currentMethod === Method.NEWTON_DIVIDED_DIFFERENCE ? (
        <NewtonDividedScene />
      ) : currentMethod === Method.LAGRANGE_INTERPOLATION ? (
        <LagrangeScene />
      ) : currentMethod === Method.SPLINE_INTERPOLATION ? (
        <SplineScene />
      ) : (
        <></>
      )}
    </AppLayout>
  )
}

export default Home
