import React, { useEffect, useState } from "react";
import {
  Stack,
  Button,
  Modal,
  Box,
  Typography,
  Divider,
  TextField,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import {
  useCreatePromoCodeMutation,
  useLoadPromoCodesMutation,
  useDeletePromoCodeMutation,
} from "../features/event/eventApiSlice";

import { PageController } from "../components";

const PromoCodes = ({ isOpen, setIsOpen, eventId }) => {
  const [code, setCode] = useState();
  const [codeError, setCodeError] = useState(false);
  const [codeFocus, setCodeFocus] = useState(false);

  const [percent, setPercent] = useState("");
  const [percentError, setPercentError] = useState(false);
  const [percentFocus, setPercentFocus] = useState(false);

  const [myCodes, setMyCodes] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [page, setPage] = useState(1);

  const [createCode] = useCreatePromoCodeMutation();
  const [loadCodes] = useLoadPromoCodesMutation();
  const [deleteCode] = useDeletePromoCodeMutation();

  const loadPromoCodes = async () => {
    try {
      const response = await loadCodes({
        id: eventId,
        page,
        pageSize: 5,
      }).unwrap();
      console.log("Codes loaded", response);
      setMyCodes(response.data.data);
      setPaginationInfo({
        currentPage: response.data.currentPage,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateCode = async () => {
    setCodeError(false);
    setPercentError(false);
    if (code.length <= 5 || code.length >= 50) {
      setCodeError(true);
      setCodeFocus(true);
    } else if (percent < 1 || percent > 95) {
      setPercentError(true);
      setPercentFocus(true);
    } else {
      try {
        await createCode({
          id: eventId,
          data: {
            code,
            discount: percent,
          },
        }).unwrap();
        setCode("");
        setPercent("");
        loadPromoCodes();
      } catch (err) {
        console.log(err);
        if (err.status === 409) {
          alert("Code is already exist");
        }
      }
    }
  };

  const handleCodeDelete = async (id) => {
    try {
      await deleteCode({ eid: eventId, id }).unwrap();
      loadPromoCodes();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPromoCodes();
  }, [page]);

  const createChip = (text) => {
    return (
      <Chip
        label={text}
        style={{
          backgroundColor: "#A619FF",
          color: "#FFFFFF",
          margin: "4px",
          fontSize: 14,
          fontWeight: "bold",
        }}
      />
    );
  };
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
          minWidth: "600px",
          overflow: "auto",
        }}
      >
        <Stack direction="column" alignItems="center">
          <Typography variant="h3">Promo codes</Typography>
          <Divider
            orientation="horizontal"
            sx={{ mt: 1, mb: 3, backgroundColor: "gray" }}
            flexItem
          />
          <Stack
            direction="column"
            spacing={1}
            width="100%"
            alignItems="center"
          >
            {myCodes?.map((c) => (
              <Paper
                elevation={3}
                sx={{
                  alignItems: "start",
                  width: "100%",
                  "&:hover": {
                    transform: "scale(1.01)",
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-beetween">
                  <Stack direction="row" alignItems="center" width="100%">
                    <Typography p={1} sx={{ fontWeight: "bold" }}>
                      {c.code}
                    </Typography>
                    <Typography variant="h5" p={1} sx={{ fontWeight: "bold" }}>
                      Discount: {createChip(c.discount + "%")}
                    </Typography>
                  </Stack>
                  <IconButton
                    color="error"
                    onClick={() => handleCodeDelete(c._id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
            {myCodes?.length ? (
              <PageController
                paginationInfo={paginationInfo}
                setPage={setPage}
              />
            ) : (
              <></>
            )}
          </Stack>

          <Divider
            orientation="horizontal"
            sx={{ mt: 3, mb: 1, backgroundColor: "gray" }}
            flexItem
          />

          <Stack direction="row" width="100%" spacing={2} alignItems="center">
            <TextField
              id="code"
              label="Promo code"
              type="text"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              value={code}
              error={codeError && codeFocus}
              helperText={
                codeError && codeFocus
                  ? "Should have from 5 to 50 characters"
                  : ""
              }
              onFocus={() => setCodeFocus(true)}
              onBlur={() => setCodeFocus(false)}
              onChange={(e) => {
                setCode(e.target.value);
                setCodeError(
                  e.target.value.length <= 5 || e.target.value.length >= 50
                );
              }}
            />
            <TextField
              id="percent"
              label="Discount %"
              type="number"
              variant="outlined"
              required
              fullWidth
              margin="normal"
              inputProps={{ min: 1, max: 95 }}
              value={percent}
              error={percentError && percentFocus}
              helperText={
                percentError && percentFocus ? "Should be between 1 and 95" : ""
              }
              onFocus={() => setPercentFocus(true)}
              onBlur={() => setPercentFocus(false)}
              onChange={(e) => {
                setPercent(e.target.value);
                setPercentError(e.target.value < 1 || e.target.value > 95);
              }}
            />
            <Button
              variant="contained"
              color="info"
              sx={{ height: "60%", pl: 4, pr: 4 }}
              startIcon={<AddIcon />}
              onClick={() => handleCreateCode()}
            >
              Create
            </Button>
          </Stack>
          <Divider
            orientation="horizontal"
            sx={{ mt: 2, mb: 2, backgroundColor: "gray" }}
            flexItem
          />
          <Button
            variant="contained"
            color="warning"
            onClick={() => setIsOpen(false)}
            sx={{ width: "50%" }}
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default PromoCodes;
