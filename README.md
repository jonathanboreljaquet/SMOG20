# Projet SMOG20

## Équipe 
#### Bauduccio Lorenzo, <lorenzo.bdcc@eduge.ch>
#### Stahli Jules, <jules.sthl@eduge.ch>
#### Borel-Jaquet Jonathan, <jonathan.brljq@eduge.ch>
## Date du projet
* Date de début : 27.08.2020
* Date de fin   : 26.11.2020
## Description
Projet permettant aux 
* élèves du CFPT-I de :
	* Visualiser le bâtiment d'informatique de Rhône en 3D
	* Visualiser le étages du bâtiment en 3D
	* Visualiser les salles de classe en 360°
	* Accéder a leur horaire via leur nom de classe
* professeurs du CFPT-I de :
	* Consulter son horaire
	* Réserver une salle
	* Visualiser l'occupation des salles
	* Signaler un problème technique dans une salle

## Inventaire du matériel
* INSTA360 One X, [https://www.digitec.ch/fr/s1/product/insta360-un-x-30p-4k-cameras-daction-9887004](https://www.digitec.ch/fr/s1/product/insta360-un-x-30p-4k-cameras-daction-9887004)

* Plan de l'école de Rhône, Chemin Gérard-De-Ternier 10, 1213 Lancy
## Technologie
* Babylon.js
* Webpack
* Lumen
## Pré-requis
* PHP 7.2
* Composer
* NodeJS 14.2
## Installation

1. Copiez le contenu du fichier **.env.example** dans un nouveau fichier nommé **.env**

2. Exécutez les commandes :
    1. `composer install`

    2. `npm install`

    3. `npm run prod`

    4. `npm run serve` _(Si vous ne disposez pas d'un serveur local)_

3. Rendez vous à l'adresse http://localhost:80/key pour récupérer une clé aléatoire

4. Utilisez la clé que vous venez de récupérer comme nouvelle valeur pour la variable **APP_KEY** du fichier **.env**
5. Renseignez les informations de connexion à la base de données dans les variables correspondantes _(DB\_...)_ du fichier **.env**

## Commandes

`npm install`: Install les dépendances javascript/typescript

`composer install`: Install les dépendances PHP

`npm run prod`: Compile le code source (typescript + scss) de l 'application avec minification et norme ES5

`npm run dev`: Compile le code source (typescript + scss) de l'application avec sourcemaps et watcher

_`npm run serve`: Lance un mini serveur PHP local pour le projet_
