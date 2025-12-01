require('dotenv').config();
const express=require('express');const cors=require('cors');const db=require('./db');
const app=express();const port=process.env.PORT||4000;
app.use(cors());app.use(express.json());
app.get('/health',async(req,res)=>{try{await db.query('SELECT 1');res.json({status:'ok'});}catch(e){res.status(500).json({status:'error'});}});
app.get('/users',async(req,res)=>{try{const r=await db.query('SELECT id,name,email FROM users ORDER BY id');res.json(r.rows);}catch(e){res.status(500).json({error:'Failed'});}});
app.get('/items',async(req,res)=>{try{const r=await db.query(`SELECT i.id,i.name,i.price,u.name AS owner_name FROM items i LEFT JOIN users u ON i.user_id=u.id ORDER BY i.id`);res.json(r.rows);}catch(e){res.status(500).json({error:'Failed'});}});
app.get('/',(req,res)=>res.json({message:'Pickup API running'}));
app.listen(port,()=>console.log('API on',port));