import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  function isActive(path: string) {
    return location.pathname.startsWith(path) ? 'active' : '';
  }

  return (
    <>
      <nav className="navbar navbar-default" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#main-navbar"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <Link className="navbar-brand" to="/">
              <span>PetClinic</span>
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="main-navbar">
            <ul className="nav navbar-nav">
              <li className={isActive('/owners')}>
                <Link to="/owners">Owners</Link>
              </li>
              <li className={isActive('/pets')}>
                <Link to="/pets">Pets</Link>
              </li>
              <li className={isActive('/visits')}>
                <Link to="/visits">Visits</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container-fluid">
        <Outlet />
      </div>
    </>
  );
}
