// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function LoginRegister() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [credentials, setCredentials] = useState({ username: '', email: '', password: '', confirmPassword: '' });
//   const navigate = useNavigate();

//   const handleInputChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isLogin && credentials.password !== credentials.confirmPassword) {
//       alert('Passwords do not match');
//       return;
//     }

//     const url = isLogin ? 'https://debt-a-way.onrender.com/api/users/login' : 'https://debt-a-way.onrender.com/api/users/register';
//     try {
//       const response = await axios.post(url, credentials);
//       if (response.data.token) {
//         localStorage.setItem('userToken', response.data.token);
//         navigate('/home');
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         {!isLogin && (
//           <input 
//             type="text" 
//             name="username" 
//             placeholder="Username" 
//             value={credentials.username} 
//             onChange={handleInputChange} 
//           />
//         )}
//         <input 
//           type="email" 
//           name="email" 
//           placeholder="Email" 
//           value={credentials.email} 
//           onChange={handleInputChange} 
//         />
//         <input 
//           type="password" 
//           name="password" 
//           placeholder="Password" 
//           value={credentials.password} 
//           onChange={handleInputChange} 
//         />
//         {!isLogin && (
//           <input 
//             type="password" 
//             name="confirmPassword" 
//             placeholder="Confirm Password" 
//             value={credentials.confirmPassword} 
//             onChange={handleInputChange} 
//           />
//         )}
//         <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
//       </form>
//       <button onClick={() => setIsLogin(!isLogin)}>
//         {isLogin ? 'Switch to Register' : 'Switch to Login'}
//       </button>
//     </div>
//   );
// }

// export default LoginRegister;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginRegister() {
  const [loginCredentials, setLoginCredentials] = useState({ email: '', password: '' });
  const [registerCredentials, setRegisterCredentials] = useState({ username: '', email: '', password: ''});
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginCredentials({ ...loginCredentials, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterCredentials({ ...registerCredentials, [e.target.name]: e.target.value });
    setLoginCredentials({ ...loginCredentials, [e.target.name]: e.target.value })
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://debt-a-way.onrender.com/api/users/login', loginCredentials);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        navigate('/home');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerCredentials.password !== registerCredentials.confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const regResponse = await axios.post('https://debt-a-way.onrender.com/api/users/register', registerCredentials);
        
        if(regResponse.data.user){
          const response = await axios.post('https://debt-a-way.onrender.com/api/users/login', loginCredentials);
          if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
            navigate('/home');
          }
        }
    } catch (error) {
        console.error(error);
        // Handle registration errors (e.g., user already exists, server error)
    }
};

  return (
    <div className="auth-container">
      <div className="login-section">
      <h2>Login</h2>
        <form onSubmit={handleLoginSubmit}>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={loginCredentials.email} 
            onChange={handleLoginChange} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={loginCredentials.password} 
            onChange={handleLoginChange} 
          />
          <button className="ln-button" type="submit">Login</button>
        </form>
      </div>
      <div className="register-section">
      <h2>Register</h2>
        <form onSubmit={handleRegisterSubmit}>
          <input 
            type="text" 
            name="username" 
            placeholder="Username" 
            value={registerCredentials.username} 
            onChange={handleRegisterChange} 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={registerCredentials.email} 
            onChange={handleRegisterChange} 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={registerCredentials.password} 
            onChange={handleRegisterChange} 
          />
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            value={registerCredentials.confirmPassword} 
            onChange={handleRegisterChange} 
          />
          <button className="ln-button"type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default LoginRegister;

