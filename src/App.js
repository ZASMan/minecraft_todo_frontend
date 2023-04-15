import './App.css';
import {Navbar, Nav} from 'react-bootstrap';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Home from "./components/Home.js";
import Lists from "./components/Lists.js";

function App() {
  return (
    <BrowserRouter>
      <div className="App background-img">
        <>
          <Navbar bg="dark" variant="dark">
              <Navbar.Brand as={Link} to="/">Minecraft Todo</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/Lists">Lists</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link href="#deets">SignUp</Nav.Link>
              </Nav>
          </Navbar>
        </>

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lists" element={<Lists />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
    );
  }

export default App;
