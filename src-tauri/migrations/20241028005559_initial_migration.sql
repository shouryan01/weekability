create table accounts (
  id int primary key generated always as identity,
  name text not null default '',
  account_type text not null default '',
  balance numeric(10, 2) not null default 0.00,
  opened date not null default current_date
);

create table categories (
  id int primary key generated always as identity,
  name text not null default ''
);

create table transactions (
  id int primary key generated always as identity,
  account_id int references accounts (id) not null default 1,
  category_id int references categories (id) not null default 1,
  description text not null default '',
  transaction_date date not null default current_date,
  amount numeric(10, 2) not null default 0.00
);
