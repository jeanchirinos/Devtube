import Loader from '@/components/Loader'
import Login from '@/pages/login'
import { CtxSession } from '@/src/context/SessionContext'
import '@testing-library/jest-dom'
import { render, screen, renderHook } from '@testing-library/react'
import { useContext } from 'react'

export {}

describe('Login', () => {
  // beforeEach(() => {
  //   render(
  //     <CtxSession.Provider value={{ currentUser: null }}>
  //       <Login />
  //     </CtxSession.Provider>
  //   )
  // })

  it('muestra loader mientras se verifica estado de usuario', () => {
    render(
      <CtxSession.Provider value={{ currentUser: undefined }}>
        <Login />
      </CtxSession.Provider>
    )

    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
  })

  it('usuario no está logueado', () => {
    render(
      <CtxSession.Provider value={{ currentUser: null }}>
        <Login />
      </CtxSession.Provider>
    )

    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
  })
})
