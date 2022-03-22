import React, {Dispatch, SetStateAction, useContext, useState} from "react";

export type ErrorContextProps = {
    error: string | undefined
    setError: Dispatch<SetStateAction<string | undefined>>
}

const ErrorContext = React.createContext({} as ErrorContextProps)

type Props = {
    children: React.ReactNode
}

export function ErrorContextProvider({children}: Props) {
    const [error, setError] = useState(undefined as (string | undefined))

    return (
        <ErrorContext.Provider value={{error, setError}}>
            {children}
        </ErrorContext.Provider>
    )
}

export function useError() {
    return useContext(ErrorContext)
}
