import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  ChefHat,
  Clock3,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trash2,
  Trophy,
  Plus,
  Minus,
  ArrowRight,
  Layers3,
  Cpu,
} from 'lucide-react';
import { menuItems } from './data/menu';
import { Queue } from './data/queue';

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

function App() {
  const [theme, setTheme] = useState('dark');
  const [cameraView, setCameraView] = useState('queue');
  const [panelMessage, setPanelMessage] = useState('PEEK()\nFront Order:\n#102\nNo order was removed.');
  const [selectedFood, setSelectedFood] = useState(menuItems[0]);
  const [selectedOrderId, setSelectedOrderId] = useState(102);
  const [searchTerm, setSearchTerm] = useState('');
  const [presentationMode, setPresentationMode] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
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

  const handleIsEmpty = () => {
    const empty = queueState.isEmpty();
    setPanelMessage(empty ? 'IS EMPTY()\nQueue is empty.' : 'Queue is NOT EMPTY.');
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

  const processFrontOrder = () => {
    const front = queueState.peek();
    if (!front) {
      setPanelMessage('FRONT ORDER\nQueue is empty.');
      return;
    }

    setPanelMessage(`FRONT ORDER\nOrder #${front.id}\n👨‍🍳 CHEF\nPREPARING`);
    addNotification(`🔵 Front order #${front.id} is highlighted.`);
  };

  const selectedOrder =
    queueOrders.find((order) => order.id === selectedOrderId) ||
    completedOrders.find((order) => order.id === selectedOrderId) ||
    queueOrders[0] ||
    null;

  const queuePosition = selectedOrder ? queueOrders.findIndex((order) => order.id === selectedOrder.id) + 1 : 0;

  const handleDragOver = (event) => event.preventDefault();

  const handleDrop = (id) => {
    const frontId = frontOrder ? frontOrder.id : null;
    if (frontId && id !== frontId && id > frontId) {
      setPanelMessage('⚠ FIFO RULE\nOrder #104 cannot be processed yet.\nOrder #101 is ahead in the queue.');
      addNotification('⚠ FIFO Rule Protected');
      return;
    }
    setSelectedOrderId(id);
    setPanelMessage(`Order #${id}\nRepositioned in valid queue order.`);
  };

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
            <div className="brand-name">Queue Dining Studio</div>
          </div>
        </div>

        <nav className="nav-actions">
          <button className="nav-button active">Overview</button>
          <button className="nav-button">3D Queue</button>
          <button className="nav-button">Kitchen</button>
          <button className="nav-button">Analytics</button>
        </nav>

        <div className="header-actions">
          <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="toggle theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-button" onClick={() => setSoundOn((prev) => !prev)} aria-label="sound toggle">
            <Bell size={18} />
          </button>
          <button className="primary-btn" onClick={() => setPresentationMode((prev) => !prev)}>
            {presentationMode ? 'Exit Demo' : '🎓 Presentation Mode'}
          </button>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero-panel glass-panel">
          <div className="hero-copy">
            <p className="label-pill">Interactive food-order queue system</p>
            <h1>3D FoodFlow experience with real FIFO queue logic.</h1>
            <p className="lead">
              Premium restaurant simulation where orders move through queue, kitchen, and completion using a real FIFO queue data structure.
            </p>

            <div className="hero-cta-row">
              <button className="primary-btn large" onClick={placeOrder}>Place Order</button>
              <button className="secondary-btn large" onClick={() => setCameraView('queue')}>Queue View</button>
            </div>

            <div className="mini-stats-grid">
              <div className="mini-stat">
                <span className="mini-title">Queue</span>
                <strong>{queueState.size()}</strong>
              </div>
              <div className="mini-stat">
                <span className="mini-title">Prep</span>
                <strong>{stats.preparing}</strong>
              </div>
              <div className="mini-stat">
                <span className="mini-title">Ready</span>
                <strong>{stats.ready}</strong>
              </div>
            </div>
          </div>

          <div className="scene-shell">
            <div className={`restaurant-scene ${cameraView}`}>
              <div className="scene-floor" />
              <div className="counter-3d">
                <div className="counter-top" />
                <div className="counter-surface" />
              </div>

              <motion.div className="food-entity burger-entity" whileHover={{ rotateY: 22, scale: 1.08 }} onClick={() => setSelectedFood(getFoodById('cheese-burger'))}>
                <div className="food-icon">🍔</div>
              </motion.div>

              <motion.div className="food-entity pizza-entity" whileHover={{ rotateY: -20, scale: 1.08 }} onClick={() => setSelectedFood(getFoodById('pepperoni-pizza'))}>
                <div className="food-icon">🍕</div>
              </motion.div>

              <motion.div className="food-entity drink-entity" whileHover={{ rotateY: 18, scale: 1.06 }} onClick={() => setSelectedFood(getFoodById('coke-float'))}>
                <div className="food-icon">🥤</div>
              </motion.div>

              <motion.div className="chef-avatar" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} onClick={() => setCameraView('kitchen')}>
                <div className="chef-head">👨‍🍳</div>
                <div className="chef-body" />
              </motion.div>

              <div className="queue-zone">
                <div className="queue-pill">FRONT</div>
                <div className="queue-line" />
                {queueOrders.slice(0, 4).map((order, idx) => (
                  <div key={order.id} className={`queue-card ${idx === 0 ? 'small' : ''}`}>#{order.id}</div>
                ))}
                <div className="queue-pill rear">REAR</div>
              </div>

              <motion.div className="floating-order-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span>#105</span>
              </motion.div>

              <div className="camera-surface">
                <button className="area-button" onClick={() => setCameraView('kitchen')}>KITCHEN</button>
                <button className="area-button" onClick={() => setCameraView('queue')}>QUEUE</button>
                <button className="area-button" onClick={() => setCameraView('customer')}>MENU</button>
              </div>
            </div>
          </div>
        </section>

        <section className="content-grid">
          <div className="menu-column glass-panel">
            <div className="section-heading-row">
              <h3>Premium Menu</h3>
              <div className="search-box">
                <Search size={14} />
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search food or category" />
              </div>
            </div>

            <div className="category-grid">
              {filteredMenu.map((food) => (
                <motion.article
                  key={food.id}
                  className={`food-card ${selectedFood.id === food.id ? 'selected' : ''}`}
                  whileHover={{ y: -8, rotateX: 4, rotateY: -4 }}
                  onClick={() => setSelectedFood(food)}
                >
                  <div className="card-top-row">
                    <div className="food-emoji" style={{ background: food.accent }}>{food.icon}</div>
                    <button className="tiny-fav" type="button">♥</button>
                  </div>

                  <div className="food-body">
                    <div className="food-title-block">
                      <h4>{food.name}</h4>
                      <span>{food.rating}⭐</span>
                    </div>
                    <p>{food.description}</p>
                    <div className="meta-line">
                      <span>{food.calories} cal</span>
                      <span>{food.category}</span>
                    </div>
                    <ul>
                      {food.ingredients.map((ingredient) => (
                        <li key={ingredient}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-bottom-row">
                    <strong>{formatCurrency(food.price)}</strong>
                    <div className="add-actions">
                      <button type="button" className="small-icon" onClick={(e) => { e.stopPropagation(); setSelectedFood(food); }}>
                        <Minus size={12} />
                      </button>
                      <span>1</span>
                      <button type="button" className="small-icon" onClick={(e) => { e.stopPropagation(); addToCart(food); }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div className="right-stack">
            <aside className="cart-panel glass-panel">
              <div className="section-heading-row">
                <h3>Cart / Tray</h3>
                <div className="badge-pill">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</div>
              </div>

              <div className="cart-side-items">
                {cart.length === 0 ? (
                  <div className="empty-state">No food selected yet.</div>
                ) : (
                  cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <small>{formatCurrency(item.price)} each</small>
                      </div>
                      <div className="mini-controls">
                        <button type="button" onClick={() => adjustCartQuantity(item.id, -1)}><Minus size={12} /></button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => adjustCartQuantity(item.id, 1)}><Plus size={12} /></button>
                        <button type="button" className="remove-btn" onClick={() => adjustCartQuantity(item.id, -item.quantity)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="totals-box">
                <div><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
                <div><span>Delivery</span><strong>{formatCurrency(deliveryCharge)}</strong></div>
                <div className="grand-total"><span>Total</span><strong>{formatCurrency(total)}</strong></div>
              </div>

              <button type="button" className="primary-btn full" onClick={placeOrder}>PLACE ORDER</button>
            </aside>

            <aside className="tracker-panel glass-panel">
              <div className="section-heading-row">
                <h3>Track Your Order</h3>
                <Clock3 size={16} />
              </div>

              <div className="track-input">
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Order ID #104" />
                <button type="button">TRACK</button>
              </div>

              <div className="timeline">
                <p>Order #104</p>
                <ul>
                  <li className="done">✓ Order Placed</li>
                  <li className="done">✓ Added to Queue</li>
                  <li className="active">● Waiting</li>
                  <li>○ Preparing</li>
                  <li>○ Ready</li>
                  <li>○ Completed</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="queue-kitchen-grid">
          <div className="queue-panel glass-panel">
            <div className="section-heading-row">
              <h3>3D Queue / FIFO</h3>
              <div className="queue-type-pills">
                <button type="button" className="small-pill" onClick={handlePeek}>PEEK</button>
                <button type="button" className="small-pill" onClick={handleSize}>SIZE</button>
                <button type="button" className="small-pill" onClick={handleIsEmpty}>IS EMPTY</button>
              </div>
            </div>

            <div className="queue-visualizer" onDragOver={handleDragOver}>
              {queueOrders.map((order, index) => {
                const isFront = index === 0;
                const match = searchTerm && order.id.toString().includes(searchTerm.replace('#', ''));
                return (
                  <motion.div
                    key={order.id}
                    draggable
                    onDragStart={() => setSelectedOrderId(order.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(order.id)}
                    className={`queue-node ${isFront ? 'front' : ''} ${match ? 'search-match' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <span className="queue-id">#{order.id}</span>
                    <small>{order.customer}</small>
                    <div className="queue-status-note">{order.status}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="queue-control-panel">
              <button type="button" className="control-btn green" onClick={placeOrder}>🟢 ENQUEUE</button>
              <button type="button" className="control-btn blue" onClick={handlePeek}>🔵 PEEK</button>
              <button type="button" className="control-btn orange" onClick={handleDequeue}>🟠 DEQUEUE</button>
              <button type="button" className="control-btn neutral" onClick={handleIsEmpty}>⚪ IS EMPTY</button>
              <button type="button" className="control-btn slate" onClick={handleSize}>📊 SIZE</button>
            </div>
          </div>

          <div className="kitchen-panel glass-panel">
            <div className="section-heading-row">
              <h3>Kitchen Simulation</h3>
              <ChefHat size={18} />
            </div>

            <div className="kitchen-scene">
              <div className="kitchen-steps">
                <span>ORDER</span>
                <ArrowRight size={14} />
                <span>KITCHEN</span>
                <ArrowRight size={14} />
                <span>👨‍🍳</span>
                <ArrowRight size={14} />
                <span>🍳</span>
                <ArrowRight size={14} />
                <span>READY</span>
              </div>

              <div className="prep-box">
                <div className="prep-badge">{frontOrder ? `Order #${frontOrder.id}` : 'No order'}</div>
                <div className="progress-label">Preparing...</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '80%' }} />
                </div>
                <div className="prep-meta">
                  <span>Estimated time: 00:32</span>
                  <span>80%</span>
                </div>
              </div>

              <div className="kitchen-actions">
                <button type="button" className="primary-btn" onClick={prepareFrontOrder}>START PREPARING</button>
                <button type="button" className="secondary-btn" onClick={finishFrontOrder}>READY</button>
              </div>
            </div>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="detail-panel glass-panel">
            <div className="section-heading-row">
              <h3>Order Detail</h3>
              <Sparkles size={16} />
            </div>

            {selectedOrder ? (
              <div className="order-details-card">
                <div className="order-header-row">
                  <h4>Order #{selectedOrder.id}</h4>
                  <span className="badge-pill">{selectedOrder.status}</span>
                </div>
                <div className="detail-grid">
                  <div>
                    <label>Customer</label>
                    <strong>{selectedOrder.customer}</strong>
                  </div>
                  <div>
                    <label>Total</label>
                    <strong>{formatCurrency(selectedOrder.total)}</strong>
                  </div>
                  <div>
                    <label>Queue Position</label>
                    <strong>{queuePosition || 1}</strong>
                  </div>
                  <div>
                    <label>Created</label>
                    <strong>{selectedOrder.createdAt}</strong>
                  </div>
                </div>
                <div className="detail-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div className="detail-item" key={`${selectedOrder.id}-${index}`}>
                      <span>{item.name}</span>
                      <strong>× {item.quantity}</strong>
                    </div>
                  ))}
                </div>

                <div className="front-flag-row">
                  {frontOrder && frontOrder.id === selectedOrder.id ? (
                    <button type="button" className="primary-btn" onClick={processFrontOrder}>PROCESS ORDER</button>
                  ) : (
                    <button type="button" className="secondary-btn" onClick={() => setPanelMessage('🚫 Cannot Process\nQueue follows FIFO.\nOrder #101 must be processed first.')}>PROCESS ORDER</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-state">No order selected.</div>
            )}
          </div>

          <div className="notification-panel glass-panel">
            <div className="section-heading-row">
              <h3>Notification Center</h3>
              <Bell size={16} />
            </div>
            <div className="notification-list">
              {notifications.map((note) => (
                <div className="notification-item" key={note.id}>{note.text}</div>
              ))}
            </div>
          </div>

          <div className="analysis-panel glass-panel">
            <div className="section-heading-row">
              <h3>Live Queue Statistics</h3>
              <Layers3 size={16} />
            </div>
            <div className="stats-grid">
              {Object.entries(stats).map(([key, value]) => (
                <div className="stat-card" key={key}>
                  <span>{key.toUpperCase()}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="data-flow-panel glass-panel">
          <div className="section-heading-row">
            <h3>Queue Flow Visualizer</h3>
            <Trophy size={16} />
          </div>
          <div className="flow-steps">
            <span>CUSTOMER</span>
            <ArrowRight size={14} />
            <span>PLACE ORDER</span>
            <ArrowRight size={14} />
            <span>ENQUEUE</span>
            <ArrowRight size={14} />
            <span>QUEUE</span>
            <ArrowRight size={14} />
            <span>FRONT</span>
            <ArrowRight size={14} />
            <span>PREPARE</span>
            <ArrowRight size={14} />
            <span>READY</span>
            <ArrowRight size={14} />
            <span>DEQUEUE</span>
            <ArrowRight size={14} />
            <span>COMPLETED</span>
          </div>
        </section>

        <section className="bottom-row">
          <div className="panel-message glass-panel">
            <div className="section-heading-row">
              <h3>Queue Control</h3>
              <Cpu size={16} />
            </div>
            <pre>{panelMessage}</pre>
          </div>

          <div className="food-details glass-panel">
            <div className="section-heading-row">
              <h3>Selected Food</h3>
              <Sparkles size={16} />
            </div>
            <div className="selected-food-hero">
              <div className="food-emoji large" style={{ background: selectedFood.accent }}>{selectedFood.icon}</div>
              <div>
                <h4>{selectedFood.name}</h4>
                <p>{selectedFood.description}</p>
                <strong>{formatCurrency(selectedFood.price)}</strong>
              </div>
            </div>
            <button type="button" className="primary-btn full" onClick={() => addToCart(selectedFood)}>ADD TO CART</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
