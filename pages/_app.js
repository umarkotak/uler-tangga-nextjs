import '../styles/globals.css'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'

function MyApp({ Component, pageProps }) {
  const AlertTemplate = ({ style, options, message, close }) => {
    var title = "Error"
    var description = message
    var tempArr = message.split(" || ")
    if (tempArr.length >= 2) {
      title = tempArr[0]
      description = tempArr[1]
    }

    if (options.type === "info" || options.type === "success") {
      return(
        <div className={`bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative`} role="info" style={style} onClick={close}>
          <strong className="font-bold">{title + ": "}</strong>
          <span className="block sm:inline">{description}</span>
        </div>
      )
    } else {
      return(
        <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative`} role="alert" style={style} onClick={close}>
          <strong className="font-bold">{title + ": "}</strong>
          <span className="block sm:inline">{description}</span>
        </div>
      )
    }
  }

  const options = {
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '-55px 30px 75px 30px',
    transition: transitions.FADE
  }

  return (
    <>
      <AlertProvider template={AlertTemplate} {...options}>
        <Component {...pageProps} />
      </AlertProvider>
    </>
  )
}

export default MyApp
