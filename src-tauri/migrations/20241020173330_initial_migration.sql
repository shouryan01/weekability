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
  account_id int references accounts (id),
  category_id int references categories (id),
  description text default '',
  transaction_date date not null default current_date,
  amount numeric(10, 2) not null default 0.00
);
