const express = require('express');
const app = express();
app.use(express.json());
let data = ["1", "2"]; 
app.get('/data', (req, res) => {res.status(200).json(data);});
app.post('/data', (req, res) => {const { item } = req.body;
  if (!item) {return res.status(400).send('item field is required');}
  data.push(item);res.status(200).json(data);});
  app.put('/data', (req, res) => {const itemToUpdate = req.query.item; const { newItem } = req.body;  
  if (!itemToUpdate) {return res.status(400).send('Query parameter "item" is required');}
  if (!newItem) {return res.status(400).send('Body field "newItem" is required');}
  const index = data.indexOf(itemToUpdate);
  if (index === -1) {return res.status(404).send('Item to update not found');}
  data[index] = newItem;
  res.status(200).json(data);});
  app.delete('/data', (req, res)=>{
  const itemToDelete = req.query.item;
  if (!itemToDelete) {return res.status(400).send('Query parameter "item" is required');}
  const index = data.indexOf(itemToDelete);
  if (index === -1) {return res.status(404).send('Item to delete not found');}
  data.splice(index, 1);
  res.status(200).json(data);});
app.use((req, res)=>{res.status(404).send('Not Found');});
const port = 3000;
app.listen(port, ()=>{console.log(`Express сервер http://localhost:${port}/data хаяг дээр ажиллаж байна`);});
