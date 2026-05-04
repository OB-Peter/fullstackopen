import { createContext, useReducer, useContext } from 'react'

// CREATE the context
const NotificationContext = createContext()

// REDUCER - handles state changes
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return {
        message: action.payload.message,
        type: action.payload.type || 'success', // 'success' or 'error'
      }
    case 'CLEAR':
      return { message: '', type: '' }
    default:
      return state
  }
}

// PROVIDER - wraps the app
export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(
    notificationReducer,
    { message: '', type: '' }  // initial state
  )

  return (
    <NotificationContext.Provider value={[notification, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

// CUSTOM HOOK - encapsulates notification logic (6.22)
export const useNotify = () => {
  const [, dispatch] = useContext(NotificationContext)

  // Returns a function that shows notification then clears after 5s
  return (message, type = 'success', seconds = 5) => {
    dispatch({
      type: 'SET',
      payload: { message, type }
    })

    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, seconds * 1000)
  }
}

// Hook to just READ the notification value
export const useNotificationValue = () => {
  const [notification] = useContext(NotificationContext)
  return notification
}

export default NotificationContext