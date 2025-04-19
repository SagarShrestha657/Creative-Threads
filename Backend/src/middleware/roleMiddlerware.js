
export const Checkrole = async (req, res, next) => {
    try {
        console.log(req.query.role)
        if (req.query.role) {
            const role = req.query.role;
            if (role === "artist") {
                return next();
            }
        }
        const role = req.body.role
        // console.log(req.body.role)
        if (role === "artist") {
            return next();
        }
        return res.status(401).json({ message: "Access denied. You are not an artist." });
    }
    catch (error) {
        console.log("Error in role middleware", error.message)
        res.status(500).json({ message: "Server Error" })
    }

}