import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname.startsWith(path) ? 'active' : '';

  return (
    <nav className="navbar navbar-default" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">
            <span></span>
          </a>
        </div>
        <div className="collapse navbar-collapse" id="main-navbar">
          <ul className="nav navbar-nav navbar-right">
            <li className={location.pathname === '/' || location.pathname === '/welcome' ? 'active' : ''}>
              <Link to="/welcome">
                <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                <span> Home</span>
              </Link>
            </li>
            <li className={isActive('/owners')}>
              <Link to="/owners">
                <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                <span> Owners</span>
              </Link>
            </li>
            <li className={isActive('/vets')}>
              <Link to="/vets">
                <span className="glyphicon glyphicon-th-list" aria-hidden="true"></span>
                <span> Veterinarians</span>
              </Link>
            </li>
            <li className={isActive('/pettypes')}>
              <Link to="/pettypes">
                <span className="glyphicon glyphicon-th-list" aria-hidden="true"></span>
                <span> Pet Types</span>
              </Link>
            </li>
            <li className={isActive('/specialties')}>
              <Link to="/specialties">
                <span className="glyphicon glyphicon-th-list" aria-hidden="true"></span>
                <span> Specialties</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
