const express = require("express")
const { getUserById, createUser } = require("./../controllers/userController")

const router = express.Router()

router.get("/:id" , getUserById)
router.post("/" , createUser)

module.exports = router ;