
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Modal from 'react-modal';


//import jwtDecode from 'jwt-decode';

Modal.setAppElement('#root');


  
//   const decodedToken = jwtDecode(token);
//   const userId = decodedToken._id;

const DebtsReceivable = () => {
  const [debtsOwedToUser, setDebtsOwedToUser] = useState([]);
  const [debtsHistory, setDebtsHistory] = useState([]);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [selectedDebtForTrade, setSelectedDebtForTrade] = useState(null);
  const [tradePrice, setTradePrice] = useState('');

//   const decodedToken = jwtDecode(token);
//   const userId = decodedToken._id;

  useEffect(() => {

    const token = localStorage.getItem('userToken');
    const decodedToken = jwtDecode(token);
    const userId = decodedToken._id;
  

    const fetchDebtsReceivable = async () => {

        
      try {
        const response = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/debts-owed-to/${userId}`);
        setDebtsOwedToUser(response.data);
      } catch (error) {
        console.error('Error fetching debts owed:', error);
      }
    };

    fetchDebtsReceivable();
    fetchReceivedHistory();
//   }, []);

  const fetchReceivedHistory=async()=>{
    try {
        const response = await axios.get(`https://debt-a-way.onrender.com/api/debt-postings/debts-history/${userId}`);
        setDebtsHistory(response.data.filter(debt => debt.lender._id === userId)); // Filter the debts where user is the borrower
        //setDebtsHistory(response.data); // Set the full history
      } catch (error) {
        console.error('Error fetching debts owed:', error);
      }
  }
//   const handleOpenTradeModal = (debtId) => {
//     setSelectedDebtForTrade(debtId);
//     setIsTradeModalOpen(true);
//   };

//   const handleCloseTradeModal = () => {
//     setIsTradeModalOpen(false);
//     setSelectedDebtForTrade(null);
//     setTradePrice('');
//   };

  const handleTradeDebt = async () => {
    if (!tradePrice) {
      alert('Please enter a trade price');
      return;
    }

    try {
      await axios.patch(`https://debt-a-way.onrender.com/api/debt-postings/trade-debt/${selectedDebtForTrade}`, 
        { tradePrice } // Replace 'your_token' with actual token
      );
      handleCloseTradeModal();
      // Refresh your debts list here
    } catch (error) {
      console.error('Error trading debt:', error);
    }
  };

}, []);

const handleTradeDebt = async () => {
    if (!tradePrice) {
      alert('Please enter a trade price');
      return;
    }

    try {
      await axios.patch(`https://debt-a-way.onrender.com/api/debt-postings/trade-debt/${selectedDebtForTrade}`, 
        { tradePrice } // Replace 'your_token' with actual token
      );
      handleCloseTradeModal();
      // Refresh your debts list here
    } catch (error) {
      console.error('Error trading debt:', error);
    }
  };

const handleOpenTradeModal = (debtId) => {
    setSelectedDebtForTrade(debtId);
    setIsTradeModalOpen(true);
  };

  const handleCloseTradeModal = () => {
    setIsTradeModalOpen(false);
    setSelectedDebtForTrade(null);
    setTradePrice('');
  };

  return (
    <div>
        <div className="full-width-container">
        <h3 className="debts-owed-heading">Debts Owed to Me</h3>
        <table className="debts-owed-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Interest Rate</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {debtsOwedToUser.map(debt => (
                <tr key={debt._id}>
                <td>{debt.borrower.username}</td>
                <td>{debt.amount}</td>
                <td>{debt.interestRate}%</td>
                <td>
                    <button className="pay-button" onClick={() => handleOpenTradeModal(debt._id)}>Trade Debt</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="full-width-container">
        <h3 className="debts-owed-heading">Debts Received History</h3>
                <table className="debts-owed-table">
                    <thead>
                        <tr>
                            <th>Borrower</th>
                            <th>Amount</th>
                            <th>Interest Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debtsHistory.map(debt => (
                            <tr key={debt._id}>
                                <td>{debt.borrower.username}</td> {/* Adjust as per your data structure */}
                                <td>{debt.amount}</td>
                                <td>{debt.interestRate}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
      {/* Trade Modal */}
    

            <Modal
        isOpen={isTradeModalOpen}
        onRequestClose={handleCloseTradeModal}
        className="trade-modal-content"
        // You can add more styling or positioning properties here
        >
        <h4 className="trade-modal-header">Set Trade Price</h4>
        <input
            type="number"
            value={tradePrice}
            onChange={(e) => setTradePrice(e.target.value)}
            placeholder="Trade Price"
        />
        <button  className="trade-modal-button trade-modal-button-primary" onClick={handleTradeDebt}>Confirm Trade</button>
        <button   className="trade-modal-button trade-modal-button-secondary" onClick={handleCloseTradeModal}>Cancel</button>
        </Modal>



    </div>
  );
};

export default DebtsReceivable;

