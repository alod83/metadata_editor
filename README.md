# Welcome to WeME!
![WeME Logo](https://image.ibb.co/nHWRrQ/Logo.png)
## Introduction
Within the field of Digital Humanities, a great effort has been made to digitise documents and collections in order to build catalogues and exhibitions on the Web. We present **WeME - The Web Metadata Editor**, a Web application for building a knowledge base, which can be used to describe digital documents. WeME can be used by different categories of users: archivists/librarians and scholars. WeME extracts information from some well-known Linked Data nodes, i.e. DBpedia and GeoNames, as well as traditional Web sources, i.e. VIAF.


## Online Version
You can check out the online version of the Application [here](#..).

## Installation
To run WeME on your PC, you need to install a Web Server, i.e. [XAMPP](https://www.apachefriends.org/index.html), and create a database to manage the data. Then, you can download our Dump file, containing the database structure with all the tables.

## Data Types
Allowed resources are a subset of the [Europeana Data Model (EDM)](http://pro.europeana.eu/files/Europeana_Professional/Share_your_data/Technical_requirements/EDM_Documentation/EDM_Mapping_Guidelines_v2.3_112016.pdf) ontology: _person_, _place_ and _cultural heritage object_ (CHO). We choose EDM to represent our data because it defines relations among resources in a very efficient way: a CHO is related to a person, if the person is its author, as well as a place is related to a CHO, if the CHO was created in that place.

## Layout
### Homepage
![WeME Homepage Layout](https://image.ibb.co/hsipBQ/weme_home3.gif)
The homepage consists of two sections:
* **Header**: in this section, you can log in to your personal account, both manually or using your social media accounts (Google or Facebook). You can also create your own profile if you're new. Once you're logged in, you'll see new buttons appear. The _Add Record_ button allows you to open the menu to add some new records; this process will be described later. The _Collections_ button links to your collections page, where you can manage, edit, add or delete personal collections of data. The _Logout_ button is pretty self-explanatory.
* **Search console**: with this console you can _search for data into the database_, specifying the type of data you're looking for and the string you want to search. While your writing after selecting the type, the input will automatically suggest results present in the database (or you can simply view the entire list double clicking on the input bar). The small buttons below links to the _Database View_ page, the _Credits Page_ and the _Tutorial Page_.

### Resource View Page
![WeME Resource Page](https://image.ibb.co/hC9nWQ/We_ME_resource1.png)

Here you can view the data you searched for. In the _left column_, you can find a picture and all the resources associated with the one you're visualising. In the right column, you can find all the data about the resource you're visualising, such as the name, birth date, birth place, biography, etc. You can also find a button to edit that resource and a button to delete it. In the _Collections_ subsection, you can see in which of your collection the resource is inserted, and you can also add it to a new collection.
