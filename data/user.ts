import { User } from "@/types/user";

export const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Administrator",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 3,
    name: "Alex Brown",
    email: "alex@example.com",
    role: "User",
    status: "Pending",
  },
  {
    id: 4,
    name: "Emily White",
    email: "emily@example.com",
    role: "Support",
    status: "Inactive",
  },
];
