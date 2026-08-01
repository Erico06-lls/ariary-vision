# 💵 Ariary Vision

**Ariary Vision** est une petite application web développée pour illustrer l'utilisation d'un modèle de Deep Learning capable de reconnaître automatiquement les différentes coupures de billets d'Ariary.

> 🎯 L'objectif principal de ce projet est de proposer une interface simple permettant de tester le modèle via une image, et non de constituer une application bancaire ou un système de vérification de billets.

## 🧠 Modèle

Le modèle de reconnaissance a été développé séparément et entraîné pour classifier **8 coupures de billets d'Ariary**.

Les classes reconnues sont :

* 100 Ar
* 200 Ar
* 500 Ar
* 1 000 Ar
* 2 000 Ar
* 5 000 Ar
* 10 000 Ar
* 20 000 Ar

Le modèle entraîné est sauvegardé au format **`.keras`** et est chargé par le backend lors du démarrage de l'API.

🔗 **Modèle de reconnaissance :** `https://github.com/Erico06-lls/Classification-Multiclasse-CNN`

## 🏗️ Architecture

```text
                    📷 Image
                       │
                       ▼
              ┌─────────────────┐
              │     Next.js     │
              │    Frontend     │
              └────────┬────────┘
                       │
                    HTTP POST
                       │
                       ▼
              ┌─────────────────┐
              │     FastAPI     │
              │     Backend     │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Modèle Keras   │
              │   MobileNetV2   │
              └────────┬────────┘
                       │
                       ▼
              💵 Coupure prédite
              🎯 Confiance
```

## 🛠️ Technologies

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**

### Backend

* **Python**
* **FastAPI**
* **Uvicorn**
* **TensorFlow / Keras**
* **MobileNetV2**

## ✨ Fonctionnalités

* 📷 Sélection d'une image
* 🖱️ Glisser-déposer
* 🖼️ Aperçu de l'image
* 🗑️ Suppression de l'image
* 🧠 Prédiction avec le modèle de Deep Learning
* 💵 Affichage de la coupure détectée
* 📊 Affichage du niveau de confiance

> ⚠️ Pour obtenir un résultat fiable, il est recommandé d'envoyer une photo contenant **un seul billet d'Ariary**.

## 📸 Aperçu

### Interface

![alt text](<Screenshot From 2026-08-01 17-56-58.png>)

### Résultat

![alt text](<Screenshot From 2026-08-01 17-57-44.png>)

## 🚀 Lancer le projet

### Backend

```bash
cd backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

L'API sera disponible sur :

```text
http://127.0.0.1:8000
```

Documentation Swagger :

```text
http://127.0.0.1:8000/docs
```

### Frontend

Dans un autre terminal :

```bash
cd frontend

npm install
npm run dev
```

L'interface sera disponible sur :

```text
http://localhost:3000
```

## 📁 Structure du projet

```text
ariary-recognition/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── predictor.py
│   │
│   ├── models/
│   │   └── mobilenetv2_ariary.keras
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       └── page.tsx
│   │
│   └── package.json
│
└── README.md
```

## 🎯 Objectif du projet

Ce projet a été réalisé comme une **interface d'illustration et de démonstration** autour d'un modèle de reconnaissance automatique de billets d'Ariary.

Il permet notamment de mettre en pratique l'intégration d'un modèle de Deep Learning dans une application web complète :

```text
Deep Learning
      +
FastAPI
      +
Next.js
      =
Application IA Full-Stack
```

---

💵 **Ariary Vision** — Une petite démonstration de Computer Vision appliquée aux billets malgaches 🇲🇬