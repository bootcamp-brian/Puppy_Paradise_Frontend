import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css';
import NotFound from "./NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Root from "./pages/Root";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";

const router = createBrowserRouter([
  {
      path: "/",
      element: <Root />,
      errorElement: <NotFound />,
      children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "home",
            element: <Home />,
          },
          {
            path: "admin",
            element: <Admin />
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "cart",
            element: <Cart />
          }
        ],
  },
]);

function App() {
  return (
      <div className="App">
          <RouterProvider router={router} />
      </div>
  )
}

export default App;