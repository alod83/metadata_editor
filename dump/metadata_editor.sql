-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Creato il: Mag 20, 2017 alle 17:33
-- Versione del server: 10.1.10-MariaDB
-- Versione PHP: 7.0.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `metadata_editor`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `cho`
--

CREATE TABLE `cho` (
  `key_id` varchar(10) NOT NULL,
  `cho_id` int(11) NOT NULL,
  `original_title` text NOT NULL,
  `english_title` text NOT NULL,
  `author` text NOT NULL,
  `author_id` varchar(10) NOT NULL,
  `place` text NOT NULL,
  `creation_date` varchar(20) DEFAULT NULL,
  `issue_date` varchar(20) DEFAULT NULL,
  `type` varchar(10) NOT NULL,
  `language` text NOT NULL,
  `linkwiki` varchar(2083) NOT NULL,
  `bio` longtext NOT NULL,
  `picture` varchar(2083) NOT NULL DEFAULT 'http://taskexchange.cochrane.org/assets/default-profile-bfeeabd02c3b38305b18e4c2345fd54dbbd1a0a7bf403a31f08fca4fada50449.png'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `collections`
--

CREATE TABLE `collections` (
  `coll_id` int(11) NOT NULL,
  `coll_name` varchar(50) NOT NULL,
  `coll_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `coll_associations`
--

CREATE TABLE `coll_associations` (
  `coll_id` int(11) NOT NULL,
  `elem_id` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `persons`
--

CREATE TABLE `persons` (
  `key_id` varchar(10) NOT NULL,
  `person_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `surname` text NOT NULL,
  `name_surname` text NOT NULL,
  `was_born` varchar(11) NOT NULL,
  `was_born_year` varchar(11) NOT NULL,
  `died` varchar(11) NOT NULL,
  `died_year` varchar(11) NOT NULL,
  `still_alive` tinyint(1) NOT NULL DEFAULT '0',
  `born_in` text NOT NULL,
  `died_in` text NOT NULL,
  `linkwikiperson` varchar(2083) NOT NULL,
  `linkviafperson` varchar(2083) NOT NULL,
  `bio` longtext NOT NULL,
  `picture` varchar(2083) NOT NULL DEFAULT 'http://taskexchange.cochrane.org/assets/default-profile-bfeeabd02c3b38305b18e4c2345fd54dbbd1a0a7bf403a31f08fca4fada50449.png'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `places`
--

CREATE TABLE `places` (
  `key_id` varchar(10) NOT NULL DEFAULT 'place',
  `location_id` int(11) NOT NULL,
  `original_name` text NOT NULL,
  `english_name` text,
  `country` text,
  `region` text NOT NULL,
  `population` int(11) NOT NULL,
  `latitude` decimal(9,3) NOT NULL,
  `longitude` decimal(9,3) NOT NULL,
  `linkwikipedia` text NOT NULL,
  `linkgeonames` text NOT NULL,
  `description` longtext NOT NULL,
  `picture` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(30) COLLATE utf8_bin NOT NULL,
  `firstname` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `cho`
--
ALTER TABLE `cho`
  ADD PRIMARY KEY (`cho_id`);

--
-- Indici per le tabelle `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`coll_id`);

--
-- Indici per le tabelle `coll_associations`
--
ALTER TABLE `coll_associations`
  ADD PRIMARY KEY (`coll_id`,`elem_id`);

--
-- Indici per le tabelle `persons`
--
ALTER TABLE `persons`
  ADD PRIMARY KEY (`person_id`);

--
-- Indici per le tabelle `places`
--
ALTER TABLE `places`
  ADD PRIMARY KEY (`location_id`);

--
-- Indici per le tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `cho`
--
ALTER TABLE `cho`
  MODIFY `cho_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
--
-- AUTO_INCREMENT per la tabella `collections`
--
ALTER TABLE `collections`
  MODIFY `coll_id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT per la tabella `persons`
--
ALTER TABLE `persons`
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1355;
--
-- AUTO_INCREMENT per la tabella `places`
--
ALTER TABLE `places`
  MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
--
-- AUTO_INCREMENT per la tabella `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
