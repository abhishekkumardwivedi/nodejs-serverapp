Document is not up to date and but give a generic idea of query needed for debugging purpose.

CREATE DB
---------


CREATE TABLE
------------
create table orders(id int not null auto_increment, primary key (id), table_no int not null, order_req datetime, order_ack datetime, ticket_req datetime, ticket_ack datetime, past varchar(24));

create table orders(id int not null auto_increment, primary key (id), table_no int not null, req datetime, ack datetime, req_type varchar(24));
create table past(table_no int not null, primary key (table_no), past varchar(24));
INSERT INTO TABLE
-----------------

order request:
insert into orders(table_no, order_req, past) value (1, now(), "order_req");

order ack:
update orders set order_ack=now() and past="order_ack" where table_no=1 and order_ack is null and order_req is not null;

ticket request:
update orders set ticket_req=now() and past="ticket_req" where table_no=1 and order_ack is not null;

ticket ack:
update orders set ticket_ack=now() and past="ticket_ack" where table_no=1 and ticket_req is not null and ticket_ack is null;

cancel:

select past from orders where table_no=1 and past is not "ticket_ack" or past is not "order_ack";

--- do something here to delete order row if it was in order_req state
--- or remove ticket_req if it was in such state.
