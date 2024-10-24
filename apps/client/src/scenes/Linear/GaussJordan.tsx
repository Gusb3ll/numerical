import 'katex/dist/katex.min.css'
import { MathJax } from 'better-react-mathjax'
import { useState } from 'react'
import { BlockMath } from 'react-katex'

import { NotoSansMath } from '@/utils'

const GaussJordanScene = () => {
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

  const matrixToLatex = (A: number[][], B: number[]) => {
    let latex = '\\begin{bmatrix} '
    for (let i = 0; i < A.length; i++) {
      latex += A[i].join(' & ') + ' & ' + B[i] + ' \\\\ '
    }
    latex += '\\end{bmatrix}'

    return latex
  }

  const calculateGaussJordan = (
    dim: number,
    matrix: number[][],
    matrixEqual: number[],
  ) => {
    const obj = []
    const stepsArray = []
    const A = matrix.map(row => [...row])
    const B = [...matrixEqual]

    stepsArray.push(`\\text{Matrix A:} \\quad ` + matrixToLatex(A, B))

    for (let i = 0; i < dim; i++) {
      const pivot = A[i][i]
      stepsArray.push(
        `\\text{Give row } ${i + 1}: \\quad \\frac{\\text{Row }${i + 1}}{${pivot}}`,
      )
      for (let j = i; j < dim; j++) {
        A[i][j] /= pivot
      }
      B[i] /= pivot

      stepsArray.push(matrixToLatex(A, B))

      for (let k = 0; k < dim; k++) {
        if (k !== i) {
          const factor = A[k][i]
          stepsArray.push(
            `\\text{Eliminate row } ${k + 1}: \\quad \\text{Row }${k + 1} - (${factor}) \\times \\text{Row }${i + 1}`,
          )

          for (let j = i; j < dim; j++) {
            A[k][j] -= factor * A[i][j]
          }
          B[k] -= factor * B[i]
          Math.round(stepsArray.push(matrixToLatex(A, B)))
        }
      }
    }

    for (let i = dim - 1; i >= 0; i--) {
      obj[i] = {
        Xn: Math.round(B[i]),
      }
      stepsArray.push(`X_{${i + 1}} = ${Math.round(B[i])}`)
    }

    setData(stepsArray)
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
              onChange={e => {
                const currentMatrix = matrix
                const newMatrix = Array.from(
                  { length: +e.currentTarget.value },
                  (_, i) =>
                    Array.from(
                      { length: +e.currentTarget.value },
                      (_, j) => currentMatrix[i]?.[j] ?? 0,
                    ),
                )
                setMatrix(newMatrix)

                setDimension(+e.currentTarget.value)
              }}
            />
            <button
              className="rounded-md bg-green-200 px-4 py-2 transition-all hover:bg-green-300"
              onClick={() =>
                calculateGaussJordan(dimension, matrix, matrixEqual)
              }
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

export default GaussJordanScene