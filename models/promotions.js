const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

const Promotions = mongoose.model("Promotion",promotionSchema);

module.exports = Promotions;