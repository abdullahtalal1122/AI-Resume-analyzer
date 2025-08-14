const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fyp_auth');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to verify password
userSchema.methods.verifyPassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = mongoose.model('User', userSchema);

// Resume Analysis Schema
const resumeAnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    originalFileName: {
        type: String,
        required: true
    },
    s3Key: {
        type: String,
        required: true
    },
    s3Url: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    analysis: {
        skills: [String],
        jobTitles: [String],
        improvements: [String],
        professionalSummary: String,
        aiProvider: String,
        fallback: Boolean
    },
    analysisScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    industry: String,
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing'
    }
}, {
    timestamps: true
});

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

// User operations
const userOperations = {
    // Create new user
    create: async (userData) => {
        try {
            const { name, email, password } = userData;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already exists');
            }

            const user = new User({ name, email, password });
            await user.save();

            return user;
        } catch (error) {
            throw error;
        }
    },

    // Find user by email
    findByEmail: async (email) => {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw error;
        }
    },

    // Find user by ID
    findById: async (id) => {
        try {
            return await User.findById(id).select('-password');
        } catch (error) {
            throw error;
        }
    },

    // Verify password
    verifyPassword: async (plainPassword, hashedPassword) => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
};

module.exports = {
    connectDB,
    User,
    ResumeAnalysis,
    userOperations
};