import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MagnifyingGlass } from "phosphor-react";

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : "/search");
  };

  return (
    <form onSubmit={submitHandler}>
      <div
        className="form-group"
        style={{ display: "flex", alignItems: "center" }}
      >
        <TextField
          style={{ width: "100px", height: "50px" }}
          label="q"
          id="q"
          placeholder="Search products"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          style={{
            width: "20px",
            borderRadius: "0",
          }}
        >
          <MagnifyingGlass size={28} />
        </Button>
      </div>
    </form>
  );
}
