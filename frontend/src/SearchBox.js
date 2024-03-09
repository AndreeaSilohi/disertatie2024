import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };
  return (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <TextField
          style={{ marginBottom: "35px", width: "70%" }}
          label="q"
          id="q"
          placeholder="Search products"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">
          <MagnifyingGlass size={32} />
        </Button>
      </div>
    </form>
  );
}
