/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "./notfound";
import Hero from "./component/hero";
import BookingSuccessPage from "./component/success";
const App = () => {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" >
           <Route path="/"  element={<Hero/>}  />
           <Route path="/success"  element={<BookingSuccessPage/>}  />
           <Route path="*" element={<NotFound/>} />
        </Route>
      </>
    )
  );

  return (
    <>
      <div className="z-487834762736723"><ToastContainer /></div>
     <div className="h-full hidden z-9876367000 top-0 right-0 fixed w-full bg-white items-center justify-center" id="isSending">
       <div className="flex flex-col  h-full items-center justify-center centered space-y-3">
          <div className="h-[100vh] w-[100vw] bg-white items-center justify-center flex fa-fade"><img src="/vlux_logo.jpg" className="h-100 w-100 object-contain" alt="" /></div>
          <div className=""><span className="text-md font-quiche text-white" id="sending-msg">loading...</span></div>
        </div>
      </div>
      <div className="font-quiche">
        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
