import "./App.css";

import { Button } from "@mui/material";
import { signout } from "./service/UserService";

function App() {
  return (
    <div className="App">
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={signout}
      >
        로그아웃
      </Button>
    </div>
  );
}

export default App;
