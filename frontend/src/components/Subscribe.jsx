import React, { useEffect, useState } from "react";
import {
  Stack,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
} from "@mui/material";

import { useSubscribeMutation } from "../features/event/eventApiSlice";

const Subscribe = ({ isOpen, setIsOpen, eventId }) => {
  const [code, setCode] = useState();

  const [subscribe] = useSubscribeMutation();

  const handleSubscribe = async () => {
    try {
      let data = { id: eventId };
      if (code?.length) {
        data.data = { code };
      }

      const response = await subscribe(data).unwrap();
      setCode("");
      const url = response.data.url;
      if (url) {
        window.open(url, "_blank");
      }
    } catch (err) {
      console.log(err);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    setCode("");
  }, []);
  return (
    <Modal open={isOpen}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: "500px",
          overflow: "auto",
        }}
      >
        <Stack direction="column" spacing={4}>
          <TextField
            id="promocode"
            label="Promo code"
            type="text"
            variant="outlined"
            required
            fullWidth
            margin="normal"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              sx={{ width: "50%" }}
              onClick={() => handleSubscribe()}
            >
              Subscribe
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={() => setIsOpen(false)}
              sx={{ width: "50%" }}
            >
              Close
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default Subscribe;
