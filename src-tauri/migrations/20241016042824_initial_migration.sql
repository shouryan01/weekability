create table accounts (
  id int primary key generated always as identity,
  name text not null,
  type text not null,
  balance real not null default 0.00,
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
  amount real not null default 0.00
);