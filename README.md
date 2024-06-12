## PickMe Demo

The diagram below shows how to index and query dishes in a way that aggregates by restaurant.

Dishes are indexed with restaurant objects. The 'distinct' attribute is set to `true`, grouping by `restaurantID`.

This involves a sequence of two query steps:
1. Query dishes and receive a set of different restaurants.
2. Multiquery with the original query filtered by restaurant and `distinct: false` to get all dishes from that restaurant.

<img src="assets/diagram.png" alt="Workflow diagram - Fiona Carbonell" style="max-width: 650px; height: auto;">

Below you can see the preview of the app:

<div style="text-align: center;">
<img src="assets/preview.png" alt="App preview" style="max-width: 650px; max-height: 500px;">
</div>

## Setup
```bash
git clone https://github.com/oscell/PickMe_Algolia_demo.git
cd PickMe_Algolia_demo
```

```bash
npm install
```

## Usage

### 1. Terminal 1: Start Backend

> When you first launch this it will generate the `.env` file. You will need to provide your **AppID** and **Search API Key**. If this doesn't work for any reason you can also create your own `.env` file from the `.env.template` file.
```bash
npm run server
```

### 2. Terminal 2: Start React App
```bash
npm start
```

Go to [localhost:3000](http://localhost:3000/)
