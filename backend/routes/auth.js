const express = require("express");
const user = require("../models/User");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const bcyrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "amrit@2002";

// Create a user using POST "/api/auth/"
router.post(
    "/createuser",
    [
        body("email", "Enter a valid name").isEmail(),
        body("name").isLength({ min: 3 }),
        body("password").isLength({ min: 5 }),
    ],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({
                    success,
                    error: "Sorry, user with above email already exists",
                });
            }
            const salt = await bcyrpt.genSalt(10);
            const secPass = await bcyrpt.hash(req.body.password, salt);
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });

            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error!");
        }
    }
);

router.post(
    "/loginuser",
    [
        body("email", "Enter a valid name").isEmail(),
        body("password", "Password can't be blank").exists(),
    ],
    async (req, res) => {
        let success = false;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({
                    success,
                    error: "Please try to login with correct credentials",
                });
            }
            const passwordCompare = await bcyrpt.compare(
                password,
                user.password
            );
            if (!passwordCompare) {
                return res.status(400).json({
                    success,
                    error: "Please try to login with correct credentials",
                });
            }
            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            success = true;
            res.json({ success, authToken });
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error! " + error);
        }
    }
);

router.get("/getuser", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error!");
    }
});

module.exports = router;
