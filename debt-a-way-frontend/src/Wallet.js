import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';



  

const Wallet = ({token}) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [debtsOwed, setDebtsOwed] = useState(0);
  const [debtsReceivable, setDebtsReceivable] = useState(0);
  const [addAmount, setAddAmount] = useState('');

  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;

  useEffect(() => {
    fetchWalletBalance();
    fetchDebtsOwed();
    fetchDebtsReceivable();
    // Fetch wallet balance and transactions
  }, []);

  const fetchWalletBalance = async () => {
    const response = await axios.get(`https://debt-a-way.onrender.com/api/users/wallet-balance/${userId}`);
    setBalance(response.data.walletBalance); // Update based on actual response structure
  };

  const fetchDebtsOwed = async () => {
    const response = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/debts-owed-by/${userId}`);
    const totalOwed = response.data.reduce((acc, debt) => acc + debt.amount, 0);
    setDebtsOwed(totalOwed); // Update based on actual response structure
  };

  const fetchDebtsReceivable = async () => {
    const response = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/debts-owed-to/${userId}`);
    const totalReceivable = response.data.reduce((acc, debt) => acc + debt.amount, 0);
    setDebtsReceivable(totalReceivable); // Update based on actual response structure
  };

  const handleAddToWallet = async () => {
    try {
      const response = await axios.patch(`https://debt-a-way.onrender.com/api/users/update-wallet/${userId}`, {
        amount: addAmount
      });
  
      setBalance(response.data.walletBalance); // Update the state with the new wallet balance
      setAddAmount(''); // Reset the add amount field
    } catch (error) {
      console.error('Error adding money to wallet:', error);
    }
  };
  

  return (
    // <div>
    //   <h2>Wallet Balance: ${balance}</h2>
    //   {/* Display transactions */}
    // </div>
    <div>
        <div  className="tiles-container">
        <div  className="tile" onClick={() => {/* Navigate to Wallet Balance page */}}>
        < div className="tile-title">Wallet Balance</div>
            <div className="tile-number">${balance}</div>
        </div>
        <div  className="tile" onClick={() => {/* Navigate to Debts Owed page */}}>
            <div className="tile-title">Debts Owed</div>
            <div className="tile-number">${debtsOwed}</div> 
        </div>
        <div  className="tile" onClick={() => {/* Navigate to Debts Receivable page */}}>
            <div className="tile-title">Debts Receivable</div>
            <div className="tile-number"> ${debtsReceivable}</div> 
        </div>
     </ div>

        <div  className="add-to-wallet-container">
        <h3>Add Money to Wallet</h3>
        <input 
            type="number" 
            value={addAmount} 
            onChange={(e) => setAddAmount(e.target.value)} 
            placeholder="Enter amount" 
        />
        <button onClick={handleAddToWallet}>Add to Wallet</button>
        </div>
    </div>
  );
};

export default Wallet;