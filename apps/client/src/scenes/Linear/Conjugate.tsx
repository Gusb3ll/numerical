/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'katex/dist/katex.min.css'
import { createColumnHelper } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import { useState } from 'react'
import { BlockMath } from 'react-katex'

import { DataTable } from '@/components/DataTable'
import { NotoSansMath } from '@/utils'

const ConjugateScene = () => {
  const [dimension, setDimension] = useState(3)
  const [matrixEqual, setMatrixEqual] = useState<number[]>(
    Array.from({ length: dimension }, () => 0),
  )
  const [matrixStart, setMatrixStart] = useState<number[]>([])
  const [data, setData] = useState<any[]>([])

  const [matrix, setMatrix] = useState<number[][]>(
    Array.from({ length: dimension }, () =>
      Array.from({ length: dimension }, () => 0),
    ),
  )

  const calculateConjugate = (
    n: number,
    matrix: number[][],
    matrixEqual: number[],
    matrixStart: number[],
  ) => {
    const A = matrix.map(row => [...row])
    const X = [...matrixStart]
    let R = Array(n).fill(0)
    let D = Array(n).fill(0)
    const obj = []

    for (let i = 0; i < n; i++) {
      R[i] = matrixEqual[i]
      for (let j = 0; j < n; j++) {
        R[i] -= A[i][j] * X[j]
      }
    }

    D = [...R] // 12 17 14 7
    // console.log(D)

    let iteration = 0
    let e1 = 1
    const MaxIteration = 100
    const e = 0.000001

    while (e1 > e && iteration < MaxIteration) {
      let alpha = 0
      let lamda = 0
      let tempR = 0
      const tempAD = Array(n).fill(0)

      for (let i = 0; i < n; i++) {
        tempR += R[i] * R[i]
        // console.log(tempR)
        for (let j = 0; j < n; j++) {
          tempAD[i] += A[i][j] * D[j]
          // console.log(tempAD)
        }
      }
      let tempDAD = 0
      for (let i = 0; i < n; i++) {
        tempDAD += D[i] * tempAD[i]
        // console.log(tempAD[i])
      }
      lamda = tempR / tempDAD

      // console.log(lamda)

      for (let i = 0; i < n; i++) {
        X[i] = X[i] + lamda * D[i]
        // console.log(X[i])
      }

      const newR = Array(n).fill(0)

      for (let i = 0; i < n; i++) {
        let tempSum = 0
        for (let j = 0; j < n; j++) {
          tempSum += A[i][j] * X[j]
        }
        newR[i] = tempSum - matrixEqual[i]
        // console.log(newR[i])
      }

      e1 = Math.sqrt(newR.reduce((acc, val) => acc + val * val, 0))

      let tempnewR = 0
      let tempnewR1 = 0
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          tempnewR += newR[i] * A[i][j] * D[j]
          tempnewR1 += D[i] * A[i][j] * D[j]
          // console.log(tempnewR1)
        }
      }

      alpha = tempnewR / tempnewR1
      // console.log(alpha)

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          D[i] = alpha * D[i] - newR[i]
          console.log(D[i])
        }
      }

      R = [...newR]

      obj.push({
        iteration: iteration + 1,
        X: [...X],
        R: [...R],
        D: [...D],
        alpha: alpha,
        lamda: lamda,
        error: e1,
      })

      iteration++
    }

    setData(obj)
  }

  const columnHelper = createColumnHelper<any>()
  const columns = [
    columnHelper.accessor('iteration', {
      cell: info => info.getValue(),
      header: 'Iteration',
    }),
    columnHelper.accessor('alpha', {
      cell: info => info.getValue(),
      header: 'Alpha (α)',
    }),
    columnHelper.accessor('lamda', {
      cell: info => info.getValue(),
      header: 'Lamda (λ)',
    }),
    columnHelper.accessor('D', {
      cell: info => (
        <BlockMath
          math={`\\begin{bmatrix} ${info
            .getValue()
            .map((val: number) => val.toFixed(6))
            .join('\\\\')} \\end{bmatrix}`}
        />
      ),
      header: 'D',
    }),
    columnHelper.accessor('X', {
      cell: info => (
        <BlockMath
          math={`\\begin{bmatrix} ${info
            .getValue()
            .map((val: number) => val.toFixed(6))
            .join('\\\\')} \\end{bmatrix}`}
        />
      ),
      header: 'X',
    }),
    columnHelper.accessor('R', {
      cell: info => (
        <BlockMath
          math={`\\begin{bmatrix} ${info
            .getValue()
            .map((val: number) => val.toFixed(6))
            .join('\\\\')} \\end{bmatrix}`}
        />
      ),
      header: 'Residual (R)',
    }),
    columnHelper.accessor('error', {
      cell: info => info.getValue(),
      header: 'Error',
    }),
  ]

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
                calculateConjugate(dimension, matrix, matrixEqual, matrixStart)
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
                  value={matrixStart[i]}
                  onChange={e => {
                    const newResult = [...matrixStart]
                    newResult[i] = parseFloat(e.currentTarget.value)
                    setMatrixStart(newResult)
                  }}
                />
              ))}
            </div>
            <div className="flex flex-col justify-between py-2">
              {Array.from({ length: dimension }, (_, i) => (
                <MathJax inline dynamic key={i}>
                  {'`X_$`'.replaceAll('$', (i + 1).toString())}
                </MathJax>
              ))}
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
          <div className="mt-8 h-full w-full overflow-x-auto">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      )}
    </>
  )
}

export default ConjugateScene
