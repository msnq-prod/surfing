/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/Home";
import { Store } from "./pages/Store";
import { Community } from "./pages/Community";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="store" element={<Store />} />
            <Route path="community" element={<Community />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
