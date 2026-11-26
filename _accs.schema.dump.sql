--
-- PostgreSQL database dump
--

\restrict rurODSyvKwPP55IEgU5ZHBN4kj69GgxLV4e3Ib6Zmu0azOf60nUPrcjhEctcjMZ

-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

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
-- Name: boxid_seq; Type: SEQUENCE; Schema: public; Owner: eugene
--

CREATE SEQUENCE public.boxid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.boxid_seq OWNER TO eugene;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: boxes; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.boxes (
    siteid integer,
    boxid integer DEFAULT nextval('public.boxid_seq'::regclass) NOT NULL,
    slots integer,
    name text
);


ALTER TABLE public.boxes OWNER TO eugene;

--
-- Name: devid_seq; Type: SEQUENCE; Schema: public; Owner: eugene
--

CREATE SEQUENCE public.devid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devid_seq OWNER TO eugene;

--
-- Name: devices; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.devices (
    siteid integer,
    devid integer DEFAULT nextval('public.devid_seq'::regclass) NOT NULL,
    slots integer,
    name text
);


ALTER TABLE public.devices OWNER TO eugene;

--
-- Name: log; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.log (
    siteid integer,
    date timestamp without time zone,
    devid integer,
    accid integer,
    flg smallint,
    cap smallint
);


ALTER TABLE public.log OWNER TO eugene;

--
-- Name: siteid_seq; Type: SEQUENCE; Schema: public; Owner: eugene
--

CREATE SEQUENCE public.siteid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.siteid_seq OWNER TO eugene;

--
-- Name: sites; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.sites (
    siteid integer DEFAULT nextval('public.siteid_seq'::regclass) NOT NULL,
    name text
);


ALTER TABLE public.sites OWNER TO eugene;

--
-- Name: storage; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.storage (
    siteid integer NOT NULL,
    boxid integer,
    date date,
    accid smallint NOT NULL,
    slot smallint,
    flg smallint,
    cap smallint
);


ALTER TABLE public.storage OWNER TO eugene;

--
-- Name: usage; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.usage (
    siteid integer,
    date date,
    devid integer,
    accid integer
);


ALTER TABLE public.usage OWNER TO eugene;

--
-- Name: boxes boxes_pkey; Type: CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.boxes
    ADD CONSTRAINT boxes_pkey PRIMARY KEY (boxid);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (devid);


--
-- Name: sites sites_pkey; Type: CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.sites
    ADD CONSTRAINT sites_pkey PRIMARY KEY (siteid);


--
-- Name: storage storage_pkey; Type: CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.storage
    ADD CONSTRAINT storage_pkey PRIMARY KEY (siteid, accid);


--
-- Name: storage_siteid_boxid_slot_idx; Type: INDEX; Schema: public; Owner: eugene
--

CREATE UNIQUE INDEX storage_siteid_boxid_slot_idx ON public.storage USING btree (siteid, boxid, slot);


--
-- Name: usage_siteid_accid_devid_date_idx; Type: INDEX; Schema: public; Owner: eugene
--

CREATE UNIQUE INDEX usage_siteid_accid_devid_date_idx ON public.usage USING btree (siteid, accid, devid, date);


--
-- Name: boxes boxes_siteid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.boxes
    ADD CONSTRAINT boxes_siteid_fkey FOREIGN KEY (siteid) REFERENCES public.sites(siteid);


--
-- Name: devices devices_siteid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_siteid_fkey FOREIGN KEY (siteid) REFERENCES public.sites(siteid);


--
-- Name: log log_devid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.log
    ADD CONSTRAINT log_devid_fkey FOREIGN KEY (devid) REFERENCES public.devices(devid);


--
-- Name: log log_siteid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.log
    ADD CONSTRAINT log_siteid_fkey FOREIGN KEY (siteid) REFERENCES public.sites(siteid);


--
-- Name: storage storage_boxid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.storage
    ADD CONSTRAINT storage_boxid_fkey FOREIGN KEY (boxid) REFERENCES public.boxes(boxid);


--
-- Name: storage storage_siteid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.storage
    ADD CONSTRAINT storage_siteid_fkey FOREIGN KEY (siteid) REFERENCES public.sites(siteid);


--
-- Name: usage usage_devid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT usage_devid_fkey FOREIGN KEY (devid) REFERENCES public.devices(devid);


--
-- Name: usage usage_siteid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.usage
    ADD CONSTRAINT usage_siteid_fkey FOREIGN KEY (siteid) REFERENCES public.sites(siteid);


--
-- PostgreSQL database dump complete
--

\unrestrict rurODSyvKwPP55IEgU5ZHBN4kj69GgxLV4e3Ib6Zmu0azOf60nUPrcjhEctcjMZ

