import { useAtom } from 'jotai'

import { Method, Problem, currentProblemAtom, methodAtom } from '@/utils'

const Navbar = () => {
  const [currentProblem, setCurrentProblem] = useAtom(currentProblemAtom)
  const [currentMethod, setCurrentMethod] = useAtom(methodAtom)

  return (
    <nav className="flex w-full flex-row items-center justify-between px-6 py-2 shadow-lg">
      <div className="flex flex-row items-center gap-8">
        <h1
          className="cursor-pointer select-none text-[24px] font-bold md:text-[32px]"
          onClick={() => {
            setCurrentProblem(null)
            setCurrentMethod(null)
          }}
        >
          [ Numerical ]
        </h1>
        <select
          className="w-[150px] border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2 text-sm focus:outline-none focus:ring-0"
          onChange={e => {
            setCurrentMethod(null)
            setCurrentProblem(+e.currentTarget.value)
          }}
          value={currentProblem ? currentProblem : ''}
        >
          <option disabled value="">
            Choose problems
          </option>
          <option value={Problem.ROOT}>Root of Equation</option>
          <option value={Problem.LINEAR_ALGEBRA}>Linear Algebra</option>
          <option value={Problem.INTERPOLATION}>Interpolation</option>
          <option value={Problem.EXTRAPOLATION}>Extrapolation</option>
          <option value={Problem.INTEGRATION}>Integration</option>
          <option value={Problem.DIFFERENTIATION}>Differentiation</option>
        </select>
        <select
          className="w-[150px] border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2 text-sm focus:outline-none focus:ring-0"
          onChange={e => setCurrentMethod(+e.currentTarget.value)}
          value={currentMethod ? currentMethod : ''}
        >
          <option disabled value="">
            Choose methods
          </option>
          {currentProblem === Problem.ROOT ? (
            <>
              <option value={Method.GRAPHICAL}>Graphical</option>
              <option value={Method.BISECTION}>Bisection</option>
              <option value={Method.FALSE_POSITION}>False Position</option>
              <option value={Method.NEWTON}>Newton</option>
              <option value={Method.SECANT}>Secant</option>
              <option value={Method.ONE_POINT_ITERATION}>
                One-Point Iteration
              </option>
            </>
          ) : currentProblem === Problem.LINEAR_ALGEBRA ? (
            <>
              <option value={Method.CRAMER_RULE}>Cramer&apos;s Rule</option>
              <option value={Method.GAUSSIAN_ELIMINATION}>
                Gaussian Elimination
              </option>
              <option value={Method.GAUSS_JORDAN_ELIMINATION}>
                Gauss-Jordan Elimination
              </option>
              <option value={Method.MATRIX_INVERSION}>Matrix Inversion</option>
              <option value={Method.LU_DECOMPOSITION}>LU Decomposition</option>
              <option value={Method.JACOBI_ITERATION}>Jacobi Iteration</option>
              <option value={Method.GAUSS_SEIDEL_ITERATION}>
                Gauss-Seidel Iteration
              </option>
              <option value={Method.CONJUGATE_GRADIENT}>
                Conjugate Gradient
              </option>
            </>
          ) : currentProblem === Problem.INTERPOLATION ? (
            <>
              <option value={Method.NEWTON_DIVIDED_DIFFERENCE}>
                Newton Divided Difference
              </option>
              <option value={Method.LAGRANGE_INTERPOLATION}>
                Lagrange Interpolation
              </option>
              <option value={Method.SPLINE_INTERPOLATION}>
                Spline Interpolation
              </option>
            </>
          ) : currentProblem === Problem.EXTRAPOLATION ? (
            <>
              <option value={Method.SIMPLE_REGRESSION}>
                Simple Regression
              </option>
              <option value={Method.MULTIPLE_REGRESSION}>
                Multiple Regression
              </option>
            </>
          ) : currentProblem === Problem.INTEGRATION ? (
            <>
              <option value={Method.TRAPEZOIDAL_RULE}>Trapezoidal Rule</option>
              <option value={Method.COMPOSITE_TRAPEZOIDAL_RULE}>
                Composite Trapezoidal Rule
              </option>
              <option value={Method.SIMPSON_RULE}>Simpson Rule</option>
              <option value={Method.COMPOSITE_SIMPSON_RULE}>
                Composite Simpson Rule
              </option>
            </>
          ) : currentProblem === Problem.DIFFERENTIATION ? (
            <>
              <option value={Method.NUMERICAL_DIFFERENTIATION}>
                Numerical Differentiation
              </option>
            </>
          ) : (
            <></>
          )}
        </select>
      </div>
      {/* <div>
        <FaUser className="text-[32px]" />
      </div> */}
    </nav>
  )
}

export default Navbar
