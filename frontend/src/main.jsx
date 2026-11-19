import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { Provider } from 'react-redux';
import store from "./store/store.jsx"
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </Provider>
)
