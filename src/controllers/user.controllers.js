import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadonCloudinary from "../utils/Cloudinary.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        // console.log(`AccessToken : ${accessToken} RefreshToken: ${refreshToken}`)

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        console.log(error)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation
    // check if user already exists
    // check for avatar image
    // upload them to cloudinary
    // create user in db - user object
    // Remove password and refreshToken from res
    // check for user creation
    // return res - user registered

    const { username, email, password, fullname } = req.body

    if (
        [username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(409, "User already exists!")
    }

    let avatarLocalFilePath;

    if (req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalFilePath = req.files.avatar[0].path
    }
    const avatar = await uploadonCloudinary(avatarLocalFilePath)

    const user = await User.create({
        username,
        email,
        password,
        fullname,
        avatar: avatar?.url || ""
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user")
    }

    return res.
        status(200)
        .json(new ApiResponse(200, createdUser, "User Registered Successfully!"))

})

const loginUser = asyncHandler(async (req, res) => {
    // user details from frontend - email and password
    // check if user exists - if not return error
    // check password
    // generate refreshToken and accessToken
    // store refreshToken in db
    // send cookie

    const { email, password } = req.body

    if (!(email && password)) {
        throw new ApiError(401, "email and password is required")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User doesn't exist!")
    }

    const verifyPassword = await user.isPasswordCorrect(password)

    if (!verifyPassword) {
        throw new ApiError(401, "Incorrect Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully!"
            )
        )
})

export {
    registerUser,
    loginUser
}