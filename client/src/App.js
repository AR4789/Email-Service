import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Modal from './Modal';

function App() {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    subject: '',
    description: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState('');

  const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'to') {
      setQuery(e.target.value);
    }
  };

  useEffect(() => {
    if (query.length > 2) { // Fetch suggestions when query is longer than 2 characters
      axios.get(`/api/suggest-emails?q=${query}`)
        .then(response => {
          setSuggestions(response.data);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/send-email', formData);
      setModalMessage('Emails sent successfully!');
      setModalOpen(true);
    } catch (error) {
      setModalMessage('Failed to send emails');
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="App">
      <h1>Bulk Email Service</h1>
      <header className="hero">
      <img src="https://i.pinimg.com/736x/cc/99/6d/cc996dbddf4685877b72d4d213edd3b4.jpg" alt="Hero" />    
      </header>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="from"
          placeholder="From"
          value={formData.from}
          onChange={handleChange}
        />
        <div>
          <input
            type="text"
            name="to"
            placeholder="To (comma-separated emails)"
            value={formData.to}
            onChange={handleChange}
            onFocus={() => setSuggestions([])} // Clear suggestions when focus on input
          />
          <ul className="suggestions">
            {suggestions.map((email, index) => (
              <li key={index} onClick={() => {
                setFormData({ ...formData, to: formData.to + (formData.to ? ', ' : '') + email });
                setQuery('');
                setSuggestions([]);
              }}>
                {email}
              </li>
            ))}
          </ul>
        </div>
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">Send</button>
      </form>
      <Modal isOpen={modalOpen} onClose={closeModal} message={modalMessage} />
    </div>
  );
}

export default App;
