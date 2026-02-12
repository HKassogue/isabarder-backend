# Backend Salon RDV (Express + Prisma + MySQL)

Backend pédagogique pour une appli de prise de RDV pour salon de coiffure — conçu pour que **3 groupes** (Client / Coiffeur / Gérant) travaillent sur **la même base de code** dans le cadre du cours **Application mobile avancée** avec la L3 GEII / ISA.

## 1) Prérequis
- Node.js 18+
- Docker (recommandé)
- VS Code

## 2) Démarrage MySQL 
Lancer votre serveur MySQL via XAMPP, MAMP, ou WAMPSERVER, ou encore à travers un conteneur Docker (configuration déjà faite)
```bash
docker compose up -d
```

## 3) Installation des dépendances
```bash
npm install
```

## 4) Configuration du fichier .env
- Renommez le fichier .env.example en .env
    ```bash
    cp .env.example .env
    ```
- Changez les informations d'accès à la base de données (db, user, password, host, port) dans .env.

## 5) Migrations Prisma
```bash
npx prisma migrate dev --name init
```

## 6) Données de test (seed)
```bash
npm run seed
```

Comptes:
- GERANT   gerant@salon.test / password123
- COIFFEUR coiffeur1@salon.test / password123
- CLIENT   client1@salon.test / password123

## 7) Lancement de l'API
```bash
npm run dev
# ou
npm start
```

URL:
- `GET http://localhost:4000/` (health)
- `GET http://localhost:4000/api/public/services`

## 8) Endpoints (résumé)

### Auth
- `POST /api/auth/register` (public, crée CLIENT)
- `POST /api/auth/login`
- `GET /api/auth/me` (token)

### Public
- `GET /api/public/services`
- `GET /api/public/services/:serviceId/modeles`
- `GET /api/public/coiffeurs`
- `GET /api/public/coiffeurs/:coiffeurId/creneaux?from=...&to=...`

### Client (Bearer + role CLIENT)
- `POST /api/client/rdvs`  body: `{ modeleId, creneauId }`
- `GET  /api/client/rdvs`
- `PATCH /api/client/rdvs/:id/cancel`
- `POST /api/client/rdvs/:id/avis` body: `{ note, commentaire? }`

### Coiffeur (Bearer + role COIFFEUR)
- `POST /api/coiffeur/creneaux` body: `{ startAt, endAt }` (ISO)
- `GET  /api/coiffeur/rdvs`
- `PATCH /api/coiffeur/rdvs/:id/status` body: `{ statut: "CONFIRME"|"ANNULE"|"TERMINE" }`

### Gérant (Bearer + role GERANT)
- `POST /api/gerant/services`
- `PATCH /api/gerant/services/:id`
- `DELETE /api/gerant/services/:id`
- `POST /api/gerant/services/:serviceId/modeles`
- `POST /api/gerant/coiffeurs` (création d'un coiffeur)

---

## 9) Postman/Insomnia de tests API + exemples de requêtes
### Import & utilisation (rapide)

- Postman → Import → glissez les deux JSON [isabarber_backend.postman_environment.json](isabarber_backend.postman_environment) et [isabarber_backend.postman_collection.json](isabarber_backend.postman_collection.json) (ou importez-les).

- Sélectionnez l’environnement “Salon RDV (local)” en haut à droite.

- Modifiez baseUrl selon votre cas :

    - PC local : http://localhost:4000/api

    - Android Emulator : http://10.0.2.2:4000/api

    - Téléphone : http://IP_DE_VOTRE_PC:4000/api

### Tester par profil (sans retaper les requêtes)

Dans l’environnement, changez :

- loginEmail = client1@salon.test (ou coiffeur1/gerant)

- loginPassword = password123 <br>

Puis lancez Auth → Login : le token est auto-enregistré dans token.

