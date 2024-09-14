import { useAtom } from 'jotai'
// import { FaUser } from 'react-icons/fa6'

import { Method, methodAtom } from '@/utils'

const Navbar = () => {
  const [currentMethod, setCurrentMethod] = useAtom(methodAtom)

  return (
    <nav className="flex w-full flex-row items-center justify-between px-6 py-2 shadow-lg">
      <div className="flex flex-row items-center gap-8">
        <h1
          className="cursor-pointer select-none text-[24px] font-bold md:text-[32px]"
          onClick={() => setCurrentMethod(null)}
        >
          [ Numerical ]
        </h1>
        <select
          className="w-[150px] border-0 border-b-2 border-gray-600 bg-transparent px-0 py-2 text-sm focus:outline-none focus:ring-0"
          onChange={e => setCurrentMethod(+e.currentTarget.value)}
          value={currentMethod ? currentMethod : ''}
        >
          <option disabled value="">
            Choose methods
          </option>
          <option value={Method.BISECTION}>Bisection</option>
          <option value={Method.FALSE_POSITION}>False Position</option>
          <option value={Method.NEWTON}>Newton</option>
          <option value={Method.SECANT}>Secant</option>
          <option value={Method.ONE_POINT_ITERATION}>
            One-Point Iteration
          </option>
        </select>
      </div>
      {/* <div>
        <FaUser className="text-[32px]" />
      </div> */}
    </nav>
  )
}

export default Navbar
