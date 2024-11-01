/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'katex/dist/katex.min.css'
import { useMutation } from '@tanstack/react-query'
import { MathJax } from 'better-react-mathjax'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { toast } from 'sonner'

import { randomMatrix } from '@/services/linear'
import { NotoSansMath } from '@/utils'

const LUDecompositionScene = () => {
  const [dimension, setDimension] = useState(3)
  const [matrixEqual, setMatrixEqual] = useState<number[]>(
    Array.from({ length: dimension }, () => 0),
  )
  const [data, setData] = useState<string[]>([])

  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: dimension }, () =>
      Array.from({ length: dimension }, () => 0),
    ),
  )

  const matrixToLatex = (matrix: number[][] | number[]) => {
    if (Array.isArray(matrix[0])) {
      let latex = '\\begin{bmatrix} '
      for (let i = 0; i < matrix.length; i++) {
        // @ts-expect-error
        latex += matrix[i].join(' & ') + ' \\\\ '
      }
      latex += '\\end{bmatrix}'

      return latex
    } else {
      let latex = '\\begin{bmatrix} '
      for (let i = 0; i < matrix.length; i++) {
        latex += matrix[i] + ' \\\\ '
      }
      latex += '\\end{bmatrix}'

      return latex
    }
  }

  const calculateLU = (
    n: number,
    matrix: number[][],
    matrixEqual: number[],
  ) => {
    const A = matrix.map(row => [...row])
    const B = [...matrixEqual]
    let stepsArray = []

    const L = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0))
    const U = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0))
    const Y = Array(n).fill(0)
    const X = Array(n).fill(0)

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (j < i) {
          L[i][j] = `l{${i + 1}${j + 1}}`
        } else if (i === j) {
          L[i][j] = `l{${i + 1}${i + 1}}`
          U[i][j] = `{${1}}`
        } else {
          U[i][j] = `u{${i + 1}${j + 1}}`
        }
      }
    }
    const L_latex = matrixToLatex(L)
    const U_latex = matrixToLatex(U)
    const A_latex = matrixToLatex(A)
    const B_latex = matrixToLatex(B)

    const equationLatex = `A = L \\cdot U = ${L_latex} \\cdot ${U_latex}`
    stepsArray = [equationLatex]

    // LU decomposition
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (j < i) {
          L[j][i] = 0
        } else {
          L[j][i] = A[j][i]
          for (let k = 0; k < i; k++) {
            L[j][i] -= L[j][k] * U[k][i]
          }
        }
      }
      for (let j = 0; j < n; j++) {
        if (j < i) {
          U[i][j] = 0
        } else if (j === i) {
          U[i][j] = 1
        } else {
          if (L[i][i] !== 0) {
            U[i][j] = A[i][j] / L[i][i]
          } else {
            U[i][j] = 0
          }
          for (let k = 0; k < i; k++) {
            U[i][j] -= (L[i][k] * U[k][j]) / (L[i][i] || 1)
          }
        }
      }
    }
    // Forward substitution to solve L * Y = B
    for (let i = 0; i < n; i++) {
      let temp = B[i]
      for (let j = 0; j < i; j++) {
        temp -= L[i][j] * Y[j]
      }
      if (L[i][i] !== 0) {
        Y[i] = temp / L[i][i]
      } else {
        Y[i] = 0
      }
    }
    // Backward substitution to solve U * X = Y
    for (let i = n - 1; i >= 0; i--) {
      let temp = parseFloat(Y[i])
      for (let j = n - 1; j > i; j--) {
        temp -= U[i][j] * X[j]
      }
      if (U[i][i] !== 0) {
        X[i] = temp / U[i][i]
      } else {
        X[i] = 0
      }
    }
    const showtext1 = `\\text{[L][U] = [A]}`
    stepsArray.push(showtext1)
    const L_latex1 = matrixToLatex(L)
    const U_latex1 = matrixToLatex(U)
    const equationLatex1 = `  ${L_latex1} \\cdot ${U_latex1} = ${A_latex} `
    stepsArray.push(equationLatex1)

    const showtext = `\\text{[L][Y] = [B]}`
    stepsArray.push(showtext)

    const equationLatex2 = `  ${L_latex1} \\cdot \\begin{bmatrix} ${Y.map((y, index) => `y_{${index + 1}}`).join(' \\\\ ')} \\end{bmatrix} = ${B_latex} `
    stepsArray.push(equationLatex2)

    const equationLatex3 = `\\begin{bmatrix} ${Y.map((y, index) => `y_{${index + 1}}`).join(' \\\\ ')} \\end{bmatrix} = \\begin{bmatrix} ${Y.map(y => y.toFixed(4)).join(' \\\\ ')} \\end{bmatrix}`
    stepsArray.push(equationLatex3)

    const showtext2 = `\\text{[U][X] = [Y]}`
    stepsArray.push(showtext2)

    const equationLatex4 = `  ${U_latex1} \\cdot \\begin{bmatrix} ${X.map((x, index) => `x_{${index + 1}}`).join(' \\\\ ')} \\end{bmatrix} = \\begin{bmatrix} ${Y.map(y => y.toFixed(4)).join(' \\\\ ')} \\end{bmatrix} `
    stepsArray.push(equationLatex4)

    const solutionLatex = `Solution: \\mathbf{X} = \\begin{bmatrix} ${X.map(x => x.toFixed(0)).join(' \\\\ ')} \\end{bmatrix}`
    stepsArray.push(solutionLatex)

    setData(stepsArray)
  }

  const onDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentMatrix = matrix
    const newMatrix = Array.from({ length: +e.currentTarget.value }, (_, i) =>
      Array.from(
        { length: +e.currentTarget.value },
        (_, j) => currentMatrix[i]?.[j] ?? 0,
      ),
    )
    setMatrix(newMatrix)

    const newEqual = Array.from(
      { length: +e.currentTarget.value },
      (_, i) => matrixEqual[i] ?? 0,
    )
    setMatrixEqual(newEqual)

    setDimension(+e.currentTarget.value)
  }

  const randomMatrixMutation = useMutation({
    mutationFn: () => randomMatrix(dimension),
  })

  const onRandom = async () => {
    try {
      const res = await randomMatrixMutation.mutateAsync()
      setMatrix(res.matrix)
      setMatrixEqual(res.matrixEqual)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <>
      <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-row items-center gap-4">
            <h1 className="text-xl font-bold">Matrix Size</h1>
            <input
              required
              type="number"
              value={dimension}
              min={2}
              className={`border p-2 ${NotoSansMath.className}`}
              onChange={e => onDimensionChange(e)}
            />
            <button
              className="rounded-md bg-teal-400 px-4 py-2 transition-all hover:bg-teal-500"
              onClick={() => onRandom()}
            >
              Random
            </button>
            <button
              className="rounded-md bg-green-200 px-4 py-2 transition-all hover:bg-green-300"
              onClick={() => calculateLU(dimension, matrix, matrixEqual)}
            >
              Calculate
            </button>
          </div>
          <div className="grid-cols-max grid w-full grid-flow-col gap-4">
            {Array.from({ length: dimension }, (_, i) => (
              <div key={i} className="flex w-full flex-col gap-2">
                {Array.from({ length: dimension }, (_, j) => (
                  <input
                    key={j}
                    type="number"
                    className={`w-full border p-2 ${NotoSansMath.className}`}
                    value={matrix[j][i]}
                    onChange={e => {
                      const newMatrix = [...matrix]
                      newMatrix[j][i] = parseFloat(e.currentTarget.value)
                      setMatrix(newMatrix)
                    }}
                  />
                ))}
              </div>
            ))}
            <div className="flex flex-col justify-between py-2">
              {Array.from({ length: dimension }, (_, i) => (
                <MathJax inline dynamic key={i}>
                  {'`X_$`'.replaceAll('$', (i + 1).toString())}
                </MathJax>
              ))}
            </div>
            <div className="flex flex-col justify-center py-2">
              <MathJax inline dynamic>
                {'`=`'}
              </MathJax>
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: dimension }, (_, i) => (
                <input
                  key={i}
                  type="number"
                  className={`w-full border p-2 ${NotoSansMath.className}`}
                  value={matrixEqual[i]}
                  onChange={e => {
                    const newResult = [...matrixEqual]
                    newResult[i] = parseFloat(e.currentTarget.value)
                    setMatrixEqual(newResult)
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {data.length > 0 && (
        <div className="box-shadow-default m-8 my-4 rounded-[12px] p-4">
          {data.map((step, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <BlockMath>{step}</BlockMath>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default LUDecompositionScene
