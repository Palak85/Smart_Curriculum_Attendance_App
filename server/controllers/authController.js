import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'


const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ success: false, error: "Email and password are required. Send as JSON body: { email, password }" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, error: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Wrong Password" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "10d" }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const verify = (req,res) => {
    if(!req.user){
        return res.status(401).json({ success: false, error: 'User not authenticated' });
    }
    return res.status(200).json({success: true, user: req.user})
}

export { login, verify }

