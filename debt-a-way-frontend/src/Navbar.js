// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Navbar = () => {

//     const navigate = useNavigate();

//     const isLoggedIn = () => {

        

//         return localStorage.getItem('userToken') != null;
//       };
    
//   const handleLogout = () => {
//     // Implement logout logic here
//     // This might involve removing the user's token from local storage and redirecting to the login page
//     localStorage.removeItem('userToken');
//     navigate('/login'); // Or use navigate from react-router-dom for a more SPA-like experience
//   };

//   return (
//     <nav className="navbar">
//       <div className="navbar-logo">Debt-a-way</div>
//       <div className="navbar-links">
//       <Link to="/home">Home</Link>
//       <Link to="/debts-owed">Debts Owed</Link>
//       <Link to="/debts-receivable">Debts Receivable</Link>
//       <Link to="/wallet">Wallet</Link>
//       {isLoggedIn() && <button onClick={handleLogout}>Logout</button>}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const isLoggedIn = () => {
    return localStorage.getItem('userToken') != null;
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Debt-a-way</div>
      <div className="navbar-links">
        <div className="navbar-links-left">
          <Link to="/home">Home</Link>
          <Link to="/debts-owed">Debts Owed</Link>
          <Link to="/debts-receivable">Debts Receivable</Link>
          <Link to="/wallet">Wallet</Link>
        </div>
        <div className="navbar-links-right">
          {isLoggedIn() && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

