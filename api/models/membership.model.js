import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
    name: {
         type: String,
          required: true 
        },
    email: {
         type: String, 
         required: true
         },
    mobile: { 
        type: String,
        required: true 
    },
    adress: {
         type: String,
          required: true 
    }, 

    batch:{
        type: String,
        required: true 
    },
    regNo:{
        type: String,
        required: true 
    },
     
   
    userId: {
         type: String, 
         required: true 
    },
    isMember: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Membership = mongoose.model('Membership', MembershipSchema);
export default Membership;
