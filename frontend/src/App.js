import {
  Login,
  Welcome,
  Signup,
  VerifyEmail,
  ForgotPassword,
  VerifyPasswordReset,
  Events,
  Companies,
  Company,
  Event,
  Profile,
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
        <Route path="/events" element={<Events />} />
        <Route path="/events/:eid" element={<Event />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:cid" element={<Company />} />
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
        <Route path="/profile" element={<Profile />}/>
      </Routes>
    </BrowserRouter>
  </div>
);

export default App;
