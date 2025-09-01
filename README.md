# 🌟 DSA Visualizer - Interactive Data Structures & Algorithms Learning Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.9.2-purple?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-teal?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

> **🎯 Mission:** Help students understand each step of the coding process through visual demonstrations and real-time algorithm execution

---

## 📖 **About The Project**

DSA Visualizer is an **interactive educational platform** that transforms complex data structures and algorithms into engaging visual experiences. Students can watch code execute step-by-step, track variables in real-time, and understand how algorithms work through dynamic animations.

### ✨ **What Makes It Special**

- **🔄 Real-Time Code Execution** - Watch algorithms run line by line
- **🎯 Step-by-Step Learning** - Manual progression through algorithm steps
- **📊 Variable Tracking** - Live monitoring of algorithm variables
- **🎮 Interactive Controls** - Adjustable speed, pause/play functionality
- **🎨 Beautiful Animations** - Smooth, educational visualizations
- **📱 Responsive Design** - Works seamlessly on all devices

---

## 🚀 **Live Demo**

🌐 **[Visit DSA Visualizer](https://your-deployed-url.vercel.app)** *(Replace with your actual URL)*

---

## 🛠️ **Tech Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.1 | React framework with App Router |
| **React** | 19.0.0 | UI library with latest features |
| **TypeScript** | 5.0 | Type safety and better DX |
| **Framer Motion** | 12.9.2 | Smooth animations and transitions |
| **Tailwind CSS** | 4.0 | Modern utility-first styling |
| **Lucide React** | Latest | Beautiful, consistent icons |

---

## 🎯 **Features Overview**

### 🧠 **Interactive Data Structures**

| Data Structure | Operations | Special Features |
|----------------|------------|------------------|
| **Arrays** | Linear/Binary Search, Sorting | Element highlighting, comparison counting |
| **Linked Lists** | Insert, Delete, Search | Pointer visualization, memory management |
| **Stacks** | Push, Pop, Peek | LIFO demonstration, balanced parentheses |
| **Queues** | Enqueue, Dequeue | FIFO visualization, BFS simulation |
| **Hash Tables** | Insert, Search, Delete | Hash function visualization, collision handling |
| **Binary Trees** | Traversals, Search | Tree construction, recursive visualization |
| **Heaps** | Insert, Extract, Heapify | Min/Max heap operations, heap sort |
| **Graphs** | BFS, DFS, Dijkstra | Interactive graph building, pathfinding |
| **AVL Trees** | Insert, Delete, Rotate | Self-balancing visualization, rotation types |
| **Circular Lists** | All operations | Circular pointer visualization |
| **General Trees** | DFS, BFS, Height | Multi-child nodes, tree traversals |

### 🎮 **Educational Features**

- **📝 Code Execution Flow** - See exactly how algorithms execute
- **🔍 Variable Tracking** - Monitor all variables in real-time
- **⏱️ Speed Control** - Adjust animation speed (0.5s to 2s)
- **👆 Manual Stepping** - Step through algorithms at your own pace
- **📊 Complexity Analysis** - Time and space complexity information
- **🎯 Use Cases** - Real-world applications for each data structure
- **🎨 Color-Coded States** - Visual feedback for different node states

### 🌟 **Additional Sections**

- **📚 Topic Library** - Comprehensive explanations and examples
- **🔧 Git Cheat Sheet** - Essential Git commands and workflows
- **📁 Folder Structure** - Project organization best practices
- **🔍 Smart Search** - Find any topic or algorithm quickly

---

## 🚀 **Getting Started**

### **Prerequisites**

Make sure you have the following installed:
- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun**

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/robinnayak/DSAVisual.git
   cd DSAVisual
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Build for Production**

```bash
npm run build
npm start
```

---

## 📂 **Project Structure**

```
DSAVisual/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── topic/                    # Topic pages
│   ├── git/                      # Git cheat sheet
│   └── folderstructure/          # Project structure guide
├── component/                    # React components
│   ├── animations/               # Data structure animations
│   │   ├── ArrayAnimation.tsx    # Array visualizations
│   │   ├── LinkedListAnimation.tsx
│   │   ├── StackAnimation.tsx
│   │   ├── QueueAnimation.tsx
│   │   ├── HashTableAnimation.tsx
│   │   ├── HeapsAnimation.tsx
│   │   ├── BinaryTreeAnimation.tsx
│   │   ├── GraphAnimation.tsx
│   │   ├── AVLTree.tsx
│   │   ├── CircularLinkedListAnimation.tsx
│   │   ├── CircularQueueAnimation.tsx
│   │   ├── DoublyLinkedListAnimation.tsx
│   │   └── TreesAnimation.tsx
│   ├── nav/                      # Navigation components
│   ├── DsaTopicsGrid/           # Topic grid layout
│   └── codeflow/                # Code flow demonstrations
├── public/                       # Static assets
│   ├── images/                   # Data structure images
│   └── topics/                   # Markdown content
└── utils/                        # Utility functions
```

---

## 🎨 **Screenshots**

### **Homepage**
![Homepage Screenshot](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=DSA+Visualizer+Homepage)

### **Array Animation**
![Array Animation](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Interactive+Array+Visualization)

### **Binary Tree Traversal**
![Binary Tree](https://via.placeholder.com/800x400/7C3AED/FFFFFF?text=Binary+Tree+Traversal+Animation)

### **Graph Algorithms**
![Graph Algorithms](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Graph+Algorithm+Visualization)

---

## 🎯 **How It Works**

### **Step-by-Step Learning Process**

1. **📚 Choose a Topic** - Select any data structure or algorithm
2. **🎮 Interactive Controls** - Use the control panel to customize your experience
3. **👀 Watch Code Execute** - See real-time code execution with explanations
4. **📊 Track Variables** - Monitor how variables change during execution
5. **🎯 Understand Visually** - Watch data structures transform through operations
6. **⏱️ Control the Pace** - Adjust speed or step through manually

### **Educational Benefits**

- **🧠 Visual Learning** - See abstract concepts come to life
- **🔍 Deep Understanding** - Understand not just what, but how and why
- **🎯 Practical Application** - Real-world use cases for each concept
- **📈 Progress Tracking** - Monitor your learning journey
- **🤝 Interactive Engagement** - Learn by doing, not just reading

---

## 🤝 **Contributing**

We welcome contributions! Here's how you can help:

### **Ways to Contribute**

- 🐛 **Bug Reports** - Found a bug? Let us know!
- ✨ **Feature Requests** - Have an idea? We'd love to hear it!
- 📝 **Documentation** - Help improve our docs
- 🎨 **Design Improvements** - Make it even more beautiful
- 🧪 **Add Algorithms** - Contribute new visualizations

### **Development Setup**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author**

**Robin Nayak**
- GitHub: [@robinnayak](https://github.com/robinnayak)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 **Acknowledgments**

- **Next.js Team** - For the amazing React framework
- **Framer Motion** - For smooth, beautiful animations
- **Tailwind CSS** - For utility-first styling
- **Lucide React** - For beautiful, consistent icons
- **The Open Source Community** - For inspiration and learning resources

---

## 🌟 **Show Your Support**

If this project helped you learn DSA concepts, please consider:

- ⭐ **Star this repository**
- 🍴 **Fork and contribute**
- 📢 **Share with fellow learners**
- 💬 **Leave feedback and suggestions**

---

## 📊 **Project Statistics**

- **13 Interactive Animations** - Complete data structure coverage
- **50+ Algorithm Implementations** - Comprehensive learning experience
- **Real-time Code Execution** - Step-by-step understanding
- **Responsive Design** - Works on all devices
- **Educational Focus** - Built specifically for learning

---

<div align="center">

**Made with ❤️ for students learning Data Structures & Algorithms**

[🌟 Star this repo](https://github.com/robinnayak/DSAVisual) • [🐛 Report Bug](https://github.com/robinnayak/DSAVisual/issues) • [✨ Request Feature](https://github.com/robinnayak/DSAVisual/issues)

</div>
