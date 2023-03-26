const express = require('express');
const router = express.Router();
const connection = require('../connect')


router.get('/', (req, res) => {
  const query = "SELECT * FROM `user`"
  connection.query(query,(err, results, fields)=> {
          console.log(results); // results contains rows returned by server
          if (err) {
              return res.status(500).json({ message: err });

          } else {
              return res.status(200).json({ data: results });
          }
          // console.log(fields); // fields contains extra meta data about results, if available
      }
  );
})

router.post('/', (req, res) => {
  const { name, email } = req.body;
  const newUser = { name, email };
  const query = 'INSERT INTO user SET ?';
  connection.query(query, newUser, (err, results) => {
      if (err) {
          return res.status(500).json({ message: err })
      } else {
          return res.status(200).json({ message: "create success" })
      }
  })
})

router.put('/:id', (req, res) => {
  const userId =req.params["id"];
  const { name, email } = req.body;
  const userData = { name, email };
  const query = 'UPDATE user SET ? WHERE id = ?';
  connection.query(query, [userData,userId], (err, results) => {
      if (err) {
          return res.status(500).json({ message: err })
      } else {
          return res.status(200).json({ message: "update success" })
      }
  })
})

router.delete('/:id', (req, res) => {
  const userId =req.params["id"];
  const query = 'DELETE FROM user WHERE id = ?';
  connection.query(query, userId, (err, results) => {
      if (err) {
          return res.status(500).json({ message: err })
      } else if(results.affectedRows ===0) {
          return res.status(400).json({ message: "user not found" })
      }else{
          return res.status(204).send()
      }
  })
})

module.exports = router;
