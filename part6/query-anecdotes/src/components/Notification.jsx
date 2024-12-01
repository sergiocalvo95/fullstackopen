import { useContext } from "react"
import NotificationContext, { useNotificationDispatch, useNotificationValue } from "../NotificationContext"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const notification = useNotificationValue()
  const dispatch = useNotificationDispatch()

  if(notification) {
    setTimeout(() => {
      dispatch({ type: 'CLEAR' });
    }, 5000);
  }
  

  return (
    notification ?
    <div style={style}>
      {notification}
    </div>
    :
    null
  )
}

export default Notification
