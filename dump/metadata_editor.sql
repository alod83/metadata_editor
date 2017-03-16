-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2017 alle 12:07
-- Versione del server: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `metadata_editor`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `cho`
--

CREATE TABLE IF NOT EXISTS `cho` (
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
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `collections`
--

CREATE TABLE IF NOT EXISTS `collections` (
`coll_id` int(11) NOT NULL,
  `coll_name` varchar(50) NOT NULL,
  `coll_user` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `coll_associations`
--

CREATE TABLE IF NOT EXISTS `coll_associations` (
  `coll_id` int(11) NOT NULL,
  `elem_id` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `persons`
--

CREATE TABLE IF NOT EXISTS `persons` (
  `key_id` varchar(10) NOT NULL,
`person_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `surname` text NOT NULL,
  `name_surname` text NOT NULL,
  `variations` text NOT NULL,
  `was_born` date DEFAULT NULL,
  `was_born_year` int(11) NOT NULL,
  `died` date DEFAULT NULL,
  `died_year` int(11) NOT NULL,
  `still_alive` tinyint(1) NOT NULL DEFAULT '0',
  `born_in` text NOT NULL,
  `died_in` text NOT NULL,
  `linkwikiperson` varchar(2083) NOT NULL,
  `linkviafperson` varchar(2083) NOT NULL,
  `bio` longtext NOT NULL,
  `picture` varchar(2083) NOT NULL DEFAULT 'http://taskexchange.cochrane.org/assets/default-profile-bfeeabd02c3b38305b18e4c2345fd54dbbd1a0a7bf403a31f08fca4fada50449.png'
) ENGINE=MyISAM AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `places`
--

CREATE TABLE IF NOT EXISTS `places` (
  `key_id` varchar(10) NOT NULL DEFAULT 'place',
`location_id` int(11) NOT NULL,
  `original_name` text NOT NULL,
  `english_name` text,
  `country` text,
  `region` text NOT NULL,
  `population` int(11) NOT NULL,
  `latitude` decimal(9,3) NOT NULL,
  `longitude` decimal(9,3) NOT NULL,
  `location` geometry NOT NULL,
  `linkwikipedia` text NOT NULL,
  `linkgeonames` text NOT NULL,
  `description` longtext NOT NULL,
  `picture` varchar(255) NOT NULL
) ENGINE=MyISAM AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struttura della tabella `users`
--

CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `email` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(30) COLLATE utf8_bin NOT NULL,
  `firstname` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `lastname` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Struttura della tabella `variations`
--

CREATE TABLE IF NOT EXISTS `variations` (
`id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `variation` text CHARACTER SET utf8 NOT NULL,
  `lang` text CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1104 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cho`
--
ALTER TABLE `cho`
 ADD PRIMARY KEY (`cho_id`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
 ADD PRIMARY KEY (`coll_id`);

--
-- Indexes for table `coll_associations`
--
ALTER TABLE `coll_associations`
 ADD PRIMARY KEY (`coll_id`,`elem_id`);

--
-- Indexes for table `persons`
--
ALTER TABLE `persons`
 ADD PRIMARY KEY (`person_id`);

--
-- Indexes for table `places`
--
ALTER TABLE `places`
 ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `variations`
--
ALTER TABLE `variations`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `id` (`id`), ADD KEY `id_2` (`id`), ADD KEY `id_3` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cho`
--
ALTER TABLE `cho`
MODIFY `cho_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
MODIFY `coll_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=40;
--
-- AUTO_INCREMENT for table `persons`
--
ALTER TABLE `persons`
MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=73;
--
-- AUTO_INCREMENT for table `places`
--
ALTER TABLE `places`
MODIFY `location_id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=46;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `variations`
--
ALTER TABLE `variations`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1104;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
