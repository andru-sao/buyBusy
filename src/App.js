import Home from "./Components/Home"
import NavBar from "./Components/Navbar";
import Cart from "./Components/Cart";
import Orders from './Components/Orders';
import LogIn from './Components/Login';
import SignUp from './Components/SignUp';
import CustomItemContext from "./context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const router = createBrowserRouter([
    {path:"/",
    element: <NavBar/>,
    children: [
    {index: true, element: <Home/> },
    {path: "/cart", element: <Cart/>},
    {path: "/orders", element: <Orders/>},
    {path: "/login", element: <LogIn/>},
    {path: "/signup", element: <SignUp/>},
    ]
  }
  ])

  return (
    <div className="App">
      <CustomItemContext>
      {/* <NavBar/>
      <Home/> */}
      <RouterProvider router={router}/>
      <ToastContainer />
      </CustomItemContext>
    </div>
  );
}

export default App;
