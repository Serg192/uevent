import {
  Login,
  Welcome,
  Signup,
  VerifyEmail,
  ForgotPassword,
  VerifyPasswordReset,
  Events,
} from "./pages";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { Navbar } from "./components";

const App = () => (
  <div>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/verify-password-reset"
          element={<VerifyPasswordReset />}
        />

        <Route element={<RequireAuth />}>
          <Route path="/welcome" element={<Welcome />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
