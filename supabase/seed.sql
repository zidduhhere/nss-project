SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'a88ef85f-c5f1-4656-be40-6f7265d7df4f', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"abialifhere@gmail.com","user_id":"fab5817d-ebb2-4105-92ab-bd592997aba1","user_phone":""}}', '2025-09-11 09:01:49.078015+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd321c4ab-7b64-4213-8158-4413ac2b33b2', '{"action":"login","actor_id":"fab5817d-ebb2-4105-92ab-bd592997aba1","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-11 09:02:17.763095+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dad64171-8cd3-4ff2-9f4b-9304d8b22664', '{"action":"login","actor_id":"fab5817d-ebb2-4105-92ab-bd592997aba1","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-11 09:02:19.008589+00', ''),
	('00000000-0000-0000-0000-000000000000', '0376c2e1-e3e9-4925-843c-b7c269a82ba1', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"abialifhere@gmail.com","user_id":"fab5817d-ebb2-4105-92ab-bd592997aba1","user_phone":""}}', '2025-09-11 09:03:02.237377+00', ''),
	('00000000-0000-0000-0000-000000000000', '09a1bd07-0e1c-4ca1-800a-5b052ed1398b', '{"action":"user_confirmation_requested","actor_id":"803ebd6f-d9f3-4391-87e3-5dd0e81b5d60","actor_username":"abialifiam@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-11 09:12:20.396261+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b9557b6-ce57-4d62-ad4c-599c3e43e44c', '{"action":"user_confirmation_requested","actor_id":"09999951-7945-4270-b7f1-79fb3ca0194b","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 08:16:03.858762+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f59730e-f5e2-4ed0-903b-7329d6572b1b', '{"action":"user_confirmation_requested","actor_id":"09999951-7945-4270-b7f1-79fb3ca0194b","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 08:17:37.896363+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e49636a2-2eb7-484b-b25e-d40f6757d097', '{"action":"user_confirmation_requested","actor_id":"09999951-7945-4270-b7f1-79fb3ca0194b","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 08:19:49.343909+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c3de229-9314-4378-b2f7-632dad757a98', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"abialifiam@gmail.com","user_id":"803ebd6f-d9f3-4391-87e3-5dd0e81b5d60","user_phone":""}}', '2025-09-13 08:20:40.338807+00', ''),
	('00000000-0000-0000-0000-000000000000', '50ad53e6-8c56-481d-a11e-deaf29fee646', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"abialifhere@gmail.com","user_id":"09999951-7945-4270-b7f1-79fb3ca0194b","user_phone":""}}', '2025-09-13 08:20:41.286496+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a1e9a17b-ecdd-49ee-b2f3-5ad0656b4729', '{"action":"user_confirmation_requested","actor_id":"efc405e9-ae1a-495c-a836-4faa8ffc1c15","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 08:47:15.053196+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8ab1337-20e9-48e5-a68f-7342de7b061c', '{"action":"user_confirmation_requested","actor_id":"efc405e9-ae1a-495c-a836-4faa8ffc1c15","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 08:54:29.698231+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf542af9-45b7-4cd8-9595-dbef3b8f6e5e', '{"action":"user_confirmation_requested","actor_id":"efc405e9-ae1a-495c-a836-4faa8ffc1c15","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 09:01:50.281616+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbf5caa3-eb55-47a8-b6dd-dda0d852f44d', '{"action":"user_confirmation_requested","actor_id":"efc405e9-ae1a-495c-a836-4faa8ffc1c15","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 09:02:57.303758+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b89da54a-a31e-4652-8c0f-8e03a83017ae', '{"action":"user_confirmation_requested","actor_id":"efc405e9-ae1a-495c-a836-4faa8ffc1c15","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 09:04:06.9166+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b81d122-3a87-4538-a2f2-9809f3f430ac', '{"action":"user_confirmation_requested","actor_id":"efc405e9-ae1a-495c-a836-4faa8ffc1c15","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 09:08:29.310201+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c47641c5-ec71-4570-b165-3b1eca4320d7', '{"action":"user_confirmation_requested","actor_id":"efc405e9-ae1a-495c-a836-4faa8ffc1c15","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 09:09:30.151918+00', ''),
	('00000000-0000-0000-0000-000000000000', '1fac040f-1eec-4083-9bde-58fbcebb91cb', '{"action":"user_confirmation_requested","actor_id":"cab35bfa-7cd2-40a7-8e07-3458e352ce14","actor_username":"iamsiduhh@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 19:59:07.507908+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a83fb1c3-fcac-4c70-856c-8c34a6d75ee1', '{"action":"user_confirmation_requested","actor_id":"cab35bfa-7cd2-40a7-8e07-3458e352ce14","actor_username":"iamsiduhh@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 20:01:50.452571+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6c02df4-9790-48df-a433-81e6a492eab7', '{"action":"user_confirmation_requested","actor_id":"cab35bfa-7cd2-40a7-8e07-3458e352ce14","actor_username":"iamsiduhh@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 20:03:32.479611+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eae5bf51-24fe-4f6d-a001-3770a5c419ce', '{"action":"user_confirmation_requested","actor_id":"cab35bfa-7cd2-40a7-8e07-3458e352ce14","actor_username":"iamsiduhh@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 20:13:42.326444+00', ''),
	('00000000-0000-0000-0000-000000000000', '40316c15-59d4-4117-bb91-ef31e457f2fc', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 10:57:12.247776+00', ''),
	('00000000-0000-0000-0000-000000000000', '77828367-98bb-429a-8cdd-6e2ac4b90dd2', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"abialifhere@gmail.com","user_id":"efc405e9-ae1a-495c-a836-4faa8ffc1c15","user_phone":""}}', '2025-09-13 20:41:18.32183+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cb47567f-71f3-4df0-ae9e-90b78529b8d1', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"iamsiduhh@gmail.com","user_id":"cab35bfa-7cd2-40a7-8e07-3458e352ce14","user_phone":""}}', '2025-09-13 20:41:18.326833+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd13ea095-d6e3-44ec-b44e-a4c393dce0c4', '{"action":"user_confirmation_requested","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-09-13 20:42:21.886654+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e480eab-2081-43c9-ab1d-86469d52f6da', '{"action":"user_signedup","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-13 20:46:00.605628+00', ''),
	('00000000-0000-0000-0000-000000000000', '9cffa6ec-fa78-4165-8c5d-31096770d817', '{"action":"login","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-13 20:46:00.621454+00', ''),
	('00000000-0000-0000-0000-000000000000', '95e6b82c-53a3-42d6-b429-22fd5ca16c7b', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 02:00:13.631766+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f263449-9c89-4451-9def-0bb51acaa43f', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 02:00:13.65917+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe6eff49-326d-4df2-9849-5f60785bf429', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 04:33:36.093271+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c59fde3-22b3-4127-91ef-00e00c176166', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 04:33:36.099274+00', ''),
	('00000000-0000-0000-0000-000000000000', '74e7a96d-f230-4843-8b21-0e0dfae6ba9f', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 09:51:29.463115+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8ecdf83-bed6-4df0-8776-26806a7b2f8f', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 09:51:29.489538+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f04895df-7612-484b-839c-1c1917617897', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 12:20:14.414443+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ff3db5d-d665-462a-aaed-e267bb410509', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 12:20:14.435753+00', ''),
	('00000000-0000-0000-0000-000000000000', '612791f3-1a0f-49b0-92c7-14b48377f6cb', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 13:45:02.271982+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2ad1b87-8bce-481d-bd60-213a2f7a87b1', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 13:45:02.291036+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed17d232-b41d-443f-b1bb-c34c57d0cddc', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 17:45:43.462631+00', ''),
	('00000000-0000-0000-0000-000000000000', '35b47a2e-6a08-4415-99b7-831fc799fba7', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-14 17:45:43.473699+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abf8be33-3a27-4c8f-a5f5-0057a4ede13e', '{"action":"user_signedup","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-09-15 05:50:51.855813+00', ''),
	('00000000-0000-0000-0000-000000000000', '3167f6fa-96ca-49d5-a357-2e984b24870b', '{"action":"login","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-15 05:50:51.879703+00', ''),
	('00000000-0000-0000-0000-000000000000', '4052b610-cc29-4741-8141-2762ea9ffc03', '{"action":"login","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-15 05:53:11.583551+00', ''),
	('00000000-0000-0000-0000-000000000000', '0395ed62-59c8-4ac4-aba8-e28c267ca587', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 05:56:02.385608+00', ''),
	('00000000-0000-0000-0000-000000000000', '1ef2775e-becf-449a-996b-a5638e3a0416', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 05:56:02.393073+00', ''),
	('00000000-0000-0000-0000-000000000000', '8b9c9a8a-7195-4eb9-abe2-f8fdb914bf81', '{"action":"login","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-15 05:56:37.055479+00', ''),
	('00000000-0000-0000-0000-000000000000', '5047f01c-b7f7-417b-a616-5968ee643a3e', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 06:54:51.304749+00', ''),
	('00000000-0000-0000-0000-000000000000', '377238e8-5baa-46a1-96b7-05e39804a1ae', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 06:54:51.314046+00', ''),
	('00000000-0000-0000-0000-000000000000', '465d8a2e-d4f6-4c7a-a5d5-ce96ec5526cf', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 08:09:59.568807+00', ''),
	('00000000-0000-0000-0000-000000000000', '66d0c775-8318-4626-ae54-c45f3e2d4bed', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 08:09:59.575313+00', ''),
	('00000000-0000-0000-0000-000000000000', '17263d79-89ca-4066-8b4d-5e2e33ef3831', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 09:00:25.583573+00', ''),
	('00000000-0000-0000-0000-000000000000', '87388f9a-a864-444a-8335-e45fb96b3ac8', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 09:00:25.607422+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c7e37006-d86e-4d85-bccc-c3d7ab896a58', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 09:38:59.243876+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9b9ad4e-564b-4f64-8311-b06bc483c6e2', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 09:38:59.256581+00', ''),
	('00000000-0000-0000-0000-000000000000', '787774be-24da-4423-ba4e-e1355ba0d274', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 10:57:12.257949+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e15a4b8-f033-4c8a-8324-02abc1f945d5', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 13:05:41.853615+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a03b4d4a-62fb-4679-aa2d-6b4325bc89da', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 13:05:41.875037+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d849ab1-dbd1-4a51-ad70-429a99ba42aa', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 18:37:58.904625+00', ''),
	('00000000-0000-0000-0000-000000000000', '1a31ffc1-c4ac-43cf-af4a-8a3af8914b9e', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-15 18:37:58.923272+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c89dda1-2075-4611-b9ea-db79d2cf2695', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 08:20:00.187396+00', ''),
	('00000000-0000-0000-0000-000000000000', '763c75af-3037-46a9-8faa-3b099e08d9c3', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 08:20:00.214889+00', ''),
	('00000000-0000-0000-0000-000000000000', '28955f39-b696-4588-875e-0559e1010544', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 08:27:35.95358+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4f83f93-807b-47b1-9fca-31e900f6614d', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 08:27:35.965195+00', ''),
	('00000000-0000-0000-0000-000000000000', '60cf91b0-229b-450b-9073-888ef90b71e4', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 09:19:47.444233+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df197116-305c-49f5-930c-df2b4fb8cb23', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 09:19:47.454963+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd2798c90-8795-4dee-bf91-ada569f1c6cb', '{"action":"token_refreshed","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 09:28:54.933349+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ff95b7a4-0054-48a4-8aae-7ae6d93217d9', '{"action":"token_revoked","actor_id":"4aa75235-24c9-4399-afb4-7bc2fe2f60d8","actor_username":"abialifhere@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-16 09:28:54.936164+00', ''),
	('00000000-0000-0000-0000-000000000000', '531a8075-a98f-4284-83c6-0f3b15b4561d', '{"action":"login","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-17 05:42:07.973595+00', ''),
	('00000000-0000-0000-0000-000000000000', '3f17b746-d4bd-4854-9c51-3d1629903ad7', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 16:58:28.568896+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aff27637-4415-4798-bbef-b47873458570', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 16:58:28.592816+00', ''),
	('00000000-0000-0000-0000-000000000000', '7eec09f4-4872-402a-8426-5fb120920aca', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 17:57:03.501099+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1f04dd4-d2d0-4a9e-a201-38f45f7b8620', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 17:57:03.514768+00', ''),
	('00000000-0000-0000-0000-000000000000', '729ba1ee-4949-4dfb-8f1a-33caf82becbc', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 18:14:02.415701+00', ''),
	('00000000-0000-0000-0000-000000000000', '180ef2d1-a221-4faa-925c-13daef0c29e8', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-17 18:14:02.427097+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bb3b8c6-ba6f-4a92-935e-749435140b3f', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 08:04:14.838796+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f96b5c12-14a0-47ac-adb8-1e5508839e4e', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 08:04:14.866443+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c123a75f-1c66-46d7-82ac-bbeeb904f8ea', '{"action":"login","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 08:04:57.508636+00', ''),
	('00000000-0000-0000-0000-000000000000', '10b0dc4f-0c21-4af4-9246-a89d70b5c7fc', '{"action":"login","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 08:06:40.949972+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abdb3a9d-212b-42f6-9fb2-4156456684b1', '{"action":"login","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-09-18 08:08:57.081766+00', ''),
	('00000000-0000-0000-0000-000000000000', 'acbb3722-2575-4515-bd17-e28a243989f2', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 09:23:13.965716+00', ''),
	('00000000-0000-0000-0000-000000000000', '91d9062d-37f1-4126-8e44-826646e5e8b8', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 09:23:13.97648+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5d3a476-aa8d-4ffe-86cc-a3751d0b4267', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 10:23:24.196042+00', ''),
	('00000000-0000-0000-0000-000000000000', 'db0b762b-56e7-442f-8ac5-457f49c6dcbf', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 10:23:24.207206+00', ''),
	('00000000-0000-0000-0000-000000000000', '52627019-859b-4933-9c73-6bbacd2a3ba2', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:07:17.213491+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c34aaf1-1a8e-4c6d-ae95-045e7609b319', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 16:07:17.237793+00', ''),
	('00000000-0000-0000-0000-000000000000', '871b9f6b-f3d4-4674-8eb9-2a02ffc5e382', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 17:21:18.984672+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2e37227-2cc7-4b2b-9712-b9eee2933f26', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 17:21:19.002247+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1d08cbc-710a-4cbe-a838-b78d440b40e9', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 19:40:03.192891+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd9c1dfbe-46dd-4900-b868-5b626a76e84f', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 19:40:03.217802+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd52f4343-28ff-4ec6-9d41-52432491a51e', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 22:42:22.178346+00', ''),
	('00000000-0000-0000-0000-000000000000', 'abc73444-726a-4239-8f12-a6be61374aeb', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 22:42:22.196483+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3e47a68-6068-4838-8748-f56ddf04aa7b', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-18 23:25:01.736907+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e464e37-8c9b-4d83-ba48-da3e0c0c8bd1', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 04:30:53.776871+00', ''),
	('00000000-0000-0000-0000-000000000000', '256660d4-454e-4909-9cf1-f37555b17873', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 04:30:53.792851+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e28b925-ff7a-4061-84b5-34b6f4bffbcb', '{"action":"token_refreshed","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 07:24:15.552844+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a5b0863-695f-41e9-8f5e-4ab872f3db72', '{"action":"token_revoked","actor_id":"21fc5977-7876-4c0d-894d-2812ba940994","actor_username":"aleenajaison369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-09-19 07:24:15.58261+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', 'authenticated', 'authenticated', 'abialifhere@gmail.com', '$2a$10$IxPDIY9EpGSzMKeefHkTv.Ml6LDX6jPP8ncTfIk2NJO7vS3hTxcMm', '2025-09-13 20:46:00.614245+00', NULL, '', '2025-09-13 20:42:21.887546+00', '', NULL, '', '', NULL, '2025-09-13 20:46:00.622113+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "4aa75235-24c9-4399-afb4-7bc2fe2f60d8", "email": "abialifhere@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-09-13 20:42:21.870146+00', '2025-09-16 09:28:54.942182+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '21fc5977-7876-4c0d-894d-2812ba940994', 'authenticated', 'authenticated', 'aleenajaison369@gmail.com', '$2a$10$LIp6/77Rw0PEzNRJlhl2a.4G4fXWgYNvgg7XHqtorTc2qM98/887u', '2025-09-15 05:50:51.865766+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-09-18 08:08:57.082852+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "21fc5977-7876-4c0d-894d-2812ba940994", "email": "aleenajaison369@gmail.com", "email_verified": true, "phone_verified": false}', NULL, '2025-09-15 05:50:51.797495+00', '2025-09-19 07:24:15.624269+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('4aa75235-24c9-4399-afb4-7bc2fe2f60d8', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', '{"sub": "4aa75235-24c9-4399-afb4-7bc2fe2f60d8", "email": "abialifhere@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-13 20:42:21.881459+00', '2025-09-13 20:42:21.881512+00', '2025-09-13 20:42:21.881512+00', 'e878cc42-e6fb-4629-9064-d73dadec5b1b'),
	('21fc5977-7876-4c0d-894d-2812ba940994', '21fc5977-7876-4c0d-894d-2812ba940994', '{"sub": "21fc5977-7876-4c0d-894d-2812ba940994", "email": "aleenajaison369@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-09-15 05:50:51.834997+00', '2025-09-15 05:50:51.835617+00', '2025-09-15 05:50:51.835617+00', '16780a5e-c95a-43f7-9ea5-39f907b7020c');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id") VALUES
	('1552425d-5124-438c-8014-ec29e79e327c', '21fc5977-7876-4c0d-894d-2812ba940994', '2025-09-15 05:50:51.881722+00', '2025-09-15 05:50:51.881722+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15', '116.68.65.114', NULL, NULL),
	('2d5a9b11-ce3f-4e3f-b6ec-626c7a0721c1', '21fc5977-7876-4c0d-894d-2812ba940994', '2025-09-15 05:53:11.587753+00', '2025-09-15 05:53:11.587753+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15', '116.68.65.114', NULL, NULL),
	('0659df76-03b6-44e7-bbed-09d72e3ff66e', '21fc5977-7876-4c0d-894d-2812ba940994', '2025-09-18 08:08:57.082926+00', '2025-09-19 07:24:15.635446+00', NULL, 'aal1', NULL, '2025-09-19 07:24:15.634809', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '111.92.9.105', NULL, NULL),
	('cb212a7c-caaf-47e0-95a4-d6229ee7cbe2', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', '2025-09-13 20:46:00.622845+00', '2025-09-16 09:28:54.948491+00', NULL, 'aal1', NULL, '2025-09-16 09:28:54.948406', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '116.68.65.114', NULL, NULL),
	('0832d057-f36f-468a-a6d6-92b0e2a7b831', '21fc5977-7876-4c0d-894d-2812ba940994', '2025-09-17 05:42:08.00392+00', '2025-09-17 17:57:03.537274+00', NULL, 'aal1', NULL, '2025-09-17 17:57:03.536704', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15', '116.68.65.114', NULL, NULL),
	('da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb', '21fc5977-7876-4c0d-894d-2812ba940994', '2025-09-15 05:56:37.060252+00', '2025-09-18 08:04:14.917375+00', NULL, 'aal1', NULL, '2025-09-18 08:04:14.916759', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15', '111.92.9.105', NULL, NULL),
	('a751b4ba-4578-4007-911d-5f58c8a5f86d', '21fc5977-7876-4c0d-894d-2812ba940994', '2025-09-18 08:04:57.511186+00', '2025-09-18 08:04:57.511186+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15', '111.92.9.105', NULL, NULL),
	('f4adcf36-44e1-4fc1-bd2f-541ea04235ac', '21fc5977-7876-4c0d-894d-2812ba940994', '2025-09-18 08:06:40.951872+00', '2025-09-18 08:06:40.951872+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', '111.92.9.105', NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('cb212a7c-caaf-47e0-95a4-d6229ee7cbe2', '2025-09-13 20:46:00.644205+00', '2025-09-13 20:46:00.644205+00', 'password', '53fc0c70-43c1-4a58-a992-15b3d53825e7'),
	('1552425d-5124-438c-8014-ec29e79e327c', '2025-09-15 05:50:51.921298+00', '2025-09-15 05:50:51.921298+00', 'password', '3035d7a0-fa7d-4bc1-87f4-9b8a24977114'),
	('2d5a9b11-ce3f-4e3f-b6ec-626c7a0721c1', '2025-09-15 05:53:11.593142+00', '2025-09-15 05:53:11.593142+00', 'password', '641b6c65-8431-4ad6-893c-8648c6f749a8'),
	('da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb', '2025-09-15 05:56:37.067092+00', '2025-09-15 05:56:37.067092+00', 'password', '358c315e-670d-400c-9594-767af9c1679d'),
	('0832d057-f36f-468a-a6d6-92b0e2a7b831', '2025-09-17 05:42:08.072515+00', '2025-09-17 05:42:08.072515+00', 'password', '6f81bfd2-b8e5-4fa5-9c32-3b7b1f11a1db'),
	('a751b4ba-4578-4007-911d-5f58c8a5f86d', '2025-09-18 08:04:57.526976+00', '2025-09-18 08:04:57.526976+00', 'password', '87f99596-2c68-43c5-982f-ce4694a94728'),
	('f4adcf36-44e1-4fc1-bd2f-541ea04235ac', '2025-09-18 08:06:40.957842+00', '2025-09-18 08:06:40.957842+00', 'password', '7476bc6d-7953-4b6f-bd3a-c42e4a31a89f'),
	('0659df76-03b6-44e7-bbed-09d72e3ff66e', '2025-09-18 08:08:57.086393+00', '2025-09-18 08:08:57.086393+00', 'password', 'aaab173f-a6a3-42a9-9fc3-415422875b58');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 3, 'krmhb5bsnkhz', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-13 20:46:00.628183+00', '2025-09-14 02:00:13.659963+00', NULL, 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 4, 'axotglprgzt2', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-14 02:00:13.680371+00', '2025-09-14 04:33:36.100871+00', 'krmhb5bsnkhz', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 5, 'd7s7ruigr4bk', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-14 04:33:36.108368+00', '2025-09-14 09:51:29.491555+00', 'axotglprgzt2', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 6, 'x7mnumc6yf3u', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-14 09:51:29.514536+00', '2025-09-14 12:20:14.436435+00', 'd7s7ruigr4bk', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 7, 'yzh3eaauplq5', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-14 12:20:14.451058+00', '2025-09-14 13:45:02.291862+00', 'x7mnumc6yf3u', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 8, 'fxtr4fqqh6t6', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-14 13:45:02.307881+00', '2025-09-14 17:45:43.476804+00', 'yzh3eaauplq5', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 10, 'uydsa6aod5ij', '21fc5977-7876-4c0d-894d-2812ba940994', false, '2025-09-15 05:50:51.893173+00', '2025-09-15 05:50:51.893173+00', NULL, '1552425d-5124-438c-8014-ec29e79e327c'),
	('00000000-0000-0000-0000-000000000000', 11, 'bxmkumryeue4', '21fc5977-7876-4c0d-894d-2812ba940994', false, '2025-09-15 05:53:11.589581+00', '2025-09-15 05:53:11.589581+00', NULL, '2d5a9b11-ce3f-4e3f-b6ec-626c7a0721c1'),
	('00000000-0000-0000-0000-000000000000', 9, '3jnqb2a7k3wv', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-14 17:45:43.484594+00', '2025-09-15 05:56:02.395428+00', 'fxtr4fqqh6t6', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 12, 'ufc65tlgqkce', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-15 05:56:02.404948+00', '2025-09-15 06:54:51.315675+00', '3jnqb2a7k3wv', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 14, 'euo42o4l27ys', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-15 06:54:51.32339+00', '2025-09-15 08:09:59.575986+00', 'ufc65tlgqkce', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 13, '2mpmjimds26x', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-15 05:56:37.062407+00', '2025-09-15 09:00:25.608733+00', NULL, 'da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb'),
	('00000000-0000-0000-0000-000000000000', 15, 'e23c7xefkail', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-15 08:09:59.584928+00', '2025-09-15 09:38:59.257246+00', 'euo42o4l27ys', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 17, 'eznnipx2nuqj', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-15 09:38:59.266251+00', '2025-09-15 10:57:12.262886+00', 'e23c7xefkail', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 18, 'ziyg3fu3fqhm', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-15 10:57:12.273138+00', '2025-09-15 13:05:41.876047+00', 'eznnipx2nuqj', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 16, 'wnn3weqsx7su', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-15 09:00:25.627963+00', '2025-09-15 18:37:58.925682+00', '2mpmjimds26x', 'da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb'),
	('00000000-0000-0000-0000-000000000000', 20, 'ivppebixint7', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-15 18:37:58.939915+00', '2025-09-16 08:20:00.21606+00', 'wnn3weqsx7su', 'da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb'),
	('00000000-0000-0000-0000-000000000000', 19, 'irufmjzqtoz3', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-15 13:05:41.889089+00', '2025-09-16 08:27:35.965895+00', 'ziyg3fu3fqhm', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 21, '65zijsic42z4', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-16 08:20:00.233053+00', '2025-09-16 09:19:47.455663+00', 'ivppebixint7', 'da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb'),
	('00000000-0000-0000-0000-000000000000', 22, 'qc7yq2q2zdtx', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', true, '2025-09-16 08:27:35.969863+00', '2025-09-16 09:28:54.93852+00', 'irufmjzqtoz3', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 24, 'mpgliae6x3gd', '4aa75235-24c9-4399-afb4-7bc2fe2f60d8', false, '2025-09-16 09:28:54.940445+00', '2025-09-16 09:28:54.940445+00', 'qc7yq2q2zdtx', 'cb212a7c-caaf-47e0-95a4-d6229ee7cbe2'),
	('00000000-0000-0000-0000-000000000000', 25, 'haxyamlxtkee', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-17 05:42:08.019947+00', '2025-09-17 16:58:28.595503+00', NULL, '0832d057-f36f-468a-a6d6-92b0e2a7b831'),
	('00000000-0000-0000-0000-000000000000', 26, 'ohqnmn3ic4iv', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-17 16:58:28.612+00', '2025-09-17 17:57:03.515437+00', 'haxyamlxtkee', '0832d057-f36f-468a-a6d6-92b0e2a7b831'),
	('00000000-0000-0000-0000-000000000000', 27, '2s4t7uhtulbk', '21fc5977-7876-4c0d-894d-2812ba940994', false, '2025-09-17 17:57:03.522294+00', '2025-09-17 17:57:03.522294+00', 'ohqnmn3ic4iv', '0832d057-f36f-468a-a6d6-92b0e2a7b831'),
	('00000000-0000-0000-0000-000000000000', 23, 'bkd4e3ddeex6', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-16 09:19:47.462575+00', '2025-09-17 18:14:02.428504+00', '65zijsic42z4', 'da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb'),
	('00000000-0000-0000-0000-000000000000', 28, '4futxgwav4p2', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-17 18:14:02.43738+00', '2025-09-18 08:04:14.869554+00', 'bkd4e3ddeex6', 'da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb'),
	('00000000-0000-0000-0000-000000000000', 29, 'vnj6ezjytq7t', '21fc5977-7876-4c0d-894d-2812ba940994', false, '2025-09-18 08:04:14.895419+00', '2025-09-18 08:04:14.895419+00', '4futxgwav4p2', 'da4cea3e-1c2d-415d-86ac-2e0ae4dccbcb'),
	('00000000-0000-0000-0000-000000000000', 30, 'xl64vf36xgv4', '21fc5977-7876-4c0d-894d-2812ba940994', false, '2025-09-18 08:04:57.520161+00', '2025-09-18 08:04:57.520161+00', NULL, 'a751b4ba-4578-4007-911d-5f58c8a5f86d'),
	('00000000-0000-0000-0000-000000000000', 31, '3abr7h6knwad', '21fc5977-7876-4c0d-894d-2812ba940994', false, '2025-09-18 08:06:40.954487+00', '2025-09-18 08:06:40.954487+00', NULL, 'f4adcf36-44e1-4fc1-bd2f-541ea04235ac'),
	('00000000-0000-0000-0000-000000000000', 32, 'dzgssir3fgu3', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-18 08:08:57.084159+00', '2025-09-18 09:23:13.980175+00', NULL, '0659df76-03b6-44e7-bbed-09d72e3ff66e'),
	('00000000-0000-0000-0000-000000000000', 33, 'o7iubnbm53qt', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-18 09:23:13.987762+00', '2025-09-18 10:23:24.209557+00', 'dzgssir3fgu3', '0659df76-03b6-44e7-bbed-09d72e3ff66e'),
	('00000000-0000-0000-0000-000000000000', 34, 'cawphjtayzc6', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-18 10:23:24.218663+00', '2025-09-18 16:07:17.240751+00', 'o7iubnbm53qt', '0659df76-03b6-44e7-bbed-09d72e3ff66e'),
	('00000000-0000-0000-0000-000000000000', 35, 'iwkh7joqp7wq', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-18 16:07:17.258685+00', '2025-09-18 17:21:19.005131+00', 'cawphjtayzc6', '0659df76-03b6-44e7-bbed-09d72e3ff66e'),
	('00000000-0000-0000-0000-000000000000', 36, 'sxl3zjodj2gx', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-18 17:21:19.018474+00', '2025-09-18 19:40:03.219137+00', 'iwkh7joqp7wq', '0659df76-03b6-44e7-bbed-09d72e3ff66e'),
	('00000000-0000-0000-0000-000000000000', 37, 'e3wehv6nu5ki', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-18 19:40:03.232738+00', '2025-09-18 22:42:22.19723+00', 'sxl3zjodj2gx', '0659df76-03b6-44e7-bbed-09d72e3ff66e'),
	('00000000-0000-0000-0000-000000000000', 38, 'lqq64acrmnbm', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-18 22:42:22.212862+00', '2025-09-19 04:30:53.795019+00', 'e3wehv6nu5ki', '0659df76-03b6-44e7-bbed-09d72e3ff66e'),
	('00000000-0000-0000-0000-000000000000', 39, 'v3ol7zc7x46a', '21fc5977-7876-4c0d-894d-2812ba940994', true, '2025-09-19 04:30:53.809364+00', '2025-09-19 07:24:15.585387+00', 'lqq64acrmnbm', '0659df76-03b6-44e7-bbed-09d72e3ff66e'),
	('00000000-0000-0000-0000-000000000000', 40, 'thnuk4uovznj', '21fc5977-7876-4c0d-894d-2812ba940994', false, '2025-09-19 07:24:15.610937+00', '2025-09-19 07:24:15.610937+00', 'v3ol7zc7x46a', '0659df76-03b6-44e7-bbed-09d72e3ff66e');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: colleges; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: nss_units; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: volunteers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 40, true);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."permissions_id_seq"', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."roles_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
