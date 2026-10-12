"use client";

import {
  Avatar,
  Box,
  Chip,
  FormControlLabel,
  Switch,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CommentBankRoundedIcon from "@mui/icons-material/CommentBankRounded";
import { User, UserRole } from "@/features/users/users.type";
import styles from "./table.module.css";
import { useAdminUsersContext } from "../../context/admin-users-context";

interface UserTableRowProps {
  user: User;
}

export default function UserTableRow({ user }: UserTableRowProps) {
  const { updatingUserId, handleActionToggle } = useAdminUsersContext();

  const isUpdating = updatingUserId === user.id;
  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <TableRow hover>
      <TableCell>
        <Box className={styles.userInfo}>
          <Avatar className={isAdmin ? styles.adminAvatar : styles.userAvatar}>
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" className={styles.userName}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              @{user.username} • {user.email}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Chip
          label={user.role.toUpperCase()}
          color={isAdmin ? "primary" : "default"}
          size="small"
          variant={isAdmin ? "filled" : "outlined"}
        />
      </TableCell>

      <TableCell>
        <Box className={styles.badgeStack}>
          {user.isLoginDisabled && (
            <Tooltip title="Login disabled for this user">
              <Chip
                icon={<BlockRoundedIcon fontSize="small" />}
                label="Disabled Login"
                color="error"
                size="small"
              />
            </Tooltip>
          )}
          {user.hideFeedbacks && (
            <Tooltip title="All feedbacks created by user are hidden">
              <Chip
                icon={<VisibilityOffRoundedIcon fontSize="small" />}
                label="Hidden Feedbacks"
                color="warning"
                size="small"
              />
            </Tooltip>
          )}
          {user.hideComments && (
            <Tooltip title="All comments by user are hidden">
              <Chip
                icon={<CommentBankRoundedIcon fontSize="small" />}
                label="Hidden Comments"
                color="secondary"
                size="small"
              />
            </Tooltip>
          )}
          {!user.isLoginDisabled &&
            !user.hideFeedbacks &&
            !user.hideComments && (
              <Chip
                label="Active"
                color="success"
                size="small"
                variant="outlined"
              />
            )}
        </Box>
      </TableCell>

      <TableCell>
        <Box className={styles.actionCell}>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(user.isLoginDisabled)}
                onChange={() =>
                  handleActionToggle(
                    user,
                    "isLoginDisabled",
                    Boolean(user.isLoginDisabled),
                  )
                }
                disabled={isUpdating || isAdmin}
                color="error"
                size="small"
              />
            }
            label={
              <Typography variant="body2" className={styles.switchLabel}>
                Disable Login
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(user.hideFeedbacks)}
                onChange={() =>
                  handleActionToggle(
                    user,
                    "hideFeedbacks",
                    Boolean(user.hideFeedbacks),
                  )
                }
                disabled={isUpdating}
                color="warning"
                size="small"
              />
            }
            label={
              <Typography variant="body2" className={styles.switchLabel}>
                Hide Feedbacks
              </Typography>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={Boolean(user.hideComments)}
                onChange={() =>
                  handleActionToggle(
                    user,
                    "hideComments",
                    Boolean(user.hideComments),
                  )
                }
                disabled={isUpdating}
                color="secondary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" className={styles.switchLabel}>
                Hide Comments
              </Typography>
            }
          />
        </Box>
      </TableCell>
    </TableRow>
  );
}
