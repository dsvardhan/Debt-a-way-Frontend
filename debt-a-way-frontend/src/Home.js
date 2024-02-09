import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
//import jwtDecode from 'jwt-decode';

function Home() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [debtsOwed, setDebtsOwed] = useState(0);
  const [debtsReceivable, setDebtsReceivable] = useState(0);
  const [unfulfilledDebts, setUnfulfilledDebts] = useState([]);
  const [tradableDebts, setTradableDebts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [newDebtAmount, setNewDebtAmount] = useState('');
  const [newDebtInterestRate, setNewDebtInterestRate] = useState('');
// Add more states as needed for other debt details


  const token = localStorage.getItem('userToken');
  
  const decodedToken = jwtDecode(token);
  const userId = decodedToken._id;
  

  useEffect(() => {
    fetchWalletBalance();
    fetchDebts(currentPage);
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

  // const fetchDebts = async () => {
  //   try {
  //     const unfulfilledDebtsResponse = await axios.get('https://debt-a-way.onrender.com/api/debt-postings/');
  //     setUnfulfilledDebts(unfulfilledDebtsResponse.data);

  //     const tradableDebtsResponse = await axios.get('https://debt-a-way.onrender.com/api/debt-postings/tradable-debts');
  //     setTradableDebts(tradableDebtsResponse.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const fetchDebts = async (page = 1) => {
  //   try {
  //     const limit = 10; // Adjust based on your preference or dynamic selection
  //     const unfulfilledDebtsResponse = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/?page=${page}&limit=${limit}`);
  //     setUnfulfilledDebts(unfulfilledDebtsResponse.data.data);
  //     setTotalPages(unfulfilledDebtsResponse.data.totalPages); // Assumes this data is provided

  //     const tradableDebtsResponse = await axios.get('https://debt-a-way.onrender.com/api/debt-postings/tradable-debts');
  //     setTradableDebts(tradableDebtsResponse.data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const fetchDebts = async (page = 1) => {
    try {
      const limit = 10; // Adjust based on your preference or dynamic selection
      console.log(`Fetching unfulfilled debts for page ${page} with limit ${limit}`);
      const unfulfilledDebtsResponse = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/?page=${page}&limit=${limit}`);
      console.log('Unfulfilled debts data:', unfulfilledDebtsResponse.data);
      setUnfulfilledDebts(unfulfilledDebtsResponse.data.data);
      setTotalPages(unfulfilledDebtsResponse.data.totalPages); // Assumes this data is provided
  
      const tradableDebtsResponse = await axios.get('https://debt-a-way.onrender.com/api/debt-postings/tradable-debts');
      console.log('Tradable debts data:', tradableDebtsResponse.data);
      setTradableDebts(tradableDebtsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  // const handlePrevPage = () => {
  //   if (currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  // };

  // const handleNextPage = () => {
  //   if (currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // const handleLastPage = () => {
  //   setCurrentPage(totalPages);
  // };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      console.log(`Navigating to previous page: ${currentPage - 1}`);
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      console.log(`Navigating to next page: ${currentPage + 1}`);
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handleLastPage = () => {
    console.log(`Navigating to last page: ${totalPages}`);
    setCurrentPage(totalPages);
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
     <h3 >Post a New Debt</h3>
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

<div className="pagination-controls">
  <button onClick={handlePrevPage} disabled={currentPage <= 1}>Previous</button>
  <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First Page</button>
  <span>Page {currentPage} of {totalPages}</span>
  <button onClick={handleNextPage} disabled={currentPage >= totalPages}>Next</button>
  <button onClick={handleLastPage} disabled={currentPage === totalPages}>Last Page</button>
</div>



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
