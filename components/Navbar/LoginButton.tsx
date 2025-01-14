import Link from 'next/link'
import clsx from 'clsx'
import { RawButton } from 'components/Button'
import { LoginContext } from 'contexts/LoginContext'
// import { useState, useEffect } from 'react'

export const LoginButton = () => {
  /*
  const [$loaded, $setLoaded] = useState<boolean>(false)
  useEffect(() => {
    const t = setTimeout(() => {
      if (!$loaded) {
        $setLoaded(true)
      }
    }, 3e3)
    return () => clearTimeout(t)
    })
  */
  return (
    <LoginContext.Consumer>
      {({ status, checkLoggedIn, error, metadata }) => {
        if (error) {
          // TODO: Find a way to resolve this better, but keep for now
          // eslint-disable-next-line no-console
          console.log({ error, status })
        }

        const loggedIn = checkLoggedIn()

        const goto =
          loggedIn && metadata && metadata.id
            ? `/users/${metadata.id}`
            : '/login'
        const hasGraffiti = metadata && !!metadata.graffiti
        return (
          <RawButton
            className={clsx(
              'text-2xl',
              'md:text-base',
              'h-16',
              'md:h-12',
              'md:ml-4',
              'py-3',
              'px-6',
              'text-center'
            )}
            colorClassName="bg-transparent text-black hover:bg-black hover:text-white"
          >
            <Link href={goto}>
              <a>
                {hasGraffiti ? (
                  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
                  metadata!.graffiti
                ) : (
                  <span>
                    Login<span className="md:hidden"> to Testnet</span>
                  </span>
                )}
              </a>
            </Link>
          </RawButton>
        )
      }}
    </LoginContext.Consumer>
  )
  // </div>
}
export default LoginButton
