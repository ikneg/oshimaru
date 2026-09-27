begin;
create extension if not exists pgtap with schema extensions;
select plan(10);

insert into auth.users (id, email, aud, role)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'admin-test@example.invalid', 'authenticated', 'authenticated'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'user-test@example.invalid', 'authenticated', 'authenticated');
insert into public.admin_users (user_id) values ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
insert into public.posters (id,title,image_path,alt_text,starts_at,ends_at,sort_order,is_published,created_by)
values
  ('10000000-0000-4000-8000-000000000001','公開中','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/public.jpg','公開中',null,null,1,true,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  ('10000000-0000-4000-8000-000000000002','非公開','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/private.jpg','非公開',null,null,2,false,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  ('10000000-0000-4000-8000-000000000003','開始前','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/future.jpg','開始前',now()+interval '1 day',null,3,true,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),
  ('10000000-0000-4000-8000-000000000004','終了済み','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/past.jpg','終了済み',null,now()-interval '1 day',4,true,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');

set local role anon;
select is((select count(*)::integer from public.posters), 1, 'anonymous can read exactly one active poster');
select ok(exists(select 1 from public.posters where title='公開中'), 'anonymous can read active poster');
select ok(not exists(select 1 from public.posters where title='非公開'), 'anonymous cannot read unpublished poster');
select ok(not exists(select 1 from public.posters where title in ('開始前','終了済み')), 'anonymous cannot read out-of-period posters');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',true);
select throws_ok($$insert into public.posters(title,image_path,alt_text,sort_order,created_by) values('x','x.jpg','x',9,'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb')$$, '42501', null, 'non-admin cannot insert');
select results_eq($$update public.posters set title='changed' where id='10000000-0000-4000-8000-000000000001' returning id$$, ARRAY[]::uuid[], 'non-admin cannot update hidden admin row');
select results_eq($$delete from public.posters where id='10000000-0000-4000-8000-000000000001' returning id$$, ARRAY[]::uuid[], 'non-admin cannot delete hidden admin row');
select is((select count(*)::integer from public.posters), 1, 'authenticated non-admin still sees only active poster');
reset role;

set local role authenticated;
select set_config('request.jwt.claim.sub','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',true);
select is((select count(*)::integer from public.posters), 4, 'admin can read every poster');
select lives_ok($$insert into public.posters(title,image_path,alt_text,sort_order,created_by) values('管理追加','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/admin.jpg','管理追加',10,'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa')$$, 'admin can insert');
reset role;

select * from finish();
rollback;
