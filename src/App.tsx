import { Outlet } from "react-router-dom";
import "./App.css";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import InternetStatusBar from "@/components/reusable/InternetStatusBar";
import { useUser } from "@/hooks/useUser";


function App() {
  const { user } = useUser();

 return (
    <>
      {user && user?.other && <InternetStatusBar />}
      <Outlet />
    </>
  );
}

export default App;
