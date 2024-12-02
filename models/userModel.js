const mongoose= require("mongoose");
const bcrypt= require("bcryptjs"); 
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/sravya/image/upload/v1726311060/dqoz4p7mfltzpkggqeet.jpg",
    },
    
    githubToken: { type: String,required: true },
  },
  { timestamps: true }
);
userSchema.methods.matchPassword= async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
userSchema.pre('save', async function(next) {
    if(!this.isModified){
        next();
    }
    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
    // // Hash the githubToken if it's being modified
    // if (this.githubToken && this.isModified('githubToken')) {
    //   const saltForToken = await bcrypt.genSalt(10);
    //   this.githubToken = await bcrypt.hash(this.githubToken, saltForToken);
    // }

    next();
});
const User= mongoose.model("User", userSchema);
module.exports=User;