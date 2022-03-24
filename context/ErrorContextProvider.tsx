import React, {Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {useNotifications} from "@mantine/notifications";

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

    const notifications = useNotifications()

    useEffect(() => {
        if (error) {
            setError(undefined)
            notifications.showNotification({
                title: "Uh Oh!",
                message: error,
                color: "red"
            })
        }
    })

    return (
        <ErrorContext.Provider value={{error, setError}}>
            {children}
        </ErrorContext.Provider>
    )
}

export function useError() {
    return useContext(ErrorContext)
}
