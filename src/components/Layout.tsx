import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <img src="/images/spring-pivotal-logo.png" alt="Spring Logo" />
          </div>
        </div>
      </div>
    </>
  );
}
