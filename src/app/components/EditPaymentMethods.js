import React, { useState } from 'react';
import { CreditCard, Trash } from 'lucide-react';

const EditPaymentMethods = () => {
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    address: '123 Main St, Anytown, USA',
    password: '',
    confirmPassword: '',
    receivePromotions: true,
    paymentCards: [
      { id: 1, cardNumber: '**** **** **** 4321', expiryDate: '12/25', cardHolder: 'John Doe' },
      { id: 2, cardNumber: '**** **** **** 8765', expiryDate: '09/26', cardHolder: 'John Doe' }
    ]
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [newCard, setNewCard] = useState({ cardNumber: '', expiryDate: '', cardHolder: '', cvv: '' });
  const [isAddingCard, setIsAddingCard] = useState(false);

  // Handle adding new payment card
  const handleAddCard = () => {
    if (userData.paymentCards.length >= 4) {
      setMessage({ type: 'error', text: 'Maximum of 4 payment cards allowed' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }
    
    // Validate card details
    if (newCard.cardNumber && newCard.expiryDate && newCard.cardHolder) {
      const maskedNumber = '**** **** **** ' + newCard.cardNumber.slice(-4);
      const newCardData = {
        id: Date.now(),
        cardNumber: maskedNumber,
        expiryDate: newCard.expiryDate,
        cardHolder: newCard.cardHolder
      };
      
      setUserData({
        ...userData,
        paymentCards: [...userData.paymentCards, newCardData]
      });
      
      setNewCard({ cardNumber: '', expiryDate: '', cardHolder: '', cvv: '' });
      setIsAddingCard(false);
      setMessage({ type: 'success', text: 'Payment card added successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  // Handle removing payment card
  const handleRemoveCard = (id) => {
    setUserData({
      ...userData,
      paymentCards: userData.paymentCards.filter(card => card.id !== id)
    });
    setMessage({ type: 'success', text: 'Payment card removed successfully!' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Handle cancel action
  const handleCancelAddCard = () => {
    setNewCard({ cardNumber: '', expiryDate: '', cardHolder: '', cvv: '' });
    setIsAddingCard(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-red-400">Payment Methods</h2>
      <p className="text-sm text-gray-400 mb-4">You can save up to 4 payment cards.</p>
      
      <div className="space-y-4 mb-6">
        {userData.paymentCards.map(card => (
          <div key={card.id} className="flex items-center justify-between p-4 bg-gray-700 rounded">
            <div>
              <div className="flex items-center">
                <CreditCard className="mr-2 text-red-500" size={20} />
                <span className="font-medium">{card.cardNumber}</span>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Expires: {card.expiryDate} | {card.cardHolder}
              </div>
            </div>
            <button 
              type="button"
              onClick={() => handleRemoveCard(card.id)}
              className="p-1 text-gray-400 hover:text-red-500"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add New Card Button */}
      {!isAddingCard && (
        <button
          type="button"
          onClick={() => setIsAddingCard(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add New Card
        </button>
      )}

      {/* Add New Card Section */}
      {isAddingCard && (
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Card Number" 
            value={newCard.cardNumber}
            onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
            className="p-2 bg-gray-700 text-white rounded w-full"
          />
          <input 
            type="text" 
            placeholder="Expiry Date" 
            value={newCard.expiryDate}
            onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
            className="p-2 bg-gray-700 text-white rounded w-full"
          />
          <input 
            type="text" 
            placeholder="Card Holder" 
            value={newCard.cardHolder}
            onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
            className="p-2 bg-gray-700 text-white rounded w-full"
          />
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleAddCard}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Add Card
            </button>
            <button
              type="button"
              onClick={handleCancelAddCard}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPaymentMethods;
