import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "remixicon/fonts/remixicon.css";
import "./index.scss";

import Header from "./components/Header/Header";
import HomeContent from "./HomeContent";
import Footer from "./components/Footer/Footer";


import Profile from "./components/Profile/Profile";
import Products from "./components/Products/Products";

export default function MainLayout() {
  return (
    <Router>
      <div className="mx-auto max-w-6xl">
        <Header />
        <div className="my-10">
          <Switch>
            <Route exact path="/" component={HomeContent} />
            <Route exact path="/profile" component={() => <Profile />} />
            <Route exact path="/products" component={() => <Products />} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
