import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { MagnifyingGlass } from 'phosphor-react';
import './SearchBox.css';

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <TextField
          className="text-field"
          placeholder="Caută produse"
          onChange={(e) => setQuery(e.target.value)}
          style={{
            color: 'red',
            backgroundColor: 'white',
          }}
        />
        <Button
          type="submit"
          style={{
            width: '20px',
          }}
        >
          <MagnifyingGlass size={28} color="#D18C16" />
        </Button>
      </div>
    </form>
  );
}
