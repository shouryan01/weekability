create table accounts (
  id int primary key generated always as identity,
  name text not null,
  type text not null,
  balance numeric(9, 2) not null default 0.00,
  opened date not null default current_date
);

create table categories (
  id int primary key generated always as identity,
  name text not null
);

create table transactions (
  id int primary key generated always as identity,
  account_id int references accounts (id),
  category_id int references categories (id),
  description text,
  transaction_date date not null default current_date,
  amount numeric(9, 2) not null default 0.00
);