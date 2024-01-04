import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
//import jwtDecode from 'jwt-decode';

function Home({ token }) {
  const [walletBalance, setWalletBalance] = useState(0);
  const [debtsOwed, setDebtsOwed] = useState(0);
  const [debtsReceivable, setDebtsReceivable] = useState(0);
  const [unfulfilledDebts, setUnfulfilledDebts] = useState([]);
  const [tradableDebts, setTradableDebts] = useState([]);

  const [newDebtAmount, setNewDebtAmount] = useState('');
  const [newDebtInterestRate, setNewDebtInterestRate] = useState('');
// Add more states as needed for other debt details


  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;
  
  useEffect(() => {
    fetchWalletBalance();
    fetchDebts();
    fetchDebtsOwed();
    fetchDebtsReceivable();
  }, []);

   // Replace with actual backend URLs
   const fetchWalletBalance = async () => {
    const response = await axios.get(`https://debt-a-way.onrender.com/api/users/wallet-balance/${userId}`);
    setWalletBalance(response.data.walletBalance); // Update based on actual response structure
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

  const fetchDebts = async () => {
    try {
      const unfulfilledDebtsResponse = await axios.get('https://debt-a-way.onrender.com/api/debt-postings/');
      setUnfulfilledDebts(unfulfilledDebtsResponse.data);

      const tradableDebtsResponse = await axios.get('https://debt-a-way.onrender.com/api/debt-postings/tradable-debts');
      setTradableDebts(tradableDebtsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePostDebt = async () => {
    try {
      const payload = {
        amount: newDebtAmount,
        interestRate: newDebtInterestRate,
        // Include other debt details in the payload
      };
  
      await axios.post('https://debt-a-way.onrender.com/api/debt-postings', payload);

      fetchDebts();

      setNewDebtAmount('');
      setNewDebtInterestRate('');
  
      // You might want to refresh the list of debts or navigate the user to the Debts Owed page
    } catch (error) {
      console.error('Error posting new debt:', error);
    }
  };
  


  const handleBuyDebt = async (debtId) => {
    try {
      const response = await axios.patch(
        `https://debt-a-way.onrender.com/api/debt-postings/buy-debt/${debtId}`
      );
      
      setTradableDebts(prevDebts => prevDebts.filter(debt => debt._id !== debtId));
      setWalletBalance(response.data.buyer.walletBalance);
  
      // Refresh other relevant data if necessary
      fetchDebts();
      fetchDebtsOwed();
      fetchDebtsReceivable();
      // fetchDebtsSummary(); // Uncomment if you have this function
    } catch (error) {
      console.error('Error buying debt:', error);
    }
  };

  const handleLendClick = async (debtId) => {
    try {
      const response = await axios.patch(
        `https://debt-a-way.onrender.com/api/debt-postings/lend/${debtId}`
      );
  
      fetchDebts(); // Assuming you have this function to refresh the list
      setWalletBalance(response.data.user.walletBalance);
      fetchDebtsOwed();
      fetchDebtsReceivable();
  
      // Refresh other relevant data
      // fetchDebtsSummary(); // Uncomment if you have this function
    } catch (error) {
      console.error('Error lending to debt posting:', error);
    }
  };
  
  
  
  
  

  return (
    <div>
      <div  className="tiles-container">
        <div  className="tile" onClick={() => {/* Navigate to Wallet Balance page */}}>
        < div className="tile-title">Wallet Balance</div>
            <div className="tile-number">${walletBalance}</div>
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

     <div className="full-width-container">
     <h3 className="section-heading">Post a New Debt</h3>
      <div className="post-debt">
        
        <input
          type="number"
          value={newDebtAmount}
          onChange={(e) => setNewDebtAmount(e.target.value)}
          placeholder="Debt Amount"
        />
        <input
          type="number"
          value={newDebtInterestRate}
          onChange={(e) => setNewDebtInterestRate(e.target.value)}
          placeholder="Interest Rate"
        />
        {/* Add more inputs for other debt details */}
        
        <button onClick={handlePostDebt}>Post Debt</button>
      </div>
    </div>

    <div className="full-width-container">
      <h3 className="section-heading">Unfulfilled Debt Postings</h3>
      {unfulfilledDebts.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Interest Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {unfulfilledDebts.map(debt => (
              <tr key={debt._id}>
                <td>{debt.borrower.username}</td>
                <td>{debt.amount}</td>
                <td>{debt.interestRate}%</td>
                <td>
                  <button onClick={() => handleLendClick(debt._id)}>Lend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No unfulfilled debt postings available.</p>
      )}

    </div>

    <div className="full-width-container">
      <h3 className="section-heading">Tradable Debt Postings</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Borrower</th>
                  <th>Amount</th>
                  <th>Interest Rate</th>
                  <th>Trade Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tradableDebts.map(debt => (
                  <tr key={debt._id}>
                    <td>{debt.borrower.username}</td>
                    <td>{debt.amount}</td>
                    <td>{debt.interestRate}%</td>
                    <td>{debt.tradePrice}</td>
                    <td>
                      <button onClick={() => handleBuyDebt(debt._id)}>Buy</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
    </div>

  </div>
  );
}

export default Home;
