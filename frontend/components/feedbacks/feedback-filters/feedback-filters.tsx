/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  debounce,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import styles from "./feedback-filters.module.css";

const tags = ["UI", "Performance", "Backend", "Frontend"];
const authors = ["john", "abhishek", "rahul"];

export default function FeedbackFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );

  useEffect(() => {
    setSearchTerm(searchParams.get("search") ?? "");
  }, [searchParams]);

  const updateUrl = (key: string, value: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach((item) => {
        params.append(key, item);
      });
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const debouncedUpdateUrl = useMemo(
    () => debounce((value: string) => updateUrl("search", value), 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams],
  );

  useEffect(() => {
    return () => debouncedUpdateUrl.clear();
  }, [debouncedUpdateUrl]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setSearchTerm(nextValue);
    debouncedUpdateUrl(nextValue);
  };

  const handleMultiSelect =
    (key: string) => (event: SelectChangeEvent<string[]>) => {
      updateUrl(key, event.target.value);
    };

  const selectedTags = searchParams.getAll("tags");
  const selectedAuthors = searchParams.getAll("authors");

  return (
    <Box className={styles.container}>
      <Typography
        color="primary"
        gutterBottom
        variant="h6"
        className={styles.filterText}
      >
        Filters
      </Typography>
      <Box className={styles.filters}>
        <TextField
          label="Search feedback"
          placeholder="Title or description"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.search}
        />
        <FormControl className={styles.select} fullWidth>
          <InputLabel>Tags</InputLabel>
          <Select
            multiple
            value={selectedTags}
            onChange={handleMultiSelect("tags")}
            input={<OutlinedInput label="Tags" />}
          >
            {tags.map((tag) => (
              <MenuItem key={tag} value={tag}>
                {" "}
                {tag}{" "}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={styles.select} fullWidth>
          <InputLabel>Author</InputLabel>
          <Select
            multiple
            value={selectedAuthors}
            onChange={handleMultiSelect("authors")}
            input={<OutlinedInput label="Author" />}
            fullWidth
          >
            {authors.map((author) => (
              <MenuItem key={author} value={author}>
                {" "}
                {author}{" "}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={styles.sort} fullWidth>
          <InputLabel>Sort Score</InputLabel>
          <Select
            value={searchParams.get("sort") ?? "desc"}
            label="Sort Score"
            onChange={(event) => updateUrl("sort", event.target.value)}
          >
            <MenuItem value="desc">Highest first</MenuItem>
            <MenuItem value="asc">Lowest first</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => router.push(pathname)}
          className={styles.clear}
          fullWidth
        >
          Clear
        </Button>
      </Box>
    </Box>
  );
}
