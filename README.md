# FoodFlow 3D Queue

A premium interactive food ordering dashboard with a 3D restaurant scene and a real FIFO queue simulation. This project demonstrates how a food-ordering workflow can be modeled using a queue data structure while keeping the experience visually rich and interactive.

## Features

- 3D-style restaurant visualizer with animated scene elements
- Food menu cards with pricing and ingredient details
- Cart and checkout flow for ordering
- Real FIFO queue logic using custom Queue class
- Queue operations: enqueue, peek, dequeue, size, and empty checks
- Kitchen workflow panel for preparing and completing orders
- Notification center and live queue stats
- Dark/light theme toggle
- Presentation mode for demo-friendly UI

## Tech Stack

- React
- Vite
- Framer Motion
- Lucide React
- CSS Modules / custom CSS

## Project Structure

- `src/App.jsx` — main UI and queue logic
- `src/data/menu.js` — menu data
- `src/data/queue.js` — FIFO queue implementation
- `src/index.css` — styling and layout
- `src/main.jsx` — app bootstrap

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build the project for production:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```

## Demo Flow

- Choose food items from the menu
- Add them to the cart
- Place an order to enqueue a new customer
- Use queue controls to test FIFO behavior
- Prepare the front order in the kitchen
- Complete the order and observe queue progression

## Queue Logic

The queue behavior is implemented in `src/data/queue.js` and follows standard FIFO rules:

- enqueue adds to the rear
- dequeue removes from the front
- peek shows the current front item
- size returns the current queue length
- isEmpty checks whether the queue is empty

## License

This project is licensed under the MIT License.
