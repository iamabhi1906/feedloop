"use client";

import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { Tag } from "@/features/tags/tag.types";

import styles from "./tag-selector.module.css";
import { createTag, getTags } from "@/features/tags/tag.service";

interface TagSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export default function TagSelector({
  value,
  onChange,
  error,
}: TagSelectorProps) {
  const [options, setOptions] = useState<Tag[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const loadTags = async (
    nextPage: number,
    searchValue: string,
    reset = false,
  ) => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await getTags({
        page: nextPage,
        limit: 20,
        search: searchValue,
      });
      setOptions((current) =>
        reset ? result.data : [...current, ...result.data],
      );
      setPage(nextPage);
      setHasMore(nextPage < result.meta.totalPages);
    } catch (err) {
      console.error("Failed to load tags:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTags(1, "");
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      loadTags(1, value, true);
    }, 400);
  };

  const handleScroll = (event: React.SyntheticEvent) => {
    const element = event.currentTarget;
    const nearBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 50;

    if (nearBottom && hasMore && !loading) {
      loadTags(page + 1, search);
    }
  };

  const handleCreateTag = async (name: string) => {
    if (!name.trim() || creating) return;
    setCreating(true);
    try {
      const tag = await createTag(name.trim());
      setOptions((current) => [
        tag,
        ...current.filter((item) => item.id !== tag.id),
      ]);
      onChange([...value, tag.id]);
      setSearch("");
    } catch (err) {
      console.error("Failed to create tag:", err);
    } finally {
      setCreating(false);
    }
  };
  const selectedTags = value.map((id) => {
    const found = options.find((tag) => tag.id === id);
    return found ?? { id, name: "Loading..." };
  });

  return (
    <Box className={styles.container}>
      <Typography className={styles.label}>Tags</Typography>
      <Autocomplete
        multiple
        options={options}
        value={selectedTags}
        loading={loading || creating}
        filterOptions={(items) => items}
        getOptionLabel={(option) => option.name || ""}
        isOptionEqualToValue={(option, val) => option.id === val.id}
        onChange={(_, items) => {
          onChange(items.map((item) => item.id));
        }}
        inputValue={search}
        onInputChange={(_, inputValue, reason) => {
          if (reason === "input") {
            handleSearchChange(inputValue);
          } else if (reason === "clear") {
            setSearch("");
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search or create tags"
            error={Boolean(error)}
            helperText={error ?? "Select existing tags or create a new one"}
          />
        )}
        renderOption={(props, option) => {
          const { ...restProps } = props as React.HTMLAttributes<HTMLLIElement>;
          return (
            <li {...restProps} key={option.id}>
              {option.name}
            </li>
          );
        }}
        slotProps={{
          listbox: {
            onScroll: handleScroll,
          },
        }}
        noOptionsText={search ? `Create "${search}"` : "No tags found"}
      />
      {search &&
        !options.some(
          (tag) => tag.name.toLowerCase() === search.toLowerCase(),
        ) && (
          <Box className={styles.createTag}>
            <Typography>Create new tag:</Typography>

            <button
              type="button"
              disabled={creating}
              onClick={() => handleCreateTag(search)}
            >
              {creating ? "Creating..." : `"${search}"`}
            </button>
          </Box>
        )}
    </Box>
  );
}
