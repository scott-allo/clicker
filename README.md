# Jeu de Clic Incrémental (Idle Game)

Bienvenue sur le repository de mon jeu de clic incrémental ! Ce projet vous permettra de créer votre propre jeu où les utilisateurs génèrent des points en cliquant et peuvent débloquer des éléments et des bonus pour améliorer leur progression.

## Description du Projet

Le but du jeu est simple : l'utilisateur gagne des points en cliquant et utilise ces points pour débloquer des éléments dans le jeu. Ces éléments peuvent être des objets qui génèrent des points automatiquement ou manuellement, avec la possibilité d'améliorer ces éléments via des bonus. Au fur et à mesure que le jeu progresse, les éléments et les bonus deviennent de plus en plus chers et permettent de générer des points de manière exponentielle.

### Fonctionnalités principales :

1. **Clic et accumulation de points**  
   À chaque clic, l'utilisateur gagne des points. Le nombre de points par clic augmente au fur et à mesure que le joueur débloque des éléments et des bonus.

2. **Progression avec des éléments**  
   Le joueur peut acheter des éléments qui produisent des points de manière automatique (idle) ou manuelle (clic). Ces éléments deviennent plus efficaces à mesure que le joueur les améliore.

3. **Boutique d'objets et de bonus**  
   La boutique permet d'acheter des éléments et des bonus en échange de points. Les prix des éléments et des bonus augmentent de façon exponentielle.

4. **Génération de ressources au clic sur le décor**  
   Le joueur peut cliquer sur des objets ou des éléments du décor pour générer des ressources supplémentaires.

5. **Sauvegarde locale**  
   Pour éviter de perdre sa progression en cas de coupure ou de fermeture du jeu, l'état du jeu est régulièrement sauvegardé dans le `localStorage` du navigateur.

## Instructions d'Installation

### Prérequis

- Un navigateur web moderne
- Aucun serveur ou logiciel supplémentaire nécessaire (le jeu est jouable directement dans le navigateur)

### Cloner le projet

Pour cloner ce projet sur votre machine locale, utilisez la commande suivante :

```bash
git clone https://github.com/scott-allo/clicker.git
