/* eslint-disable @typescript-eslint/no-explicit-any */
import 'katex/dist/katex.min.css'
import { useMutation } from '@tanstack/react-query'
import { MathJax } from 'better-react-mathjax'
import { all, create, det } from 'mathjs'
import { useState } from 'react'
import { BlockMath } from 'react-katex'
import { toast } from 'sonner'

import { randomMatrix } from '@/services/linear'
import { NotoSansMath } from '@/utils'

const math = create(all)

const InversionScene = () => {
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

  const matrixToLatex = (matrix: number[][]) => {
    if (Array.isArray(matrix[0])) {
      let latex = '\\begin{bmatrix} '
      for (let i = 0; i < matrix.length; i++) {
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

  const calculateIversion = (matrix: number[][], matrixEqual: number[]) => {
    if (det(matrix) === 0) {
      return toast.error('Matrix is singular')
    }

    const A = math.matrix(matrix)
    const B = math.matrix(matrixEqual)
    const Ainv = math.inv(A)

    const x = math.multiply(Ainv, B)

    const stepsArray = []

    const AArray = A.toArray()
    const BArray = B.toArray()
    const xArray = x.toArray().map(Math.round as any)
    const invArray = Ainv.toArray()

    stepsArray.push(
      `\\text{Initial Matrix A:} \\quad ${matrixToLatex(AArray as any)}`,
    )
    stepsArray.push(
      `\\text{Initial Matrix B:} \\quad ${matrixToLatex(BArray as any)}`,
    )
    stepsArray.push(
      `\\text{Inverse Matrix A:} \\quad ${matrixToLatex(invArray as any)}`,
    )
    stepsArray.push(`\\text{ X:} \\quad ${matrixToLatex([xArray as number[]])}`)

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
              onClick={() => calculateIversion(matrix, matrixEqual)}
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

export default InversionScene
