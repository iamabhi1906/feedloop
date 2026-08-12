/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Chip,
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
import { Tag } from "@/features/tags/tag.types";
import { User } from "@/features/users/users.type";
import { getTags } from "@/features/tags/tag.service";
import { getUsers } from "@/features/users/users.service";

export default function FeedbackFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [authorsList, setAuthorsList] = useState<User[]>([]);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") ?? "",
  );

  useEffect(() => {
    let isMounted = true;
    async function fetchFilterData() {
      try {
        const [tagsRes, usersRes] = await Promise.all([
          getTags({ page: 1, limit: 100 }),
          getUsers(),
        ]);
        if (isMounted) {
          if (tagsRes?.data) setTagsList(tagsRes.data);
          if (usersRes) setAuthorsList(usersRes);
        }
      } catch (err) {
        console.error("Failed to load filter options", err);
      }
    }
    fetchFilterData();
    return () => {
      isMounted = false;
    };
  }, []);

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
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((val) => {
                  const tagObj = tagsList.find(
                    (t) => t.id === val || t.name === val,
                  );
                  return (
                    <Chip key={val} label={tagObj ? tagObj.name : val} size="small" />
                  );
                })}
              </Box>
            )}
          >
            {tagsList.map((tag) => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.name}
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
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((val) => {
                  const userObj = authorsList.find(
                    (u) => u.id === val || u.username === val || u.name === val,
                  );
                  return (
                    <Chip
                      key={val}
                      label={userObj ? userObj.name || userObj.username : val}
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
            fullWidth
          >
            {authorsList.map((author) => (
              <MenuItem key={author.id} value={author.id}>
                {author.name || author.username}
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
