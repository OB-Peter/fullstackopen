import { useNotificationValue } from '../NotificationContext' // ✅ import here

const Notification = () => {
  const notification = useNotificationValue() // ✅ use here

  if (!notification.message) return null

  const successStyle = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    color: 'green',
    background: 'lightgreen',
  }

  const errorStyle = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    color: 'red',
    background: 'lightpink',
  }

  const style = notification.type === 'error' ? errorStyle : successStyle

  return <div style={style}>{notification.message}</div>
}

export default Notification