![WeME Logo](https://image.ibb.co/mYQHFk/Logo2.png)

## Introduction
Within the field of Digital Humanities, a great effort has been made to digitise documents and collections in order to build catalogues and exhibitions on the Web. We present **WeME - The Web Metadata Editor**, a Web application for building a knowledge base, which can be used to describe digital documents. WeME can be used by different categories of users: archivists/librarians and scholars. WeME extracts information from some well-known Linked Data nodes, i.e. DBpedia and GeoNames, as well as traditional Web sources, i.e. VIAF.

## Online Version
You can check out the online version of the Application [here](#..).

## Installation
To run WeME on your PC, you need to follow these simple steps:
* download and install a Web Server, i.e. [XAMPP](https://www.apachefriends.org/index.html)
* [download the WeME folder](https://github.com/alod83/metadata_editor.git) from GitHub
* use your database manager, i.e. [phpMyAdmin](https://www.phpmyadmin.net/), to create a new database named _metadata_editor_
* in our `metadata_editor/api` folder, check out the [config.php](https://github.com/alod83/metadata_editor/blob/master/api/config.php) file to make sure all the data are correct on line 7: `function openDB($database="metadata_editor", $password=NULL, $username="root", $servername="localhost")`; change the fields you need to correctly connect to your database
* in our `metadata_editor/dump` folder, find the [metadata_editor.sql](https://github.com/alod83/metadata_editor/blob/master/dump/metadata_editor.sql) file, which contains the whole database structure, and import it in the _metadata_editor_ database, using your database manager

### Database Structure
![WeME Database Structure](https://image.ibb.co/nDZ4BQ/We_ME_db_structure.png)

The database structure consists of five tables:
* **Persons**, **Places** and **CHO** tables: these tables contains all the data relative to the resources. Each table has some required fields (key_id, name, surname, birthdate, birthplace for Persons; key_id, original_name for Places; key_id, original_title, author, creation_date, type for CHO), which are required on client-side, during the insertion with the [Resource Editor](#resource-editor-page).
* **Users**: this table contains all the data about registered users, such as email, password, first name and last name. These data are used during the login process and to associate a user to a collection.
* **Collections**: this table contains the data to associate a user to his own collections.
* **Coll_associations**: this table contains the data to associate one or more resources to one or more collections.
## Data Types
Allowed resources are a subset of the [Europeana Data Model (EDM)](http://pro.europeana.eu/files/Europeana_Professional/Share_your_data/Technical_requirements/EDM_Documentation/EDM_Mapping_Guidelines_v2.3_112016.pdf) ontology: _person_, _place_ and _cultural heritage object_ (CHO). We choose EDM to represent our data because it defines relations among resources in a very efficient way: a CHO is related to a person, if the person is its author, as well as a place is related to a CHO, if the CHO was created in that place.

## Layout
### Homepage
![WeME Homepage Layout](https://image.ibb.co/hsipBQ/weme_home3.gif)
The homepage consists of two sections:
* **Header**: in this section, you can log in to your personal account, both manually or using your social media accounts (Google or Facebook). You can also create your own profile if you're new. Once you're logged in, you'll see new buttons appear. The _Add Record_ button allows you to open the menu to [add some new records](#resource-editor-page). The _Collections_ button links to your [Collections Page](#collections-page), where you can manage, edit, add or delete personal collections of data. The _Logout_ button is pretty self-explanatory.
* **Search console**: with this console you can _search for data into the database_, specifying the type of data you're looking for and the string you want to search. While your writing after selecting the type, the input will automatically suggest results present in the database (or you can simply view the entire list double clicking on the input bar). The small buttons below links to the [Database Page](#database-page), the _Credits Page_ and the _Tutorial Page_.

***

### Resource View Page
![WeME Resource Page](https://image.ibb.co/hC9nWQ/We_ME_resource1.png)
Here you can view the data you searched for. In the _left column_, you can find a picture and all the resources associated with the one you're visualising. In the right column, you can find all the data about the resource you're visualising, such as the name, birth date, birth place, biography, etc. You can also find a button to edit that resource and a button to delete it. In the _Collections_ subsection, you can see in which of your collection the resource is inserted, and you can also add it to a new collection.

***

### Resource Editor Page
![WeME Resource Editor Page](https://image.ibb.co/iKkcWQ/We_ME_editor.gif)
The resource record consists of three sections:
* **Person Box**: the editor gives the possibility to add/edit a new person, by specifying the following fields: _name, surname, birth date, birth place, death date, death place, image link, Wikipedia link, VIAF link_. There is also the _checkbox still alive_, which allows specifying whether the person is or not still alive. The user can edit all the fields, manually, or she can select the _check with DBpedia/check with VIAF_ buttons, to populate, if available, the fields from DBpedia/VIAF. When the information is ready, the user can click the send button, to store the person in the knowledge base. If the person is already present in the knowledge base, the editor gives an alert.
* **Place Box**: the editor provides a form to add/edit a new place, by specifying the following fields: _original name, English name, country, region, population, latitude, longitude, description, image link, Wikipedia link and GeoNames link_. The user can edit all fields manually or she/he can use the button _check with DBpedia/check with GeoNames_, as specified in the case of the add person box.
* **CHO box**: the editor allows the user to add a new cultural heritage object, such as a letter, a painting and so on, by specifying the following fields: _original title, English title, author, creation date, issue date, type (text, video, sound, image, 3D), language, description, image link and Wikipedia link_. All these fields, which follow the ontology defined by the Europeana Data Model, should be added by the user manually.

***

### Collections Page
![WeME Collections Page](https://image.ibb.co/kc7Sy5/We_ME_collections.png)
In this page, you can view, edit, export, add and delete your collections. The View button allows you to visualise your collection, dividing the resources by type. The Edit button allows you to edit your collection, adding or removing resources to/from it. The Export button allows you to export the collection in two different formats: [CSV (Comma-Separated Values)](https://en.wikipedia.org/wiki/Comma-separated_values), the most common format used to import data into the database, or [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD), a method of encoding Linked Data using JSON.

***

### Database Page
![WeME Database Page](https://image.ibb.co/juwHWQ/We_ME_database.png)
In this page, you can visualise the entire database, view the total number of records and the number of resources by type. You can click on the yellow bars to expand each type and visualise the resources in details, with the possibility to click the View button to see a certain resource in the [Resource View Page](#resource-view-page). In addition, you can export the entire database in two formats: [CSV (Comma-Separated Values)](https://en.wikipedia.org/wiki/Comma-separated_values), the most common format used to import data into the database, or [JSON-LD](https://en.wikipedia.org/wiki/JSON-LD), a method of encoding Linked Data using JSON.

***

### Import Page
![WeME Import Page](https://image.ibb.co/g4V1ak/WeME_csv.gif)
In this page, you can import a CSV file into the database. Since the import action may cause several errors, the procedure follows some **strict rules**:
* you have to choose the type of data you want to import (person, place or CHO);
* you have to be sure your file contains the correct number of fields;
* the field delimiter must be a comma (,); all the commas (,) within the fields must be escaped correctly;
* the row delimiter must be an end-of-line (\n); all the end-of-line (\n) within the fields must be escaped correctly;
* the field must be enclosed in double quotes ("); all the double quotes (") within the fields must be escaped correctly;
* the first line of your file must include the table fields, which you can copy from the input bar below the instructions;


## Libraries
WeME uses the following libraries:
* [jQuery](https://jquery.com/)
* [FullPage.js](http://alvarotrigo.com/fullPage/)
* [JSZip](https://stuk.github.io/jszip/)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js/)



