import bcrypt from "bcryptjs";

export const usersData = [
  {
    name: "Andreea Silohi",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin:true,
  },
  {
    name: "Ion Popescu",
    email: "user@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: false,
  },
];
