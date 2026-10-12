"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { User, UserRole } from "@/features/users/users.type";
import {
  getAdminUsers,
  updateUserActions,
} from "@/features/users/users.service";

interface ToastState {
  open: boolean;
  message: string;
  severity: "success" | "error";
}

interface AdminUsersContextType {
  users: User[];
  loading: boolean;
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  search: string;
  updatingUserId: string | null;
  toast: ToastState;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  fetchUsers: () => Promise<void>;
  handleActionToggle: (
    user: User,
    field: "isLoginDisabled" | "hideFeedbacks" | "hideComments",
    currentVal: boolean,
  ) => Promise<void>;
  closeToast: () => void;
}

const AdminUsersContext = createContext<AdminUsersContextType | null>(null);

export function AdminUsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSetSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleSetLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers({ page, limit, search });
      setUsers(res?.data || []);
      setTotal(res?.meta?.total || 0);
      setTotalPages(res?.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setToast({
        open: true,
        message: "Failed to load user list",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    let isSubscribed = true;

    const loadUsers = async () => {
      try {
        const res = await getAdminUsers({ page, limit, search });
        if (isSubscribed) {
          setUsers(res?.data || []);
          setTotal(res?.meta?.total || 0);
          setTotalPages(res?.meta?.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
        if (isSubscribed) {
          setToast({
            open: true,
            message: "Failed to load user list",
            severity: "error",
          });
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isSubscribed = false;
    };
  }, [page, limit, search]);

  const handleActionToggle = async (
    user: User,
    field: "isLoginDisabled" | "hideFeedbacks" | "hideComments",
    currentVal: boolean,
  ) => {
    if (user.role === UserRole.ADMIN && field === "isLoginDisabled") {
      setToast({
        open: true,
        message: "Cannot disable login for primary Admin account",
        severity: "error",
      });
      return;
    }

    const newVal = !currentVal;
    try {
      setUpdatingUserId(user.id);
      const updated = await updateUserActions(user.id, { [field]: newVal });

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, ...updated } : u)),
      );

      const fieldLabels: Record<string, string> = {
        isLoginDisabled: newVal ? "Login Disabled" : "Login Enabled",
        hideFeedbacks: newVal ? "Feedbacks Hidden" : "Feedbacks Visible",
        hideComments: newVal ? "Comments Hidden" : "Comments Visible",
      };

      setToast({
        open: true,
        message: `Action updated for @${user.username}: ${fieldLabels[field]}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Failed to update user actions", err);
      setToast({
        open: true,
        message: "Failed to update action for user",
        severity: "error",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  return (
    <AdminUsersContext.Provider
      value={{
        users,
        loading,
        total,
        totalPages,
        page,
        limit,
        search,
        updatingUserId,
        toast,
        setPage,
        setLimit: handleSetLimit,
        setSearch: handleSetSearch,
        fetchUsers,
        handleActionToggle,
        closeToast,
      }}
    >
      {children}
    </AdminUsersContext.Provider>
  );
}

export function useAdminUsersContext() {
  const context = useContext(AdminUsersContext);
  if (!context) {
    throw new Error(
      "useAdminUsersContext must be used within an AdminUsersProvider",
    );
  }
  return context;
}
