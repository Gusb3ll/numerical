/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'katex/dist/katex.min.css'
import { useMutation } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { MathJax } from 'better-react-mathjax'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { toast } from 'sonner'

import { DataTable } from '@/components/DataTable'
import { randomMatrix } from '@/services/linear'
import { NotoSansMath } from '@/utils'

const GaussSeidelScene = () => {
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

  const calculateGaussSeidel = (
    n: number,
    matrix: number[][],
    matrixEqual: number[],
    matrixStart: number[],
  ) => {
    const data = []

    const MAX_ITERATION = 100
    const e = 0.000001
    const A = matrix.map(row => [...row])
    const X = [...matrixStart]
    let e1 = 1
    let iteration = 0

    while (e1 > e && iteration < MAX_ITERATION) {
      e1 = 0
      const newX = [...matrixStart]

      for (let i = 0; i < n; i++) {
        let temp = 0

        for (let j = 0; j < n; j++) {
          if (i !== j) {
            temp += A[i][j] * X[j]
            console.log(temp)
          }
        }
        newX[i] = (matrixEqual[i] - temp) / A[i][i]
        e1 += Math.abs(newX[i] - X[i])
        X[i] = newX[i]
      }

      iteration++

      data.push({
        iteration,
        X,
        error: e1,
      })
    }

    setData(data)
  }

  const columnHelper = createColumnHelper<any>()
  const columns = [
    columnHelper.accessor('iteration', {
      cell: info => info.getValue(),
      header: 'Iteration',
    }),
    columnHelper.accessor('X', {
      cell: info => (
        <div className="w-fit">
          <BlockMath
            math={`[${info
              .getValue()
              .map((val: number) => val.toFixed(6))
              .join(',')}]`}
          />
        </div>
      ),
      header: () => <div className="ml-12">X</div>,
    }),
    columnHelper.accessor('error', {
      cell: info => <BlockMath math={info.getValue().toFixed(6)} />,
      header: () => <div className="pl-[120px]">Error</div>,
    }),
  ]

  const onDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMatrix = Array.from({ length: +e.currentTarget.value }, (_, i) =>
      Array.from(
        { length: +e.currentTarget.value },
        (_, j) => matrix[i]?.[j] ?? 0,
      ),
    )
    const newEqual = Array.from(
      { length: +e.currentTarget.value },
      (_, i) => matrixEqual[i] ?? 0,
    )

    setMatrix(newMatrix)
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
      setMatrixStart(res.frontEqual)
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
              onClick={() =>
                calculateGaussSeidel(
                  dimension,
                  matrix,
                  matrixEqual,
                  matrixStart,
                )
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

export default GaussSeidelScene
