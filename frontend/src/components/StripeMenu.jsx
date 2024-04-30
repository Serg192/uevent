import React from "react";
import { Stack, Button, Modal, Box, Typography } from "@mui/material";

import {
  useSetupStripeAccountMutation,
  useGetStripeDashboardMutation,
} from "../features/company/companyApiSlice";

const StripeMenu = ({ isOpen, setIsOpen, companyId }) => {
  const [setUpAccount] = useSetupStripeAccountMutation();
  const [getDashboard] = useGetStripeDashboardMutation();
  const handleSetUpAccount = async () => {
    try {
      const response = await setUpAccount({ id: companyId }).unwrap();
      window.open(response.url.url, "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenDashBoard = async () => {
    try {
      const response = await getDashboard({ id: companyId }).unwrap();
      window.open(response.url, "_blank");
    } catch (err) {
      console.log(err);
    }
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
          minWidth: "500px",
          overflow: "auto",
        }}
      >
        <Stack direction="column" spacing={2} alignItems="center">
          <Typography variant="h3">Stripe Options</Typography>
          <Stack direction="row" spacing={2} width="100%">
            <Button
              variant="contained"
              color="info"
              sx={{ width: "50%" }}
              onClick={() => handleSetUpAccount()}
            >
              Set up account
            </Button>
            <Button
              variant="contained"
              color="info"
              sx={{ width: "50%" }}
              onClick={() => handleOpenDashBoard()}
            >
              Open dashbord
            </Button>
          </Stack>
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

export default StripeMenu;
