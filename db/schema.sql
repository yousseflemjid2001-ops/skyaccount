-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Products (Inventory)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  code text not null,
  name text not null,
  category text,
  buy_price numeric default 0,
  sell_price numeric default 0,
  stock integer default 0,
  min_stock integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Contacts (Customers & Suppliers)
create table public.contacts (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null check (type in ('client', 'supplier')),
  phone text,
  location text,
  balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Accounts (Chart of Accounts)
create table public.accounts (
  id uuid default uuid_generate_v4() primary key,
  code text not null,
  name text not null,
  type text not null, -- Asset, Liability, Equity, Revenue, Expense
  parent_id uuid references public.accounts(id),
  balance numeric default 0,
  is_system boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Transactions (Treasury)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  date date default current_date,
  description text,
  type text not null, -- 'Cash In', 'Cash Out'
  method text, -- 'Cash', 'Bank Transfer', etc.
  amount numeric not null,
  account_id uuid references public.accounts(id),
  contact_id uuid references public.contacts(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Invoices (Sales & Purchases)
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  number text not null,
  type text not null check (type in ('sale', 'purchase')),
  date date default current_date,
  due_date date,
  contact_id uuid references public.contacts(id),
  status text default 'Pending', -- Paid, Pending, Overdue
  total_amount numeric default 0,
  paid_amount numeric default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Invoice Items
create table public.invoice_items (
  id uuid default uuid_generate_v4() primary key,
  invoice_id uuid references public.invoices(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  price numeric not null,
  total numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Optional for now, but good practice)
alter table public.products enable row level security;
create policy "Public access" on public.products for all using (true);

alter table public.contacts enable row level security;
create policy "Public access" on public.contacts for all using (true);

alter table public.accounts enable row level security;
create policy "Public access" on public.accounts for all using (true);

alter table public.transactions enable row level security;
create policy "Public access" on public.transactions for all using (true);

alter table public.invoices enable row level security;
create policy "Public access" on public.invoices for all using (true);

alter table public.invoice_items enable row level security;
create policy "Public access" on public.invoice_items for all using (true);
