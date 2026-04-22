# Dossier de Certification - Bloc 1 RNCP

Ce document a été spécifiquement rédigé pour répondre aux critères de validation du Bloc 1 (Analyse du besoin et conception de la solution technique) de la certification EIP / RNCP, tels que définis dans la grille d'évaluation.

---

## A1. Identification du besoin client

### C1 - Recenser les besoins du client et des utilisateurs
**Analyse des besoins clients :**
L'objectif du projet Sanalink est de fournir une plateforme centralisée et accessible pour le bien-être mental. L'analyse des besoins a fait ressortir la nécessité d'interagir avec trois types d'utilisateurs distincts :
1. **Les Patients (`user`)** : Besoin d'outils d'auto-évaluation (journal, relaxation) et d'une mise en relation facile avec des professionnels.
2. **Les Psychologues (`psychologist`)** : Besoin d'un outil de gestion de consultations, de prise de notes sécurisées et de téléconsultation intégrée.
3. **L'Administrateur (`admin`)** : Besoin d'une vue macro (PMF, gestion des utilisateurs) pour piloter l'application.

**Accessibilité (Handicap) :**
Les normes d'accessibilité ont été au cœur de la conception, car le public visé peut souffrir de troubles cognitifs ou d'anxiété.
*   **Cognitif :** Interface épurée, PWA permettant un chargement instantané (réduisant l'anxiété liée à l'attente) grâce au mode hors ligne partiel.
*   **Visuel :** Utilisation de contrastes élevés (Thème Sanalink avec `#6C63FF`), balisage sémantique et attributs `alt` sur les images (ex: annuaire des psychologues).

### C2 - Réaliser un audit technique, fonctionnel et de sécurité
**Compte-rendu d'audit & Approche méthodologique :**
L'environnement d'exécution du projet a nécessité un audit pour choisir les meilleures technologies au regard des ressources disponibles :
*   **Frontend :** Le besoin d'une application installable sur mobile sans passer par les stores classiques a orienté le choix vers une **Progressive Web App (PWA)** avec React/Vite.
*   **Backend & Sécurité :** Pour sécuriser les données médicales sensibles (notes des psychologues), une architecture **Node.js/Express** avec l'ORM **Prisma** a été choisie, évitant ainsi les failles classiques d'injection SQL. Les mots de passe sont hachés via `bcryptjs`.
*   **Déploiement :** Une séparation stricte entre le Frontend (Vercel) et le Backend (Render) permet de mitiger les risques d'attaques directes sur le serveur d'application.

---

## A2. Traduction technique du besoin fonctionnel

### C3 - Rédiger les spécifications techniques et fonctionnelles
**Documentation des spécifications :**
L'architecture a été conçue pour couvrir l'intégralité du scope fonctionnel audité. 
*   Consulter le fichier `FRONTEND.md` pour les spécifications techniques de l'interface utilisateur.
*   Consulter le fichier `BACKEND.md` pour les spécifications de la base de données et des routes API.

**Accessibilité dans les spécifications :**
Les recommandations techniques d'accessibilité ont été intégrées directement dans les composants React, assurant une compatibilité avec les lecteurs d'écran et une navigation fluide sur mobile comme sur bureau.

### C4 - Chiffrer le projet et réaliser un benchmark
**Analyse financière et Benchmarks :**
Différents scénarios ont été étudiés pour l'hébergement et l'exploitation de la solution technique :
*   **Scénario 1 (IaaS pur - AWS/GCP)** : Configuration d'instances EC2/Compute Engine. Coût élevé de maintenance DevOps et de configuration des load balancers. Trop onéreux pour le lancement.
*   **Scénario 2 (PaaS Cloud - Retenu)** : 
    *   *Frontend* : Hébergé sur **Vercel** (Coût : 0€/mois pour le palier initial, CDN mondial inclus).
    *   *Backend* : Hébergé sur **Render** (Coût : 0€/mois via le plan gratuit).
    *   *Base de données* : **PostgreSQL sur Render** (Coût optimisé).
*   **Conclusion** : Le benchmark a validé le Scénario 2, permettant de réduire les coûts d'infrastructure à près de zéro lors de la phase de lancement (Proof of Concept / Go-to-Market), optimisant ainsi le budget global.

### C5 - Prévoir les impacts techniques et fonctionnels
**Étude prospective et voies d'évolution :**
L'audit technique a permis de concevoir une architecture prête pour l'évolution (scalabilité) :
*   **Migration et Scalabilité :** L'utilisation de **Docker** (présence d'un `Dockerfile` et `.dockerignore` dans le backend) assure que l'application peut être facilement migrée d'une offre PaaS (Render) vers une infrastructure conteneurisée plus robuste (AWS ECS, Kubernetes) si la charge utilisateur augmente drastiquement.
*   **Évolution de la base de données :** Le choix de l'ORM **Prisma** permet de gérer les futures migrations de schémas de données de manière asynchrone et sécurisée (`prisma migrate`), sans impact majeur sur l'environnement d'exploitation du client.
