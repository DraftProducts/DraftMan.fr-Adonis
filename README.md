<div align="center">
  <br />
  <p>
    <a href="https://www.draftman.fr/discord"><img src="https://www.draftman.fr/images/headerlogo.png" width="546" alt="DraftMan Logo" /></a>
  </p>
  <br />
  <p>
    <a href="https://www.draftman.fr/discord"><img src="https://discordapp.com/api/guilds/422112414964908042/embed.png" alt="Discord server" /></a>
    <a href="https://www.draftman.fr"><img src="https://www.draftman.fr/images/badge.svg" alt="DraftMan"/></a>
    <a href="https://www.patreon.com/draftman_dev"><img src="https://img.shields.io/badge/donate-patreon-F96854.svg" alt="Patreon"/></a>
  </p>
</div>

## A Propos
DraftMan.fr est un site deja en ligne [draftman.fr](https://www.draftman.fr) qui a été réalisé il y a fort longtemps et basé sur une structure backend php procédural ayant de nombreux bugs. Le but est alors de refaire le site avec ma techno préféré le Js. Pour expérimenter j'ai choisi de partir sur le Framework [AdonisJs](https://adonisjs.com) qui est un framework web basé sur du nodejs fonctionnant avec la structure [MVC](https://fr.wikipedia.org/wiki/Mod%C3%A8le-vue-contr%C3%B4leur).

## Remerciements
Merci à [ESCommunity](https://discord.gg/dvym9EN) et plus particulièrement à [Romain Lanz](https://github.com/RomainLanz) qui m'a suivis durant la réalisation de ce site et m'a été d'une grande aide !

## Installation
- Executer `git clone https://github.com/DraftProducts/DraftMan.fr.git` pour télécharger le projet
- Executez `cd DraftMan.fr/` pour vous rendre dans le dossier du projet
- Executer `npm install` pour installer toutes les dependances
- Dupliquer le fichier `.env.exemple` en `.env`
- Executer `adonis key:generate` pour ajouter la clé dans le fichier `.env`
- Executer `adonis migration:run` pour mettre en place la base de donnée
- Executer `adonis serve --dev` ou `node server.js` pour lancer l'application

## Features
Le but a thèrme serait d'obtenir un site similaire a celui que j'ai aujourd'hui avec les features suivantes:
- Page Accueil
- Page A Propos
- Page Portfolio dynamique
- Page Projet
- Page Contact
- Page Discord
- Infrastructure Blog
- Page Article
- Page recherche
- Système de newsletter
- Admin: système de gestions de fichiers
- Admin: création de newsletter
- Admin: gestion de la boite mail 
- Admin: gestion des utilisateurs
- Admin: liste des articles (postés & non postés)
- Admin: rédaction des articles
- Admin: édition des articles