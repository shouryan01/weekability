create table accounts (
  id integer primary key autoincrement,
  name text not null default '',
  account_type text not null default '',
  balance numeric not null default 0.00,
  opened text not null default (date())
);

create table categories (
  id integer primary key autoincrement,
  name text not null default ''
);

create table transactions (
  id integer primary key autoincrement,
  account_id integer not null,
  category_id integer not null,
  description text not null default '',
  transaction_date text not null default (date()),
  amount numeric not null default 0.00,
  foreign key (account_id) references accounts (id),
  foreign key (category_id) references categories (id)
);