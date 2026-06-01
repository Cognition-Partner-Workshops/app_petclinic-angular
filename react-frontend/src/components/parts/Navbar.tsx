import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="container-fluid main-wrapper">
      <nav className="navbar navbar-default" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              <span></span>
            </a>
          </div>
          <ul className="nav navbar-nav">
            <li>
              <Link to="/welcome" title="home page">
                <span className="glyphicon glyphicon-home" aria-hidden="true" />
                <span> Home</span>
              </Link>
            </li>
            <li className="dropdown">
              <a
                className="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="glyphicon glyphicon-user" aria-hidden="true" />{' '}
                Owners<span className="caret" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/owners">
                    <span className="glyphicon glyphicon-search" aria-hidden="true" />
                    <span> Search</span>
                  </Link>
                </li>
                <li>
                  <Link to="/owners/add">
                    <span className="glyphicon glyphicon-plus" aria-hidden="true" />
                    <span> Add New</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a
                className="dropdown-toggle"
                data-toggle="dropdown"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="glyphicon glyphicon-education" aria-hidden="true" />{' '}
                Veterinarians<span className="caret" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/vets">
                    <span className="glyphicon glyphicon-search" aria-hidden="true" />
                    <span> All</span>
                  </Link>
                </li>
                <li>
                  <Link to="/vets/add">
                    <span className="glyphicon glyphicon-plus" aria-hidden="true" />
                    <span> Add New</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/pettypes" title="pettypes">
                <span className="glyphicon glyphicon-heart" aria-hidden="true" />
                <span> Pet Types</span>
              </Link>
            </li>
            <li>
              <Link to="/specialties" title="specialties">
                <span className="glyphicon glyphicon-th-list" aria-hidden="true" />
                <span> Specialties</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
