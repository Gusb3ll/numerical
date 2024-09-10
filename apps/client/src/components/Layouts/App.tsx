import Navbar from '../Navbar'

const AppLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default AppLayout
