# Tic-Tac-Toe PWA

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-4A90E2?style=for-the-badge&logo=pwa&logoColor=white)

[🇺🇸 English](#english) | [🇧🇷 Português](#português)

---

<a name="english"></a>
## 🇺🇸 English

### 📖 About
A modern, premium Tic-Tac-Toe game built as a Progressive Web App (PWA). This project demonstrates the usage of **React** with **TypeScript**, styled with **Tailwind CSS**, and enhanced with smooth animations using **Framer Motion**. It is designed to be fully responsive and installable on both mobile and desktop devices.

Created by **Jonathas Kranmer Silva**, the motivation behind this project is professional growth and generating logical challenges.

### ✨ Features
- **Progressive Web App (PWA)**: Installable on your home screen with offline capabilities.
- **Modern UI/UX**: Clean, aesthetic design using Tailwind CSS.
- **Smooth Animations**: Engaging game interactions powered by Framer Motion.
- **Responsive Design**: Works seamlessly on all screen sizes, from mobile phones to desktops.
- **TypeScript**: built with type safety and best practices in mind.

### 🛠 Tech Stack
- **Core**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **PWA**: [Vite Plugin PWA](https://vite-pwa-org.netlify.app/)

### 🚀 Getting Started

#### Prerequisites
Make sure you have Node.js installed on your machine.

#### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/JKranmer/tic-tac-toe.git
   cd tic-tac-toe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

#### Build for Production
To build the application for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

### 📂 Project Structure
```bash
src/
├── components/   # Reusable UI components (Board, Square, etc.)
├── hooks/        # Custom React hooks (useGame, etc.)
├── utils/        # Helper functions (calculateWinner, etc.)
├── App.tsx       # Main application component
├── main.tsx      # Entry point
└── index.css     # Global styles and Tailwind directives
```

---

<a name="português"></a>
## 🇧🇷 Português

### 📖 Sobre
Um jogo da Velha moderno e premium construído como uma Progressive Web App (PWA). Este projeto demonstra o uso de **React** com **TypeScript**, estilizado com **Tailwind CSS** e aprimorado com animações suaves usando **Framer Motion**. Foi projetado para ser totalmente responsivo e instalável em dispositivos móveis e desktop.

Criado por **Jonathas Kranmer Silva**, o motivo da criação deste projeto é o crescimento profissional e gerar desafios lógicos.

### ✨ Funcionalidades
- **Progressive Web App (PWA)**: Instalável na tela inicial com capacidades offline.
- **UI/UX Moderna**: Design limpo e estético usando Tailwind CSS.
- **Animações Suaves**: Interações de jogo envolventes impulsionadas pelo Framer Motion.
- **Design Responsivo**: Funciona perfeitamente em todos os tamanhos de tela, de celulares a desktops.
- **TypeScript**: Construído com segurança de tipos e melhores práticas.

### 🛠 Tecnologias
- **Core**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Ferramenta de Build**: [Vite](https://vitejs.dev/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Animações**: [Framer Motion](https://www.framer.com/motion/)
- **PWA**: [Vite Plugin PWA](https://vite-pwa-org.netlify.app/)

### 🚀 Como Iniciar

#### Pré-requisitos
Certifique-se de ter o Node.js instalado em sua máquina.

#### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/JKranmer/tic-tac-toe.git
   cd tic-tac-toe
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Abra seu navegador e acesse `http://localhost:5173`.

#### Build para Produção
Para gerar a versão de produção da aplicação:
```bash
npm run build
```

Para visualizar a versão de produção:
```bash
npm run preview
```

### 📂 Estrutura do Projeto
```bash
src/
├── components/   # Componentes de UI reutilizáveis (Board, Square, etc.)
├── hooks/        # Hooks customizados do React (useGame, etc.)
├── utils/        # Funções auxiliares (calculateWinner, etc.)
├── App.tsx       # Componente principal da aplicação
├── main.tsx      # Ponto de entrada
└── index.css     # Estilos globais e diretivas do Tailwind
```

## 📄 License
This project is licensed under the MIT License.
