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

1. Copier le .env.example dans un fichier nommé .env

Exécutez les commandes :
2. composer install

3. npm install

4. npm run prod

5. npm run serve

6. Récupérer la clef sur la route /key

7. Rajouter la clef dans la variable APP_KEY dans le fichier .env