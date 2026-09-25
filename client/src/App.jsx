import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import PremiumCursor from "./components/common/ui/PremiumCursor";

function App() {
  return (
    <>
      {/* Global Premium Cursor */}
      <PremiumCursor />

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      {/* Application Routes */}
      <AppRoutes />
    </>
  );
}

export default App;