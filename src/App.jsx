import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  ChefHat,
  Clock,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Layers3,
  Cpu,
  ShoppingCart,
  CheckCircle2,
} from 'lucide-react';
import { menuItems } from './data/menu';
import { Queue } from './data/queue';
import * as THREE from 'three';

const seedOrders = [
  { id: 101, customer: 'Rahul', items: [{ name: 'Cheese Burger', quantity: 2 }, { name: 'Coke Float', quantity: 1 }], total: 446, status: 'waiting', createdAt: '5:32 PM' },
  { id: 102, customer: 'Aisha', items: [{ name: 'Pepperoni Pizza', quantity: 1 }, { name: 'Loaded Fries', quantity: 1 }], total: 358, status: 'waiting', createdAt: '5:38 PM' },
  { id: 103, customer: 'Karan', items: [{ name: 'Spicy Noodles', quantity: 1 }], total: 189, status: 'waiting', createdAt: '5:41 PM' },
  { id: 104, customer: 'Nia', items: [{ name: 'Chocolate Cake', quantity: 2 }], total: 258, status: 'waiting', createdAt: '5:46 PM' },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const getFoodById = (id) => menuItems.find((item) => item.id === id) || menuItems[0];

// 3D Scene Component
function ThreeDScene({ cameraView }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1727);
    scene.fog = new THREE.Fog(0x0a1727, 100, 1000);
    sceneRef.current = scene;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x59c3ff, 0.5);
    pointLight.position.set(-10, 10, 5);
    scene.add(pointLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.5);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create food models as geometric shapes with colors
    const createFoodModel = (type) => {
      const group = new THREE.Group();

      if (type === 'burger') {
        // Burger bottom bun
        const bottomBun = new THREE.SphereGeometry(0.6, 32, 32);
        const bunMaterial = new THREE.MeshStandardMaterial({ color: 0xd4a574 });
        const bottom = new THREE.Mesh(bottomBun, bunMaterial);
        bottom.position.y = -0.3;
        bottom.castShadow = true;
        group.add(bottom);

        // Patty
        const pattyGeometry = new THREE.CylinderGeometry(0.55, 0.55, 0.15, 32);
        const pattyMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
        const patty = new THREE.Mesh(pattyGeometry, pattyMaterial);
        patty.position.y = 0.2;
        patty.castShadow = true;
        group.add(patty);

        // Cheese
        const cheeseGeometry = new THREE.BoxGeometry(1, 0.1, 1);
        const cheeseMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
        const cheese = new THREE.Mesh(cheeseGeometry, cheeseMaterial);
        cheese.position.y = 0.35;
        cheese.castShadow = true;
        group.add(cheese);

        // Top bun
        const topBun = new THREE.SphereGeometry(0.6, 32, 32);
        const top = new THREE.Mesh(topBun, bunMaterial);
        top.position.y = 0.6;
        top.scale.y = 0.5;
        top.castShadow = true;
        group.add(top);
      } else if (type === 'pizza') {
        const pizzaGeometry = new THREE.ConeGeometry(1.2, 0.3, 8);
        const pizzaMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b35 });
        const pizza = new THREE.Mesh(pizzaGeometry, pizzaMaterial);
        pizza.castShadow = true;
        pizza.rotation.x = 0.3;
        group.add(pizza);

        // Pepperoni
        for (let i = 0; i < 6; i++) {
          const pepperoniGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.05, 32);
          const pepperoniMaterial = new THREE.MeshStandardMaterial({ color: 0xd32f2f });
          const pepperoni = new THREE.Mesh(pepperoniGeometry, pepperoniMaterial);
          const angle = (i / 6) * Math.PI * 2;
          pepperoni.position.x = Math.cos(angle) * 0.6;
          pepperoni.position.z = Math.sin(angle) * 0.6;
          pepperoni.position.y = 0.15;
          pepperoni.castShadow = true;
          group.add(pepperoni);
        }
      } else if (type === 'drink') {
        const glassGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 32);
        const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x87ceeb, metalness: 0.8, roughness: 0.2 });
        const glass = new THREE.Mesh(glassGeometry, glassMaterial);
        glass.castShadow = true;
        group.add(glass);

        // Liquid
        const liquidGeometry = new THREE.CylinderGeometry(0.35, 0.35, 1.2, 32);
        const liquidMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b35 });
        const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
        liquid.position.y = 0.1;
        liquid.castShadow = true;
        group.add(liquid);
      }

      return group;
    };

    // Create models
    const burger = createFoodModel('burger');
    burger.position.set(-4, 0, 0);
    scene.add(burger);

    const pizza = createFoodModel('pizza');
    pizza.position.set(0, 0, 0);
    scene.add(pizza);

    const drink = createFoodModel('drink');
    drink.position.set(4, 0, 0);
    scene.add(drink);

    // Counter
    const counterGeometry = new THREE.BoxGeometry(15, 0.5, 3);
    const counterMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.y = -1.5;
    counter.receiveShadow = true;
    scene.add(counter);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a2332 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      burger.rotation.y += 0.01;
      pizza.rotation.y += 0.01;
      drink.rotation.y += 0.01;

      burger.position.y = Math.sin(Date.now() * 0.001) * 0.3;
      pizza.position.y = Math.sin(Date.now() * 0.001 + Math.PI / 3) * 0.3;
      drink.position.y = Math.sin(Date.now() * 0.001 + Math.PI / 1.5) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight * 0.5);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [cameraView]);

  return <div ref={mountRef} style={{ width: '100%', height: '50vh', position: 'relative' }} />;
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [cameraView, setCameraView] = useState('queue');
  const [panelMessage, setPanelMessage] = useState('PEEK()\nFront Order:\n#102\nNo order was removed.');
  const [selectedFood, setSelectedFood] = useState(menuItems[0]);
  const [selectedOrderId, setSelectedOrderId] = useState(102);
  const [searchTerm, setSearchTerm] = useState('');
  const [presentationMode, setPresentationMode] = useState(false);
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([
    { id: 1, text: '🔔 Order #105 added to queue.' },
    { id: 2, text: '👨‍🍳 Order #101 is being prepared.' },
    { id: 3, text: '✅ Order #101 completed.' },
  ]);

  const [queueState] = useState(() => {
    const queue = new Queue();
    seedOrders.forEach((order) => queue.enqueue(order));
    return queue;
  });

  const [queueOrders, setQueueOrders] = useState(() => queueState.getAllOrders());
  const [completedOrders, setCompletedOrders] = useState([{ id: 101, customer: 'Rahul', completedAt: '5:55 PM' }]);
  const [stats, setStats] = useState({ total: 124, waiting: 8, preparing: 2, ready: 3, completed: 111 });
  const [orderCounter, setOrderCounter] = useState(105);

  const frontOrder = queueState.peek();

  const addNotification = (text) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [{ id, text }, ...prev].slice(0, 5));
  };

  const syncQueue = () => setQueueOrders(queueState.getAllOrders());

  useEffect(() => {
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = subtotal > 0 ? 35 : 0;
  const total = subtotal + deliveryCharge;

  const addToCart = (food) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === food.id);
      if (exists) {
        return prev.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
    addNotification(`🛒 ${food.name} added to cart.`);
  };

  const adjustCartQuantity = (foodId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === foodId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const placeOrder = () => {
    if (!cart.length) {
      setPanelMessage('Cart is empty.\nAdd food before placing order.');
      return;
    }

    const nextId = orderCounter;
    const customerName = ['Rahul', 'Aisha', 'Karan', 'Nia', 'Zoya'][Math.floor(Math.random() * 5)];
    const newOrder = {
      id: nextId,
      customer: customerName,
      items: cart.map((item) => ({ name: item.name, quantity: item.quantity })),
      total,
      status: 'waiting',
      createdAt: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
    };

    queueState.enqueue(newOrder);
    setOrderCounter(nextId + 1);
    syncQueue();
    setSelectedOrderId(newOrder.id);
    setPanelMessage(`ORDER CREATED\n#${newOrder.id}\nENQUEUE()\nAdded to rear of queue.`);
    addNotification(`🔔 Order #${newOrder.id} added to queue.`);
    setStats((prev) => ({ ...prev, total: prev.total + 1, waiting: prev.waiting + 1 }));
    setCart([]);
  };

  const handlePeek = () => {
    const front = queueState.peek();
    setPanelMessage(
      front
        ? `PEEK()\nFront Order:\n#${front.id}\nNo order was removed.`
        : 'PEEK()\nQueue is empty.'
    );
  };

  const handleSize = () => {
    const size = queueState.size();
    setPanelMessage(`QUEUE SIZE\n${size} order${size === 1 ? '' : 's'} waiting.`);
  };

  const handleDequeue = () => {
    const removed = queueState.dequeue();
    if (!removed) {
      setPanelMessage('DEQUEUE()\nQueue is empty.');
      return;
    }

    setCompletedOrders((prev) => [{ id: removed.id, customer: removed.customer, completedAt: 'just now' }, ...prev]);
    syncQueue();
    setPanelMessage(`DEQUEUE() executed\nOrder #${removed.id} completed.`);
    setStats((prev) => ({ ...prev, waiting: Math.max(0, prev.waiting - 1), completed: prev.completed + 1 }));
    addNotification(`✅ Order #${removed.id} completed.`);
  };

  const prepareFrontOrder = () => {
    const front = queueState.peek();
    if (!front) {
      setPanelMessage('START PREPARING\nQueue is empty.');
      return;
    }

    front.status = 'preparing';
    syncQueue();
    setStats((prev) => ({ ...prev, waiting: Math.max(0, prev.waiting - 1), preparing: prev.preparing + 1 }));
    setPanelMessage(`START PREPARING\nOrder #${front.id}\nPreparing... 80%`);
    addNotification(`👨‍🍳 Order #${front.id} is being prepared.`);
  };

  const finishFrontOrder = () => {
    const front = queueState.peek();
    if (!front) {
      setPanelMessage('READY!\nNo front order available.');
      return;
    }

    front.status = 'ready';
    syncQueue();
    setStats((prev) => ({ ...prev, preparing: Math.max(0, prev.preparing - 1), ready: prev.ready + 1 }));
    setPanelMessage(`READY! ✅\nOrder #${front.id} is ready for pickup.`);
    addNotification(`🍔 Order #${front.id} is ready.`);
  };

  const selectedOrder =
    queueOrders.find((order) => order.id === selectedOrderId) ||
    completedOrders.find((order) => order.id === selectedOrderId) ||
    queueOrders[0] ||
    null;

  const queuePosition = selectedOrder ? queueOrders.findIndex((order) => order.id === selectedOrder.id) + 1 : 0;

  const filteredMenu = menuItems.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      !search ||
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
  });

  return (
    <div className={`app-shell ${theme} ${presentationMode ? 'presentation' : ''}`}>
      <div className="app-glow" />

      <header className="topbar glass-panel">
        <div className="brand-wrap">
          <div className="brand-mark">F</div>
          <div>
            <div className="eyebrow">FoodFlow</div>
            <div className="brand-name">3D Queue Dining</div>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-button" onClick={() => addNotification('Sound toggled')} aria-label="sound toggle">
            <Bell size={18} />
          </button>
          <button className="primary-btn" onClick={() => setPresentationMode((prev) => !prev)}>
            {presentationMode ? 'Exit Demo' : '🎓 Demo'}
          </button>
        </div>
      </header>

      <main className="page-shell">
        {/* 3D Scene */}
        <ThreeDScene cameraView={cameraView} />

        <section className="content-grid">
          <div className="menu-column glass-panel">
            <div className="section-heading-row">
              <h3>Premium Menu</h3>
              <div className="search-box">
                <Search size={14} />
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search food..." />
              </div>
            </div>

            <div className="category-grid">
              {filteredMenu.map((food) => (
                <motion.article
                  key={food.id}
                  className={`food-card ${selectedFood.id === food.id ? 'selected' : ''}`}
                  whileHover={{ y: -12, scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFood(food)}
                >
                  <div className="card-top-row">
                    <div className="food-image" style={{ background: food.accent }}>
                      <div className="food-emoji">{food.icon}</div>
                    </div>
                    <button className="tiny-fav" type="button">♥</button>
                  </div>

                  <div className="food-body">
                    <h4>{food.name}</h4>
                    <p>{food.description}</p>
                    <div className="meta-line">
                      <span>{food.rating}⭐</span>
                      <span>{food.calories} cal</span>
                    </div>
                  </div>

                  <div className="card-bottom-row">
                    <strong>{formatCurrency(food.price)}</strong>
                    <button type="button" className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(food); }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="right-stack">
            <aside className="cart-panel glass-panel">
              <div className="section-heading-row">
                <h3><ShoppingCart size={18} /> Cart</h3>
                <div className="badge-pill">{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
              </div>

              <div className="cart-side-items">
                {cart.length === 0 ? (
                  <div className="empty-state">No items yet</div>
                ) : (
                  cart.map((item) => (
                    <motion.div className="cart-item" key={item.id} layout>
                      <div>
                        <strong>{item.name}</strong>
                        <small>{formatCurrency(item.price)}</small>
                      </div>
                      <div className="mini-controls">
                        <button type="button" onClick={() => adjustCartQuantity(item.id, -1)}><Minus size={12} /></button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => adjustCartQuantity(item.id, 1)}><Plus size={12} /></button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              <div className="totals-box">
                <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
                <div className="grand-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
              </div>

              <motion.button type="button" className="primary-btn full" onClick={placeOrder} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <CheckCircle2 size={18} /> PLACE ORDER
              </motion.button>
            </aside>
          </div>
        </section>

        <section className="queue-kitchen-grid">
          <div className="queue-panel glass-panel">
            <div className="section-heading-row">
              <h3>FIFO Queue</h3>
            </div>

            <div className="queue-visualizer">
              {queueOrders.map((order, index) => {
                const isFront = index === 0;
                return (
                  <motion.div
                    key={order.id}
                    className={`queue-node ${isFront ? 'front' : ''}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedOrderId(order.id)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="queue-id">#{order.id}</span>
                    <small>{order.customer}</small>
                    <div className="queue-status">{order.status}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="queue-control-panel">
              <motion.button type="button" className="control-btn" onClick={handlePeek} whileHover={{ scale: 1.05 }}>PEEK</motion.button>
              <motion.button type="button" className="control-btn" onClick={handleSize} whileHover={{ scale: 1.05 }}>SIZE</motion.button>
              <motion.button type="button" className="control-btn" onClick={handleDequeue} whileHover={{ scale: 1.05 }}>DEQUEUE</motion.button>
              <motion.button type="button" className="control-btn" onClick={placeOrder} whileHover={{ scale: 1.05 }}>ENQUEUE</motion.button>
            </div>
          </div>

          <div className="kitchen-panel glass-panel">
            <div className="section-heading-row">
              <h3><ChefHat size={18} /> Kitchen</h3>
            </div>

            <div className="prep-box">
              <div className="prep-badge">{frontOrder ? `Order #${frontOrder.id}` : 'No order'}</div>
              <div className="progress-bar">
                <motion.div className="progress-fill" animate={{ width: '80%' }} transition={{ duration: 2 }} />
              </div>
              <div className="prep-meta">Preparing...</div>
            </div>

            <div className="kitchen-actions">
              <motion.button type="button" className="primary-btn" onClick={prepareFrontOrder} whileHover={{ scale: 1.05 }}>START</motion.button>
              <motion.button type="button" className="secondary-btn" onClick={finishFrontOrder} whileHover={{ scale: 1.05 }}>READY</motion.button>
            </div>
          </div>
        </section>

        <section className="bottom-panel glass-panel">
          <div className="section-heading-row">
            <h3><Cpu size={18} /> Control Panel</h3>
          </div>
          <pre>{panelMessage}</pre>
        </section>
      </main>
    </div>
  );
}

export default App;
