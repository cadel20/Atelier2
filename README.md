# Atelier2 - Pipeline CI/CD DevOps

## 📊 Badges de Statut

### 🔧 Intégration Continue (CI)
![CI Status](https://github.com/cadel20/Atelier2/actions/workflows/ci.yml/badge.svg)

### 🐳 Image Docker
![Docker Build](https://github.com/cadel20/Atelier2/actions/workflows/docker.yml/badge.svg)
![Docker Image Version](https://img.shields.io/docker/v/votre-docker-username/atelier-cicd?sort=semver)

### 🚀 Déploiement (CD)
![Deploy Status](https://github.com/cadel20/Atelier2/actions/workflows/deploy.yml/badge.svg)

### 📦 Version
![GitHub Release](https://img.shields.io/github/v/release/cadel20/Atelier2)
![GitHub Last Commit](https://img.shields.io/github/last-commit/votre-username/Atelier2)

### 📄 Licence
![License](https://img.shields.io/github/license/cadel20/Atelier2)

## 📋 Description

Ce projet démontre un pipeline CI/CD complet avec GitHub Actions.

## 🚀 Fonctionnalités

- ✅ Intégration Continue (tests automatisés)
- ✅ Construction d'images Docker
- ✅ Déploiement continu sur GitHub Pages
- ✅ Notifications Discord/Slack

## 🔧 Workflows

### 1. CI (`.github/workflows/ci.yml`)
- Tests sur chaque push
- Validation du code

### 2. Docker (`.github/workflows/docker.yml`)
- Build image sur chaque release
- Push vers Docker Hub

### 3. Deploy (`.github/workflows/deploy.yml`)
- Déploiement automatique sur GitHub Pages
- Notifications

