const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: "http://localhost:3010/",
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },

  devServer: {
    port: 3010,
    historyApiFallback: true,
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "portal",
      filename: "remoteEntry.js",
      remotes: {
        portal: "portal@http://localhost:3010/remoteEntry.js",
        manageusers: "manageusers@http://localhost:3011/remoteEntry.js",
        productsoffering: "productsoffering@http://localhost:3012/remoteEntry.js",
      },
      exposes: {
        "./Header": "./src/components/Header/Header.jsx",
        "./Footer": "./src/components/Footer/Footer.jsx",
        "./products": "./src/products.js",
        "./HomeContent": "./src/HomeContent.jsx",
        "./MainLayout": "./src/MainLayout.jsx",
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
        "solid-js": { singleton: true, requiredVersion: deps["solid-js"] },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
  ],
};
