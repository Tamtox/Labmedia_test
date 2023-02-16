import "@/styles/app.scss";
import "@/styles/animation.scss";
import "@/styles/global_classes.scss";

// eslint-disable-next-line prettier/prettier
import React from 'react';

const Home = React.lazy(() => import("./pages/home"));

function App() {
  return (
    <main className="app">
      <div className="wrapper">
        <Home />
      </div>
    </main>
  );
}

export default App;
