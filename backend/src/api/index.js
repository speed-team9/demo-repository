// backend/api/index.js
const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

// 注意路径：api/index.js 和 dist 在同一级
const { AppModule } = require('../dist/app.module');

const server = express();
let appReady = false;

module.exports = async (req, res) => {
  if (!appReady) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();
    appReady = true;
  }
  server(req, res);
};