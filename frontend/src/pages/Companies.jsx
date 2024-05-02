import React, { useState, useEffect } from "react";
import { Stack, Typography, Button, Select, MenuItem } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  CompanyPreview,
  EditCompany,
  PageController,
  SearchBar,
} from "../components";

import {
  useGetAllCompaniesMutation,
  useGetFollowedCompaniesMutation,
  useGetMyCompaniesMutation,
} from "../features/company/companyApiSlice";

const Companies = () => {
  const options = ["All", "Followed", "My companies"];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [companies, setCompanies] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [page, setPage] = useState(1);

  const [searchPattern, setSearchPattern] = useState();

  const navigate = useNavigate();
  const userData = useSelector(selectCurrentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [getAll] = useGetAllCompaniesMutation();
  const [getFollowed] = useGetFollowedCompaniesMutation();
  const [getMy] = useGetMyCompaniesMutation();

  const loadCompanies = async () => {
    setPage(1);
    setCompanies([]);

    if (
      (selectedOption === "Followed" || selectedOption === "My companies") &&
      !userData
    ) {
      return;
    }
    try {
      let response = null;
      switch (selectedOption) {
        case "All":
          response = await getAll({
            page,
            pageSize: 10,
            ...(searchPattern?.length && { search: searchPattern }),
          }).unwrap();
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
  };

  useEffect(() => {
    loadCompanies();
  }, [selectedOption, page, isModalOpen]);

  const handleCreate = () => {
    if (!userData) navigate("/login");
    else setIsModalOpen(true);
  };

  const handleSearch = () => {
    loadCompanies();
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
        sx={{ width: { sx: "100%", md: "60%" } }}
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
        <SearchBar setPattern={setSearchPattern} callback={handleSearch} />
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
      {companies?.map((data) => (
        <CompanyPreview key={data._id} companyData={data} />
      ))}
      <EditCompany isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
      {companies?.length ? (
        <PageController paginationInfo={paginationInfo} setPage={setPage} />
      ) : (
        <></>
      )}
    </Stack>
  );
};

export default Companies;
