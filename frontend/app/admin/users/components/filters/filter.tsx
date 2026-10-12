"use client";

import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import styles from "./filter.module.css";
import { useAdminUsersContext } from "../../context/admin-users-context";

export default function UserAdminFilter() {
  const { search, limit, setSearch, setLimit } = useAdminUsersContext();

  return (
    <Box className={styles.filterBar}>
      <TextField
        className={styles.searchField}
        placeholder="Search by name, username, or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon color="action" />
              </InputAdornment>
            ),
          },
        }}
        size="small"
      />

      <FormControl size="small" className={styles.limitControl}>
        <InputLabel>Rows per page</InputLabel>
        <Select
          value={limit}
          label="Rows per page"
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
