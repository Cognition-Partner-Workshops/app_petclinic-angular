import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [ownersOpen, setOwnersOpen] = useState(false);
  const [vetsOpen, setVetsOpen] = useState(false);
  const ownersRef = useRef<HTMLLIElement>(null);
  const vetsRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ownersRef.current && !ownersRef.current.contains(e.target as Node)) setOwnersOpen(false);
      if (vetsRef.current && !vetsRef.current.contains(e.target as Node)) setVetsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
            <li className={`dropdown${ownersOpen ? ' open' : ''}`} ref={ownersRef}>
              <a
                className="dropdown-toggle"
                role="button"
                aria-haspopup="true"
                aria-expanded={ownersOpen}
                onClick={() => setOwnersOpen((prev) => !prev)}
              >
                <span className="glyphicon glyphicon-user" aria-hidden="true" />{' '}
                Owners<span className="caret" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/owners" onClick={() => setOwnersOpen(false)}>
                    <span className="glyphicon glyphicon-search" aria-hidden="true" />
                    <span> Search</span>
                  </Link>
                </li>
                <li>
                  <Link to="/owners/add" onClick={() => setOwnersOpen(false)}>
                    <span className="glyphicon glyphicon-plus" aria-hidden="true" />
                    <span> Add New</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li className={`dropdown${vetsOpen ? ' open' : ''}`} ref={vetsRef}>
              <a
                className="dropdown-toggle"
                role="button"
                aria-haspopup="true"
                aria-expanded={vetsOpen}
                onClick={() => setVetsOpen((prev) => !prev)}
              >
                <span className="glyphicon glyphicon-education" aria-hidden="true" />{' '}
                Veterinarians<span className="caret" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/vets" onClick={() => setVetsOpen(false)}>
                    <span className="glyphicon glyphicon-search" aria-hidden="true" />
                    <span> All</span>
                  </Link>
                </li>
                <li>
                  <Link to="/vets/add" onClick={() => setVetsOpen(false)}>
                    <span className="glyphicon glyphicon-plus" aria-hidden="true" />
                    <span> Add New</span>
                  </Link>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </nav>
    </div>
  );
}
