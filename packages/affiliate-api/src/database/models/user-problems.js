const mongoose = require('mongoose');

const userProblemsSchema = new mongoose.Schema({
    
    userId:{type:String, require:true},

    problemIds:[{
        // type:mongoose.Types.ObjectId, ref:'Problem'
        type:String
    }]
});

const UserProblems = mongoose.model('UserProblems',userProblemsSchema);
export default UserProblems;