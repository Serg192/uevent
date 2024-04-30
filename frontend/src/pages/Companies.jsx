import React, { useState, useEffect } from "react";
import { Stack, Typography, Button, Select, MenuItem } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { CompanyPreview, CreateCompany, PageController } from "../components";

import {
  useGetAllCompaniesMutation,
  useGetFollowedCompaniesMutation,
  useGetMyCompaniesMutation,
} from "../features/company/companyApiSlice";

const Companies = () => {
  const options = ["All", "Followed", "My companies"];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [displayCompanies, setDisplayCompanies] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const userData = useSelector(selectCurrentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [getAll] = useGetAllCompaniesMutation();
  const [getFollowed] = useGetFollowedCompaniesMutation();
  const [getMy] = useGetMyCompaniesMutation();

  const loadCompanies = async () => {
    if (displayCompanies) {
      setPage(1);
      setCompanies([]);
      try {
        // This should be optimized on the backend
        let response = null;
        switch (selectedOption) {
          case "All":
            response = await getAll({ page, pageSize: 10 }).unwrap();
            setCompanies(response.data.data);
            break;
          case "Followed":
            response = await getFollowed({ page, pageSize: 10 }).unwrap();
            setCompanies(response.data.data);
            break;
          case "My companies":
            response = await getMy({ page, pageSize: 10 }).unwrap();
            setCompanies(response.data.data);
            break;
          default:
        }
        if (response) {
          setPaginationInfo({
            currentPage: response.data.currentPage,
            pageSize: response.data.pageSize,
            total: response.data.total,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    console.log(`${selectedOption}`);
    setDisplayCompanies(!(selectedOption !== "All" && !userData));
    console.log("Display companies: ", displayCompanies);
    loadCompanies();
  }, [selectedOption, page]);

  const handleCreate = () => {
    if (!userData) navigate("/login");
    else setIsModalOpen(true);
  };

  return (
    <Stack
      direction="column"
      width="100%"
      alignItems="center"
      mt="30px"
      mb="30px"
      spacing={2}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ width: "60%" }}
      >
        <Typography variant="h2">Companies</Typography>
        <Select
          value={selectedOption}
          onChange={(event) => setSelectedOption(event.target.value)}
          displayEmpty
          variant="outlined"
          fullWidth
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          onClick={handleCreate}
          startIcon={<AddIcon />}
          sx={{ pl: 5, pr: 5 }}
        >
          Create
        </Button>
      </Stack>
      {selectedOption !== "All" && !userData && (
        <Typography variant="h4">You should log in to see this data</Typography>
      )}
      {displayCompanies &&
        companies?.map((data) => <CompanyPreview companyData={data} />)}
      <CreateCompany isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      {companies?.length ? (
        <PageController paginationInfo={paginationInfo} setPage={setPage} />
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default Companies;
