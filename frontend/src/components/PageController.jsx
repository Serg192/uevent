import { IconButton, Stack, Typography } from "@mui/material";
import React from "react";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const PageController = ({ paginationInfo, setPage }) => {
  let { currentPage, pageSize, total } = paginationInfo;
  currentPage = Number(currentPage);
  total = Number(total);
  pageSize = Number(pageSize);

  return (
    <Stack sx={{m:1}} direction="row" alignItems="center">
      <IconButton
        color={"primary.main"}
        onClick={() => {
          if (currentPage - 1 > 0) setPage(currentPage - 1);
        }}
      >
        <ArrowLeftIcon sx={{ transform: "scale(3)}" }} />
      </IconButton>
      <Typography variant="h3" color="primary">
        {currentPage}
      </Typography>
      <IconButton
        color={"primary.main"}
        onClick={() => {
          if (currentPage * pageSize < total) setPage(currentPage + 1);
        }}
      >
        <ArrowRightIcon sx={{ transform: "scale(3)}" }} />
      </IconButton>
    </Stack>
  );
};

export default PageController;
