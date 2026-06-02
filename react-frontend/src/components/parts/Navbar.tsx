import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className="container-fluid main-wrapper">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/welcome">Spring PetClinic</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/welcome">Home</Link></li>
          <li className="dropdown">
            <span className="dropdown-toggle">Owners</span>
            <ul className="dropdown-menu">
              <li><Link to="/owners">Search</Link></li>
              <li><Link to="/owners/add">Add New</Link></li>
            </ul>
          </li>
          <li className="dropdown">
            <span className="dropdown-toggle">Veterinarians</span>
            <ul className="dropdown-menu">
              <li><Link to="/vets">All</Link></li>
              <li><Link to="/vets/add">Add New</Link></li>
            </ul>
          </li>
          <li><Link to="/pettypes">Pet Types</Link></li>
          <li><Link to="/specialties">Specialties</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
