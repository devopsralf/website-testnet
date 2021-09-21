import React from 'react'
import useLogin, { STATUS } from 'hooks/useLogin'

export const LoginContext = React.createContext<ReturnType<typeof useLogin>>({
  checkLoggedIn: () => false,
  error: null,
  magicMetadata: null,
  metadata: null,
  status: STATUS.LOADING,
})