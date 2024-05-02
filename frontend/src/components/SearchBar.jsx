import React from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ setPattern, callback }) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      callback();
    }
  };
  return (
    <div>
      <TextField
        className="text"
        placeholder="Search..."
        variant="standard"
        size="small"
        sx={{
          backgroundColor: "white",
          borderRadius: "20px",
          border: "2px solid #e3e3e3",
          boxShadow: "none",
          p: "1px 10px",
          width: { md: "200px", lg: "500px", sx: "100px" },

          "&:hover": {
            border: "2px solid #e3e3e3",
          },
        }}
        onKeyDown={handleKeyPress}
        onChange={(e) => setPattern(e.target.value)}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <IconButton
              aria-label="search"
              color="inherit"
              sx={{ p: 0 }}
              onClick={() => callback()}
            >
              <SearchIcon />
            </IconButton>
          ),
        }}
      />
    </div>
  );
};

export default SearchBar;
