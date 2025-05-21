module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily :{
      display : ["Poppins","sans-serif"],
    } ,
    extend: {
      colors : {
      primary: "#05B6D3",
      secondary: "#EF863E",
      },
      backgroundImage:{
        'login-bg-img' : "url('./src/assets/images/login.jpg')",
        'signupC-bg-img' : "url('./src/assets/images/SC.jpg')",
        'signupD-bg-img' : "url('./src/assets/images/SD.jpg')",
        
      },
      
      
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
